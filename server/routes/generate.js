import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { rewriteResume, convertToLatex } from '../services/gemini.js';
import { compileLatexToPdf } from '../services/overleaf.js';

const router = Router();

const generateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 'error',
    message: 'Too many requests. Please try again in an hour.',
  },
});

function sendStatus(res, step, message) {
  res.write(`data: ${JSON.stringify({ type: 'status', step, message })}\n\n`);
}

function sendResult(res, payload) {
  res.write(`data: ${JSON.stringify({ type: 'result', ...payload })}\n\n`);
}

function sendError(res, message) {
  res.write(`data: ${JSON.stringify({ type: 'error', status: 'error', message })}\n\n`);
}

router.post('/generate', generateLimiter, async (req, res) => {
  const { jobDescription, currentResume } = req.body ?? {};

  if (!jobDescription?.trim() || !currentResume?.trim()) {
    return res.status(400).json({
      status: 'error',
      message: 'Both job description and current resume are required.',
    });
  }

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders?.();

  try {
    sendStatus(res, 1, 'Analyzing job description…');

    sendStatus(res, 2, 'Rewriting resume with Gemini…');
    const resumeData = await rewriteResume(jobDescription, currentResume);

    sendStatus(res, 3, 'Building LaTeX from template…');
    const latexCode = await convertToLatex(resumeData);

    sendStatus(res, 4, 'Compiling PDF on Overleaf…');
    const { pdfUrl, projectUrl, pdfBase64 } = await compileLatexToPdf(latexCode);

    sendStatus(res, 5, 'Done!');
    sendResult(res, {
      status: 'success',
      pdfUrl,
      projectUrl,
      pdfBase64,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unexpected error occurred.';
    sendError(res, message);
  } finally {
    res.end();
  }
});

export default router;
