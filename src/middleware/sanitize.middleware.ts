import { Request, Response, NextFunction } from 'express';
import sanitizeHtml from 'sanitize-html';

/**
 * Recursively sanitize string values in an object to strip HTML/script tags.
 */
const sanitizeObject = (obj: unknown): unknown => {
  if (typeof obj === 'string') {
    return sanitizeHtml(obj, { allowedTags: [], allowedAttributes: {} });
  }
  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject);
  }
  if (obj !== null && typeof obj === 'object') {
    return Object.fromEntries(
      Object.entries(obj as Record<string, unknown>).map(([key, value]) => [
        key,
        sanitizeObject(value),
      ])
    );
  }
  return obj;
};

/**
 * Middleware to sanitize request body, query, and params against XSS payloads.
 */
const sanitize = (req: Request, res: Response, next: NextFunction): void => {
  // ✅ body is writable
  if (req.body) {
    req.body = sanitizeObject(req.body);
  }

  // ⚠️ query is NOT writable → mutate instead
  if (req.query && typeof req.query === 'object') {
    const sanitizedQuery = sanitizeObject(req.query) as Record<string, unknown>;
    Object.assign(req.query, sanitizedQuery);
  }

  // ⚠️ params should also be mutated (safer pattern)
  if (req.params && typeof req.params === 'object') {
    const sanitizedParams = sanitizeObject(req.params) as Record<string, string>;
    Object.assign(req.params, sanitizedParams);
  }

  next();
};

export default sanitize;