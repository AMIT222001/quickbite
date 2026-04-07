/**
 * Success and Error Messages
 */
export const Messages = {
  // Common
  NOT_FOUND: (resource: string) => `Can't find ${resource} on this server!`,
  INTERNAL_SERVER_ERROR: 'Something went very wrong!',
  SUCCESS: 'Success',

  // Auth
  AUTH_INVALID_EMAIL: 'Invalid email address',
  AUTH_PASSWORD_MIN_LENGTH: 'Password must be at least 8 characters long',
  AUTH_PASSWORD_REQUIRED: 'Password is required',
  AUTH_EMAIL_EXISTS: 'User with this email already exists',
  AUTH_INCORRECT_CREDENTIALS: 'Incorrect email or password',
  AUTH_DEACTIVATED: 'Your account is deactivated. Please contact support.',
  AUTH_LOGGED_IN_REQUIRED: 'You must be logged in to access this resource.',
  AUTH_NOT_LOGGED_IN: 'You are not logged in! Please log in to get access.',
  AUTH_USER_NOT_FOUND: 'The user belonging to this token does no longer exist.',
  AUTH_NO_PERMISSION: 'You do not have permission to perform this action',
  AUTH_ACCOUNT_LOCKED: 'Too many failed login attempts. Account is temporarily locked. Please try again later.',
  AUTH_MFA_REQUIRED: 'Second-factor authentication is required to complete login.',
  AUTH_MFA_INVALID: 'The provided MFA code is invalid or has expired.',
  AUTH_MFA_ENABLED: 'MFA has been successfully enabled for your account.',
  AUTH_TOKEN_REFRESHED: 'Authentication token refreshed successfully.',

  // User
  USER_NOT_FOUND: 'No user found with that ID',
  USER_DEACTIVATED: 'User deactivated successfully',

  // System
  HEALTH_CHECK_SUCCESS: 'System is healthy',
  RATE_LIMIT_EXCEEDED: 'Too many requests from this IP, please try again later.',
} as const;
