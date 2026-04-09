import { DataTypes, Model } from 'sequelize';
import sequelize from '../../config/database.js';
import { RefreshTokenAttributes, RefreshTokenCreationAttributes } from '../interfaces/index.js';

class RefreshToken extends Model<RefreshTokenAttributes, RefreshTokenCreationAttributes> implements RefreshTokenAttributes {
  declare id: string;
  declare userId: string;
  declare token: string;
  declare expiresAt: Date;
  declare revoked: boolean;
  declare replacedByToken?: string;
  declare createdByIp?: string;

  public get isExpired(): boolean {
    return new Date() >= this.expiresAt;
  }

  public get isActive(): boolean {
    return !this.revoked && !this.isExpired;
  }
}

RefreshToken.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    revoked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    replacedByToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    createdByIp: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'refresh_tokens',
  }
);

export default RefreshToken;
