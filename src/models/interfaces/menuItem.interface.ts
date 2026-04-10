import { Optional } from 'sequelize';

export interface MenuItemAttributes {
  id: string;
  name: string;
  description?: string;
  price: number;
  menuId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface MenuItemCreationAttributes
  extends Optional<MenuItemAttributes, 'id' | 'description' | 'createdAt' | 'updatedAt'> {}
