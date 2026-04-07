import { Optional } from 'sequelize';

export interface AuditLogAttributes {
  id: string;
  userId?: string;
  action: string;
  resource?: string;
  ip?: string;
  userAgent?: string;
  metadata?: any;
  createdAt?: Date;
}

export interface AuditLogCreationAttributes extends Optional<AuditLogAttributes, 'id'> {}
