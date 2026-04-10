import { z } from 'zod';

export const createRestaurantSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Restaurant name is required'),
    address: z.string().min(1, 'Address is required'),
    phone: z.string().min(1, 'Phone number is required'),
    description: z.string().optional(),
  }),
});

export const updateRestaurantSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    address: z.string().optional(),
    phone: z.string().optional(),
    description: z.string().optional(),
    status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
  }),
  params: z.object({
    id: z.string().uuid('Invalid restaurant ID'),
  }),
});

export const getRestaurantSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid restaurant ID'),
  }),
});

export const createMenuSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Menu name is required'),
    description: z.string().optional(),
  }),
  params: z.object({
    id: z.string().uuid('Invalid restaurant ID'),
  }),
});

export const addMenuItemSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Item name is required'),
    description: z.string().optional(),
    price: z.number().positive('Price must be positive'),
  }),
  params: z.object({
    id: z.string().uuid('Invalid menu ID'),
  }),
});
