import { Optional } from 'sequelize';

export interface RestaurantAttributes {
  id: string;
  name: string;
  address: string;
  phone: string;
  description?: string;
  status: 'ACTIVE' | 'INACTIVE';
  ownerId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface RestaurantCreationAttributes
  extends Optional<RestaurantAttributes, 'id' | 'description' | 'status' | 'createdAt' | 'updatedAt'> {}
