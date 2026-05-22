import { GoogleGenerativeAI } from '@google/generative-ai';
import { buildResumeRewriterPrompt, parseResumeJson } from '../prompts.js';
import { buildResumeLatex } from './latexBuilder.js';

const DEFAULT_MODEL = 'gemini-2.5-flash';

function getModel(maxOutputTokens) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('Gemini API key not configured.');
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  return genAI.getGenerativeModel({
    model: process.env.GEMINI_MODEL || DEFAULT_MODEL,
    generationConfig: {
      maxOutputTokens,
      responseMimeType: 'application/json',
    },
  });
}

async function callGemini(prompt, maxOutputTokens) {
  const model = getModel(maxOutputTokens);

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text()?.trim();

    if (!text) {
      throw new Error('Gemini returned an empty response.');
    }

    return text;
  } catch (error) {
    if (error?.status === 429) {
      throw new Error(
        'Gemini rate limit reached. Wait a minute and try again, or check your quota at https://aistudio.google.com/'
      );
    }
    if (error?.status === 403) {
      throw new Error('Gemini API key invalid or access denied. Check GEMINI_API_KEY in your .env file.');
    }
    throw error instanceof Error ? error : new Error('Gemini request failed.');
  }
}

export async function rewriteResume(jobDescription, currentResume) {
  const prompt = buildResumeRewriterPrompt(jobDescription, currentResume);
  const rawJson = await callGemini(prompt, 8192);
  return parseResumeJson(rawJson);
}

export async function convertToLatex(resumeData) {
  return buildResumeLatex(resumeData);
}
