import { DataTypes, Model } from 'sequelize';
import sequelize from '../../config/database.js';
import { AuditLogAttributes, AuditLogCreationAttributes } from '../interfaces/index.js';

class AuditLog extends Model<AuditLogAttributes, AuditLogCreationAttributes> implements AuditLogAttributes {
  declare id: string;
  declare userId?: string;
  declare action: string;
  declare resource?: string;
  declare ip?: string;
  declare userAgent?: string;
  declare metadata?: any;
  declare readonly createdAt: Date;
}

AuditLog.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    action: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    resource: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    ip: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    userAgent: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'audit_logs',
    updatedAt: false, // Audit logs are immutable
  }
);

export default AuditLog;
