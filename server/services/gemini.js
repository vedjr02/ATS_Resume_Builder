import { GoogleGenerativeAI } from '@google/generative-ai';
import { buildResumeRewriterPrompt, parseResumeJson } from '../prompts.js';
import { buildResumeLatex } from './latexBuilder.js';
import {
  formatGeminiError,
  getActiveModel,
  isFatalGeminiError,
  isRateLimitError,
  isRetryableGeminiError,
  sleep,
} from './geminiRetry.js';

const MAX_RETRIES = 2;

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
  const modelName = getActiveModel();
  let lastError = null;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      return await callGeminiWithModel(modelName, prompt, maxOutputTokens);
    } catch (error) {
      lastError = error;

      if (isFatalGeminiError(error) || isRateLimitError(error)) {
