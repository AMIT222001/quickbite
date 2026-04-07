import { Umzug, SequelizeStorage } from 'umzug';
import sequelize from '../config/database.js';
import { logger } from '../config/index.js';

export const migrator = new Umzug({
  migrations: {
    glob: ['migrations/*.ts', { cwd: import.meta.dirname }],
  },
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize }),
  logger: console,
});

export type Migration = typeof migrator._types.migration;

export const runMigrations = async () => {
  try {
    const migrations = await migrator.up();
    if (migrations.length === 0) {
      logger.info('No migrations to run.');
    } else {
      logger.info({ migrations: migrations.map(m => m.name) }, 'All migrations performed successfully.');
    }
  } catch (error) {
    logger.error({ err: error }, 'Failed to run migrations');
    throw error;
  }
};
