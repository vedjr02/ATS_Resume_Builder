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
