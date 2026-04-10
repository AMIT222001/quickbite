import { DataTypes } from 'sequelize';
import type { Migration } from '../migrator.js';

export const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.addColumn('users', 'passwordChangedAt', {
    type: DataTypes.DATE,
    allowNull: true,
  });

  await queryInterface.addColumn('users', 'passwordResetToken', {
    type: DataTypes.STRING,
    allowNull: true,
  });

  await queryInterface.addColumn('users', 'passwordResetExpires', {
    type: DataTypes.DATE,
    allowNull: true,
  });

  // Adding index for faster reset token lookups
  await queryInterface.addIndex('users', ['passwordResetToken']);
};

export const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.removeColumn('users', 'passwordChangedAt');
  await queryInterface.removeColumn('users', 'passwordResetToken');
  await queryInterface.removeColumn('users', 'passwordResetExpires');
};
