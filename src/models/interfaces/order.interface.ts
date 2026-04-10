import { Optional } from 'sequelize';
import { OrderStatus } from '../../constants.js';

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
