export * from './statusCodes.js';
export * from './messages.js';
export * from './kafka.constants.js';

export const Status = {
  SUCCESS: 'success',
  FAIL: 'fail',
  ERROR: 'error',
} as const;

export const HealthStatus = {
  UP: 'UP',
  DOWN: 'DOWN',
} as const;
