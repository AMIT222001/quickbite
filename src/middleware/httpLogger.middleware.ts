import { pinoHttp } from 'pino-http';
import { randomUUID } from 'crypto';
import logger from '../config/logger.js';
import { StatusCodes } from '../constants/index.js';

const httpLogger = pinoHttp({
  logger,
  genReqId: (req) => {
    const existingId = req.headers['x-request-id'];
    return typeof existingId === 'string' ? existingId : randomUUID();
  },
  customLogLevel: (req, res, err) => {
    if (res.statusCode >= StatusCodes.BAD_REQUEST && res.statusCode < StatusCodes.INTERNAL_SERVER_ERROR) return 'warn';
    if (res.statusCode >= StatusCodes.INTERNAL_SERVER_ERROR || err) return 'error';
    return 'info';
  },
  serializers: {
    req: (req) => ({
      id: req.id,
      method: req.method,
      url: req.url,
      query: req.query,
      params: req.params,
    }),
  },
});

export default httpLogger;
