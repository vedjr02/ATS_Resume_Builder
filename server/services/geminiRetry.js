export const DEFAULT_GEMINI_MODEL = 'gemini-2.5-flash';

export const RATE_LIMIT_COOLDOWN_MS = 60_000;

export function getErrorStatus(error) {
  if (error?.status) return error.status;
  if (error?.statusCode) return error.statusCode;

  const match = String(error?.message || '').match(/\[(\d{3})\s/);
  return match ? Number(match[1]) : null;
}

export function isRateLimitError(error) {
  const status = getErrorStatus(error);
  if (status === 429) return true;

  const message = String(error?.message || '').toLowerCase();
  return message.includes('rate limit') || message.includes('resource exhausted');
}

export function isRetryableGeminiError(error) {
  if (isRateLimitError(error)) return false;
