import { DataTypes, Model } from 'sequelize';
import sequelize from '../../config/database.js';
import { RestaurantAttributes, RestaurantCreationAttributes } from '../interfaces/index.js';
import User from './user.model.js';
import Menu from './menu.model.js';
import Order from './order.model.js';

class Restaurant extends Model<RestaurantAttributes, RestaurantCreationAttributes> implements RestaurantAttributes {
  declare id: string;
  declare name: string;
  declare address: string;
  declare phone: string;
  declare description?: string;
  declare status: 'ACTIVE' | 'INACTIVE';
  declare ownerId: string;

  declare owner?: User;
  declare menus?: Menu[];
  declare orders?: Order[];

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Restaurant.init(
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
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('ACTIVE', 'INACTIVE'),
      defaultValue: 'ACTIVE',
    },
    ownerId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'restaurants',
  }
);

export default Restaurant;
