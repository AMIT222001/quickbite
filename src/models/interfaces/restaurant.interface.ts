import { Optional } from 'sequelize';
import { RestaurantStatus } from '../../constants.js';

export interface RestaurantAttributes {
  id: string;
  name: string;
  address: string;
  phone: string;
  description?: string;
  status: RestaurantStatus;
  ownerId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface RestaurantCreationAttributes
  extends Optional<RestaurantAttributes, 'id' | 'description' | 'status' | 'createdAt' | 'updatedAt'> {}
