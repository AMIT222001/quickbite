import { Optional } from 'sequelize';

export type OrderStatus = 'PENDING' | 'PREPARING' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED';

export interface OrderAttributes {
  id: string;
  userId: string;
  restaurantId: string;
  totalAmount: number;
  status: OrderStatus;
  deliveryAddress: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface OrderCreationAttributes
  extends Optional<OrderAttributes, 'id' | 'status' | 'createdAt' | 'updatedAt'> {}
