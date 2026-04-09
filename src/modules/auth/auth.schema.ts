import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
  }),
});

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
  }),
});

export const resetPasswordSchema = z.object({
  body: z.object({
    password: z.string().min(8, 'Password must be at least 8 characters'),
  }),
  params: z.object({
    token: z.string().min(1, 'Token is required'),
  }),
});

export const changePasswordSchema = z.object({
  body: z.object({
    passwordCurrent: z.string().min(1, 'Current password is required'),
    password: z.string().min(8, 'New password must be at least 8 characters'),
  }),
});
