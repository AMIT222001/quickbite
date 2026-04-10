import { DataTypes, Model } from 'sequelize';
import sequelize from '../../config/database.js';
import { OrderAttributes, OrderCreationAttributes } from '../interfaces/index.js';
import User from './user.model.js';
import Restaurant from './restaurant.model.js';
import OrderItem from './orderItem.model.js';
import { OrderStatuses, OrderStatus } from '../../constants.js';

class Order extends Model<OrderAttributes, OrderCreationAttributes> implements OrderAttributes {
  declare id: string;
  declare userId: string;
  declare restaurantId: string;
  declare totalAmount: number;
  declare status: OrderStatus;
  declare deliveryAddress: string;

  declare user?: User;
  declare restaurant?: Restaurant;
  declare items?: OrderItem[];

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Order.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    restaurantId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(...Object.values(OrderStatuses)),
      defaultValue: OrderStatuses.PENDING,
    },
    deliveryAddress: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'orders',
  }
);

export default Order;
