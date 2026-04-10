import { z } from 'zod';
import { OrderStatuses } from '../../constants.js';

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
    status: z.enum(Object.values(OrderStatuses) as [string, ...string[]]),
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
