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
  AUTH_INVALID_CREDENTIALS: 'Invalid email or password',
  AUTH_INVALID_TOKEN: 'Token is invalid or has expired',
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

  // Roles
  ROLE_NOT_FOUND: 'Role not found',
  DEFAULT_ROLE_NOT_FOUND: 'Default role not found',

  // Restaurant
  RESTAURANT_NOT_FOUND: 'No restaurant found with that ID',
  MENU_NOT_FOUND: 'No menu found with that ID',

  // Order
  ORDER_NOT_FOUND: 'No order found with that ID',
  ORDER_FORBIDDEN_VIEW: 'You do not have permission to view this order',
  ORDER_FORBIDDEN_UPDATE: 'You do not have permission to update this order',
  ORDER_FORBIDDEN_CANCEL: 'You do not have permission to cancel this order',
  ORDER_CANCEL_INVALID_STATE: (status: string) => `Order cannot be cancelled in its current state: ${status}`,

  // System
  HEALTH_CHECK_SUCCESS: 'System is healthy',
  RATE_LIMIT_EXCEEDED: 'Too many requests from this IP, please try again later.',
  INVALID_PASSWORD_ROUTE: 'This route is not for password updates. Please use /auth/change-password.',
} as const;
