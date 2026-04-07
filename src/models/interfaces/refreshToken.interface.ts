import { Optional } from 'sequelize';

export interface RefreshTokenAttributes {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date;
  revoked?: boolean;
  replacedByToken?: string;
  createdByIp?: string;
}

export interface RefreshTokenCreationAttributes extends Optional<RefreshTokenAttributes, 'id' | 'revoked'> {}
