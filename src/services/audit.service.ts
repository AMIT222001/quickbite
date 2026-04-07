import { AuditLog } from '../models/index.js';
import { Request } from 'express';

export enum AuditActions {
  LOGIN_SUCCESS = 'LOGIN_SUCCESS',
  LOGIN_FAILURE = 'LOGIN_FAILURE',
  LOGOUT = 'LOGOUT',
  SIGN_UP = 'SIGN_UP',
  MFA_ENABLED = 'MFA_ENABLED',
  MFA_VERIFIED = 'MFA_VERIFIED',
  SESSION_REVOKED = 'SESSION_REVOKED',
  ALL_SESSIONS_REVOKED = 'ALL_SESSIONS_REVOKED',
}

export class AuditService {
  static async log(req: Request, action: AuditActions, userId?: string, metadata?: any) {
    try {
      await AuditLog.create({
        userId,
        action,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        metadata,
      });
    } catch (error) {
      // We don't want to fail the main request if logging fails, but we should log it
      console.error('Failed to create audit log:', error);
    }
  }
}
