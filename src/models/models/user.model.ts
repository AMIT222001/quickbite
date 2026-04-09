import { DataTypes, Model, Op } from 'sequelize';
import argon2 from 'argon2';
import crypto from 'crypto';
import sequelize from '../../config/database.js';
import { env } from '../../config/index.js';
import { UserAttributes, UserCreationAttributes } from '../interfaces/index.js';
import type { RoleAttributes } from '../interfaces/index.js';

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
   declare id: string;
declare email: string;
declare password?: string;
declare firstName: string;
declare lastName: string;
declare isActive: boolean;
declare roleId?: string;
declare role?: RoleAttributes;
declare loginAttempts: number;
declare lockUntil?: Date;
declare mfaEnabled: boolean;
declare mfaSecret?: string;
declare passwordChangedAt?: Date;
declare passwordResetToken?: string;
declare passwordResetExpires?: Date;

declare readonly createdAt: Date;
declare readonly updatedAt: Date;

  // Password hashing hook
  public static async hashPassword(password: string): Promise<string> {
    return await argon2.hash(password);
  }

  // Password verification
  public async comparePassword(password: string): Promise<boolean> {
    if (!this.password) return false;
    return await argon2.verify(this.password, password);
  }

  // Account Lockout verification
  public get isLocked(): boolean {
    return !!(this.lockUntil && this.lockUntil > new Date());
  }

  // MFA Secret Encryption/Decryption
  public static encryptSecret(secret: string): string {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-gcm', Buffer.from(env.ENCRYPTION_KEY, 'hex'), iv);
    let encrypted = cipher.update(secret, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag().toString('hex');
    return `${iv.toString('hex')}:${authTag}:${encrypted}`;
  }

  public static decryptSecret(encryptedData: string): string {
    const [ivHex, authTagHex, encryptedText] = encryptedData.split(':');
    if (!ivHex || !authTagHex || !encryptedText) throw new Error('Invalid encrypted data format');
    const decipher = crypto.createDecipheriv('aes-256-gcm', Buffer.from(env.ENCRYPTION_KEY, 'hex'), Buffer.from(ivHex, 'hex'));
    decipher.setAuthTag(Buffer.from(authTagHex, 'hex'));
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }

  // Password Reset Token generation
  public createPasswordResetToken(): string {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    this.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    return resetToken;
  }
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true, // For social login support in future
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    roleId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    loginAttempts: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    lockUntil: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    mfaEnabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    mfaSecret: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    passwordChangedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    passwordResetToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    passwordResetExpires: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'users',
    defaultScope: {
      attributes: { exclude: ['password', 'mfaSecret'] },
    },
    scopes: {
      withSecret: { attributes: { include: ['password', 'mfaSecret'] } },
    },
    hooks: {
  beforeCreate: async (user: User) => {
  console.log("🔥 beforeCreate hook running");
  console.log("Password before hash:", user.password);
    console.log(user);
  if (user.password) {
    user.password = await User.hashPassword(user.password);
  }

  console.log("Password after hash:", user.password);
},
  beforeUpdate: async (user: User) => {
    if (user.password && user.changed('password')) {
      user.password = await User.hashPassword(user.password);
      user.passwordChangedAt = new Date(Date.now() - 1000);
    }

    if (user.mfaSecret && user.changed('mfaSecret')) {
      user.mfaSecret = User.encryptSecret(user.mfaSecret);
    }
  },
}
  }
);

export default User;
export type { UserAttributes, UserCreationAttributes };
