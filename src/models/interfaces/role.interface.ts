import { Optional } from 'sequelize';
import { PermissionAttributes } from './permission.interface.js';

export interface RoleAttributes {
  id: string;
  name: string;
  description?: string;
  permissions?: PermissionAttributes[];
}

export interface RoleCreationAttributes extends Optional<RoleAttributes, 'id' | 'permissions'> {}
