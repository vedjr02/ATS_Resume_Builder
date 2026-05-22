import { useEffect, useState } from 'react';
import { RATE_LIMIT_COOLDOWN_SECONDS } from '../utils/rateLimit.js';

export function useCooldown() {
  const [cooldownSec, setCooldownSec] = useState(0);

  useEffect(() => {
    if (cooldownSec <= 0) return undefined;

    const timer = setInterval(() => {
      setCooldownSec((current) => (current <= 1 ? 0 : current - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldownSec]);

