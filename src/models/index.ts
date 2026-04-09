import { Optional } from 'sequelize';
import { Role, User, Permission, RefreshToken, AuditLog } from './models/index.js';

// Define associations
Role.hasMany(User, { foreignKey: 'roleId', as: 'users' });
User.belongsTo(Role, { foreignKey: 'roleId', as: 'role' });

// Role-Permission Many-to-Many
Role.belongsToMany(Permission, {
  through: 'role_permissions',
  foreignKey: 'roleId',
  otherKey: 'permissionId',
  as: 'permissions',
});
Permission.belongsToMany(Role, {
  through: 'role_permissions',
  foreignKey: 'permissionId',
  otherKey: 'roleId',
  as: 'roles',
});

User.hasMany(RefreshToken, { foreignKey: 'userId', as: 'refreshTokens' });
RefreshToken.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(AuditLog, { foreignKey: 'userId', as: 'auditLogs' });
AuditLog.belongsTo(User, { foreignKey: 'userId', as: 'user' });

export * from './interfaces/index.js';
export { Role, User, Permission, RefreshToken, AuditLog };
