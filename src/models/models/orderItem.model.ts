import { DataTypes, Model } from 'sequelize';
import sequelize from '../../config/database.js';
import { OrderItemAttributes, OrderItemCreationAttributes } from '../interfaces/index.js';
import Order from './order.model.js';
import MenuItem from './menuItem.model.js';

class OrderItem extends Model<OrderItemAttributes, OrderItemCreationAttributes> implements OrderItemAttributes {
  declare id: string;
  declare orderId: string;
  declare menuItemId: string;
  declare quantity: number;
  declare priceAtOrdering: number;

  declare order?: Order;
  declare menuItem?: MenuItem;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

OrderItem.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    orderId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    menuItemId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    priceAtOrdering: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'order_items',
  }
);

export default OrderItem;
