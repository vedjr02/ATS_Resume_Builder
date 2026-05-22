export const RATE_LIMIT_COOLDOWN_SECONDS = 60;

export function isRateLimitMessage(message) {
  return String(message || '').toLowerCase().includes('rate limit');
}
