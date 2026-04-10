import { Umzug, SequelizeStorage } from 'umzug';
import sequelize from '../config/database.js';
import { logger } from '../config/index.js';
import path from 'path';

// Migrator for schema changes
export const migrator = new Umzug({
  migrations: {
    glob: ['../../migrations/*.ts', { cwd: import.meta.dirname }],
  },
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize, modelName: 'sequelize_meta' }),
  logger: console,
});

// Migrator for data seeding
export const seeder = new Umzug({
  migrations: {
    glob: ['../../seeders/*.ts', { cwd: import.meta.dirname }],
  },
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize, modelName: 'sequelize_data' }),
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

export const runSeeders = async () => {
  try {
    const seeds = await seeder.up();
    if (seeds.length === 0) {
      logger.info('No seeds to run.');
    } else {
      logger.info({ seeds: seeds.map(s => s.name) }, 'All seeds performed successfully.');
    }
  } catch (error) {
    logger.error({ err: error }, 'Failed to run seeders');
    throw error;
  }
};
