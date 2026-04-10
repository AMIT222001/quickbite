import {
  Role,
  User,
  Permission,
  RefreshToken,
  AuditLog,
  Restaurant,
  Menu,
  MenuItem,
  Order,
  OrderItem,
} from './models/index.js';

// --- Auth Associations ---
Role.hasMany(User, { foreignKey: 'roleId', as: 'users' });
User.belongsTo(Role, { foreignKey: 'roleId', as: 'role' });

// Role-Permission Many-to-Many
Role.belongsToMany(Permission, {
  through: 'role_permissions',
  foreignKey: 'roleId',
  otherKey: 'permissionId',
  as: 'permissions',
});
Permission.belongsToMany(Role, {
  through: 'role_permissions',
  foreignKey: 'permissionId',
  otherKey: 'roleId',
  as: 'roles',
});

User.hasMany(RefreshToken, { foreignKey: 'userId', as: 'refreshTokens' });
RefreshToken.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(AuditLog, { foreignKey: 'userId', as: 'auditLogs' });
AuditLog.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// --- Restaurant & Order Associations ---

// User - Restaurant (Owner)
User.hasMany(Restaurant, { foreignKey: 'ownerId', as: 'ownedRestaurants' });
Restaurant.belongsTo(User, { foreignKey: 'ownerId', as: 'owner' });

// Restaurant - Menu
Restaurant.hasMany(Menu, { foreignKey: 'restaurantId', as: 'menus' });
Menu.belongsTo(Restaurant, { foreignKey: 'restaurantId', as: 'restaurant' });

// Menu - MenuItem
Menu.hasMany(MenuItem, { foreignKey: 'menuId', as: 'items' });
MenuItem.belongsTo(Menu, { foreignKey: 'menuId', as: 'menu' });

// User - Order (Customer)
User.hasMany(Order, { foreignKey: 'userId', as: 'orders' });
Order.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Restaurant - Order
Restaurant.hasMany(Order, { foreignKey: 'restaurantId', as: 'orders' });
Order.belongsTo(Restaurant, { foreignKey: 'restaurantId', as: 'restaurant' });

// Order - OrderItem
Order.hasMany(OrderItem, { foreignKey: 'orderId', as: 'items' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });

// MenuItem - OrderItem
MenuItem.hasMany(OrderItem, { foreignKey: 'menuItemId', as: 'orderItems' });
OrderItem.belongsTo(MenuItem, { foreignKey: 'menuItemId', as: 'menuItem' });

export * from './interfaces/index.js';
export {
  Role,
  User,
  Permission,
  RefreshToken,
  AuditLog,
  Restaurant,
  Menu,
  MenuItem,
  Order,
  OrderItem,
};
