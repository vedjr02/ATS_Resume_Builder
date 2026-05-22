export function getErrorStatus(error) {
  if (error?.status) return error.status;
  if (error?.statusCode) return error.statusCode;

  const match = String(error?.message || '').match(/\[(\d{3})\s/);
  return match ? Number(match[1]) : null;
}

export function isRetryableGeminiError(error) {
  const status = getErrorStatus(error);
  if ([429, 500, 502, 503, 504].includes(status)) return true;

  const message = String(error?.message || '').toLowerCase();
  return (
    message.includes('high demand') ||
    message.includes('unavailable') ||
    message.includes('overloaded') ||
    message.includes('rate limit') ||
    message.includes('resource exhausted')
  );
}

export function isFatalGeminiError(error) {
  const status = getErrorStatus(error);
  return status === 403 || status === 401 || status === 400;
}

export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function getModelFallbacks() {
  const preferred = process.env.GEMINI_MODEL?.trim();
  const defaults = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-2.0-flash-lite'];

  if (preferred) {
    return [...new Set([preferred, ...defaults.filter((model) => model !== preferred)])];
  }

  return defaults;
}

export function formatGeminiError(error) {
  const status = getErrorStatus(error);

  if (status === 403 || status === 401) {
    return new Error('Gemini API key invalid or access denied. Check GEMINI_API_KEY in your environment settings.');
  }

  if (status === 429) {
    return new Error('Gemini rate limit reached. Please wait a minute and try again.');
  }

  if (status === 503 || status === 502 || status === 504) {
    return new Error(
      'Gemini is temporarily overloaded. We retried with backup models — please wait a few seconds and click Try again.'
    );
  }

  if (error instanceof Error) {
    return new Error(error.message.replace(/\[GoogleGenerativeAI Error\]:\s*/i, '').trim());
  }

  return new Error('Gemini request failed. Please try again.');
}
