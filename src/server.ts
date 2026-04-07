import app from './app.js';
import { sequelize, logger, env } from './config/index.js';

// --- Global Error Handlers ---
process.on('uncaughtException', (err: Error) => {
  logger.error({ err }, 'UNCAUGHT EXCEPTION 💥');
  process.exit(1);
});

process.on('unhandledRejection', (err: unknown) => {
  logger.error({ err }, 'UNHANDLED REJECTION 💥');
  process.exit(1);
});

// --- Graceful Shutdown ---
const gracefulShutdown = (server: any, signal: string) => {
  logger.info(`${signal} received. Shutting down...`);

  server.close(async () => {
    await sequelize.close();
    logger.info('Server & DB closed.');
    process.exit(0);
  });

  setTimeout(() => {
    logger.error('Force shutdown.');
    process.exit(1);
  }, 10000).unref();
};

// --- Bootstrap ---
const bootstrap = async () => {
  await sequelize.authenticate();

  const port = env.PORT || 3000;

  const server = app.listen(port, () => {
    logger.info(`Server running on port ${port} (${env.NODE_ENV})`);
  });

  process.on('SIGINT', () => gracefulShutdown(server, 'SIGINT'));
  process.on('SIGTERM', () => gracefulShutdown(server, 'SIGTERM'));
};

bootstrap().catch((err) => {
  logger.error({ err }, 'Startup failed');
  process.exit(1);
});