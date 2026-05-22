import { useEffect, useState } from 'react';
import { RATE_LIMIT_COOLDOWN_SECONDS } from '../utils/rateLimit.js';

export function useCooldown() {
  const [cooldownSec, setCooldownSec] = useState(0);

