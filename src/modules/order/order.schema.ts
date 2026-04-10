import { z } from 'zod';

export const placeOrderSchema = z.object({
  body: z.object({
    restaurantId: z.string().uuid('Invalid restaurant ID'),
    deliveryAddress: z.string().min(1, 'Delivery address is required'),
    items: z.array(
      z.object({
        menuItemId: z.string().uuid('Invalid menu item ID'),
        quantity: z.number().int().positive('Quantity must be a positive integer'),
      })
    ).min(1, 'At least one item is required'),
  }),
});

export const updateOrderStatusSchema = z.object({
  body: z.object({
    status: z.enum(['PENDING', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED']),
  }),
  params: z.object({
    id: z.string().uuid('Invalid order ID'),
  }),
});

export const getOrderSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid order ID'),
  }),
});
