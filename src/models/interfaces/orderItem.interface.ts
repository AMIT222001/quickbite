import { Optional } from 'sequelize';

export interface OrderItemAttributes {
  id: string;
  orderId: string;
  menuItemId: string;
  quantity: number;
  priceAtOrdering: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface OrderItemCreationAttributes
  extends Optional<OrderItemAttributes, 'id' | 'createdAt' | 'updatedAt'> {}
