import Role from './role.model.js';
import User from './user.model.js';
import RefreshToken from './refreshToken.model.js';
import AuditLog from './auditLog.model.js';

// Define associations
Role.hasMany(User, { foreignKey: 'roleId', as: 'users' });
User.belongsTo(Role, { foreignKey: 'roleId', as: 'role' });

User.hasMany(RefreshToken, { foreignKey: 'userId', as: 'refreshTokens' });
RefreshToken.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(AuditLog, { foreignKey: 'userId', as: 'auditLogs' });
AuditLog.belongsTo(User, { foreignKey: 'userId', as: 'user' });

export * from './interfaces/index.js';
export { Role, User, RefreshToken, AuditLog };
