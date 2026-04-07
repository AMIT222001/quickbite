import { Optional } from 'sequelize';
import { RoleAttributes } from './role.interface.js';

export interface UserAttributes {
  id: string;
  email: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  isActive?: boolean;
  roleId?: string;
  role?: RoleAttributes;
  loginAttempts?: number;
  lockUntil?: Date;
  mfaEnabled?: boolean;
  mfaSecret?: string;
}

export interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'password' | 'firstName' | 'lastName' | 'isActive' | 'roleId' | 'role' | 'loginAttempts' | 'lockUntil' | 'mfaEnabled' | 'mfaSecret'> {}
