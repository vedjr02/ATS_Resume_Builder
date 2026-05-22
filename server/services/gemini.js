import { GoogleGenerativeAI } from '@google/generative-ai';
import { buildResumeRewriterPrompt, parseResumeJson } from '../prompts.js';
import { buildResumeLatex } from './latexBuilder.js';
import {
  formatGeminiError,
  getModelFallbacks,
  isFatalGeminiError,
  isRetryableGeminiError,
  sleep,
} from './geminiRetry.js';

const MAX_ATTEMPTS_PER_MODEL = 3;

function getClient() {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('Gemini API key not configured.');
  }

  return new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
}

async function callGeminiWithModel(modelName, prompt, maxOutputTokens) {
  const model = getClient().getGenerativeModel({
    model: modelName,
    generationConfig: {
      maxOutputTokens,
      responseMimeType: 'application/json',
    },
  });

  const result = await model.generateContent(prompt);
  const text = result.response.text()?.trim();

  if (!text) {
    throw new Error('Gemini returned an empty response.');
  }

  return text;
}

async function callGemini(prompt, maxOutputTokens) {
  const models = getModelFallbacks();
  let lastError = null;

  for (const modelName of models) {
    for (let attempt = 0; attempt < MAX_ATTEMPTS_PER_MODEL; attempt++) {
      try {
        return await callGeminiWithModel(modelName, prompt, maxOutputTokens);
      } catch (error) {
        lastError = error;

        if (isFatalGeminiError(error)) {
          throw formatGeminiError(error);
        }

        const shouldRetry = isRetryableGeminiError(error) && attempt < MAX_ATTEMPTS_PER_MODEL - 1;
        if (shouldRetry) {
          await sleep(1000 * 2 ** attempt);
          continue;
        }

        break;
      }
    }
  }

  throw formatGeminiError(lastError);
}

export async function rewriteResume(jobDescription, currentResume) {
  const prompt = buildResumeRewriterPrompt(jobDescription, currentResume);
  const rawJson = await callGemini(prompt, 8192);
  return parseResumeJson(rawJson);
}

export async function convertToLatex(resumeData) {
  return buildResumeLatex(resumeData);
}
