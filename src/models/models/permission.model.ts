import { DataTypes, Model } from 'sequelize';
import sequelize from '../../config/database.js';
import { PermissionAttributes, PermissionCreationAttributes } from '../interfaces/permission.interface.js';

class Permission extends Model<PermissionAttributes, PermissionCreationAttributes> implements PermissionAttributes {
  declare id: string;
  declare name: string;
  declare slug: string;
  declare description?: string;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Permission.init(
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
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'permissions',
  }
);

export default Permission;
export type { PermissionAttributes, PermissionCreationAttributes };
