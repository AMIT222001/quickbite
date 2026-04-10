import { migrator, runMigrations, seeder, runSeeders } from './migrator.js';
import sequelize from '../config/database.js';
import { logger } from '../config/index.js';

const migrate = async () => {
  const command = process.argv[2] || 'up';

  try {
    if (command === 'up') {
      await runMigrations();
    } else if (command === 'down') {
      const migrations = await migrator.down();
      if (migrations.length === 0) {
        logger.info('No migrations to revert.');
      } else {
        logger.info({ migrations: migrations.map(m => m.name) }, 'Migration reverted successfully.');
      }
    } else if (command === 'pending') {
      const pending = await migrator.pending();
      logger.info({ pending: pending.map(m => m.name) }, 'Pending migrations');
    } else if (command === 'seed') {
      await runSeeders();
    } else if (command === 'seed:down') {
      const seeds = await seeder.down();
      if (seeds.length === 0) {
        logger.info('No seeds to revert.');
      } else {
        logger.info({ seeds: seeds.map(s => s.name) }, 'Seeder reverted successfully.');
      }
    } else if (command === 'seed:pending') {
      const pending = await seeder.pending();
      logger.info({ pending: pending.map(s => s.name) }, 'Pending seeds');
    } else {
      logger.error(`Unknown command: ${command}. Use "up", "down", "pending", "seed", "seed:down", or "seed:pending".`);
      process.exit(1);
    }
    
    await sequelize.close();
    process.exit(0);
  } catch (error) {
    logger.error({ err: error }, 'Operation failed');
    process.exit(1);
  }
};

migrate();
