import { Optional } from 'sequelize';

export interface PermissionAttributes {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface PermissionCreationAttributes extends Optional<PermissionAttributes, 'id' | 'description'> {}
