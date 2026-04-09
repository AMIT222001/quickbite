import { DataTypes } from 'sequelize';
import type { Migration } from '../migrator.js';

export const up: Migration = async ({ context: queryInterface }) => {
  // 1. Permissions Table
  await queryInterface.createTable('permissions', {
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
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  });

  // 2. Role Permissions Table (Join Table)
  await queryInterface.createTable('role_permissions', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    roleId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'roles',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    permissionId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'permissions',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  });

  // Add index for performance
  await queryInterface.addIndex('role_permissions', ['roleId', 'permissionId'], {
    unique: true,
  });
};

export const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.dropTable('role_permissions');
  await queryInterface.dropTable('permissions');
};
