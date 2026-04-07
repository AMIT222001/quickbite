/**
 * HTTP Status Codes
 */
export const StatusCodes = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  TOO_MANY_REQUESTS: 429,
  MFA_REQUIRED: 403, // Custom status or reuse FORBIDDEN
  INTERNAL_SERVER_ERROR: 500,
} as const;

export type StatusCode = typeof StatusCodes[keyof typeof StatusCodes];
