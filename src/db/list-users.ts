import { User, Role } from '../models/index.js';
import { sequelize } from '../config/index.js';

const listUsers = async () => {
  try {
    await sequelize.authenticate();
    const users = await User.findAll({
      include: [{ model: Role, as: 'role' }],
    });

    console.log('--- Users in Database ---');
    users.forEach((user: any) => {
      console.log(`${user.id}: ${user.email} (${user.role?.name || 'no role'})`);
    });
    process.exit(0);
  } catch (error) {
    console.error('Error fetching users:', error);
    process.exit(1);
  }
};

listUsers();
