import { randomUUID } from 'node:crypto';
import type { Migration } from '../migrator.js';

export const up: Migration = async ({ context: queryInterface }) => {
  // 1. Define initial permissions
  const permissions = [
    {
      id: randomUUID(),
      name: 'Manage Users',
      slug: 'manage:users',
      description: 'Ability to list, update, and deactivate users',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: randomUUID(),
      name: 'Manage Roles',
      slug: 'manage:roles',
      description: 'Ability to change user roles',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: randomUUID(),
      name: 'View Audit Logs',
      slug: 'view:audit_logs',
      description: 'Ability to view system audit logs',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  await queryInterface.bulkInsert('permissions', permissions);

  // 2. Fetch the 'admin' role ID
  const roles: any = await queryInterface.sequelize.query(
    "SELECT id FROM roles WHERE name = 'admin' LIMIT 1;",
    { type: 'SELECT' }
  );

  if (roles && roles.length > 0) {
    const adminRoleId = roles[0].id;

    // 3. Map all current permissions to the admin role
    const rolePermissions = permissions.map(p => ({
      id: randomUUID(),
      roleId: adminRoleId,
      permissionId: p.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    await queryInterface.bulkInsert('role_permissions', rolePermissions);
  }
};

export const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.bulkDelete('role_permissions', {});
  await queryInterface.bulkDelete('permissions', {});
};
