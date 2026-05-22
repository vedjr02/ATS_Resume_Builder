import { GoogleGenerativeAI } from '@google/generative-ai';
import { buildResumeRewriterPrompt, parseResumeJson } from '../prompts.js';
import { buildResumeLatex } from './latexBuilder.js';
import {
  formatGeminiError,
