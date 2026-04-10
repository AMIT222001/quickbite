import { Optional } from 'sequelize';

export interface MenuAttributes {
  id: string;
  name: string;
  description?: string;
  restaurantId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface MenuCreationAttributes
  extends Optional<MenuAttributes, 'id' | 'description' | 'createdAt' | 'updatedAt'> {}
