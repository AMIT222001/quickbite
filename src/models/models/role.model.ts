import { DataTypes, Model } from 'sequelize';
import sequelize from '../../config/database.js';
import { RoleAttributes, RoleCreationAttributes } from '../interfaces/index.js';

class Role extends Model<RoleAttributes, RoleCreationAttributes> implements RoleAttributes {
  declare id: string;
  declare name: string;
  declare description?: string;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Role.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
      },
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'roles',
  }
);

export default Role;
export type { RoleAttributes, RoleCreationAttributes };
