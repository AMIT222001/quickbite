import { randomUUID } from 'node:crypto';
import type { Migration } from '../migrator.js';

export const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.bulkInsert('roles', [
    {
      id: randomUUID(),
      name: 'admin',
      description: 'Administrator with full access',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: randomUUID(),
      name: 'user',
      description: 'Regular user',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);
};

export const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.bulkDelete('roles', { name: ['admin', 'user'] });
};
