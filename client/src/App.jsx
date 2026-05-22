import { useState } from 'react';
import { useCooldown } from './hooks/useCooldown.js';
import { isRateLimitMessage } from './utils/rateLimit.js';

const STATUS_STEPS = [
