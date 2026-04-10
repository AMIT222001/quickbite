import { DataTypes, Model } from 'sequelize';
import sequelize from '../../config/database.js';
import { MenuAttributes, MenuCreationAttributes } from '../interfaces/index.js';
import Restaurant from './restaurant.model.js';
import MenuItem from './menuItem.model.js';

class Menu extends Model<MenuAttributes, MenuCreationAttributes> implements MenuAttributes {
  declare id: string;
  declare name: string;
  declare description?: string;
  declare restaurantId: string;

  declare restaurant?: Restaurant;
  declare items?: MenuItem[];

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Menu.init(
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
    restaurantId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'menus',
  }
);

export default Menu;
