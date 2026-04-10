import { DataTypes, Model } from 'sequelize';
import sequelize from '../../config/database.js';
import { MenuItemAttributes, MenuItemCreationAttributes } from '../interfaces/index.js';
import Menu from './menu.model.js';
import OrderItem from './orderItem.model.js';

class MenuItem extends Model<MenuItemAttributes, MenuItemCreationAttributes> implements MenuItemAttributes {
  declare id: string;
  declare name: string;
  declare description?: string;
  declare price: number;
  declare menuId: string;

  declare menu?: Menu;
  declare orderItems?: OrderItem[];

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

MenuItem.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    menuId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'menu_items',
  }
);

export default MenuItem;
