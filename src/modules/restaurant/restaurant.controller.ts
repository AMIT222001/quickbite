import { Request, Response, NextFunction } from 'express';
import { Restaurant, Menu, MenuItem, User } from '../../models/index.js';
import { AppError, catchAsync } from '../../utils/index.js';
import { StatusCodes, Messages } from '../../constants/index.js';

/**
 * Create a new restaurant
 */
export const createRestaurant = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { name, address, phone, description } = req.body;

  const newRestaurant = await Restaurant.create({
    name,
    address,
    phone,
    description,
    ownerId: req.user!.id,
    status: 'ACTIVE',
  });

  res.status(StatusCodes.CREATED).json({
    status: 'success',
    data: {
      restaurant: newRestaurant,
    },
  });
});

/**
 * Get all active restaurants
 */
export const getAllRestaurants = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const restaurants = await Restaurant.findAll({
    where: { status: 'ACTIVE' },
    include: [{ model: User, as: 'owner', attributes: ['id', 'firstName', 'lastName'] }],
  });

  res.status(StatusCodes.OK).json({
    status: 'success',
    results: restaurants.length,
    data: {
      restaurants,
    },
  });
});

/**
 * Get a single restaurant with menus
 */
export const getRestaurant = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const restaurant = await Restaurant.findByPk(id as string, {
    include: [
      {
        model: Menu,
        as: 'menus',
        include: [{ model: MenuItem, as: 'items' }],
      },
      { model: User, as: 'owner', attributes: ['id', 'firstName', 'lastName'] },
    ],
  });

  if (!restaurant) {
    return next(new AppError('No restaurant found with that ID', StatusCodes.NOT_FOUND));
  }

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: {
      restaurant,
    },
  });
});

/**
 * Update restaurant
 */
export const updateRestaurant = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const restaurant = await Restaurant.findByPk(id as string);

  if (!restaurant) {
    return next(new AppError('No restaurant found with that ID', StatusCodes.NOT_FOUND));
  }

  // Check ownership (simple check, full RBAC might handle this in middleware)
  if (restaurant.ownerId !== req.user!.id && req.user!.role?.name !== 'admin') {
    return next(new AppError(Messages.AUTH_NO_PERMISSION, StatusCodes.FORBIDDEN));
  }

  await restaurant.update(req.body);

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: {
      restaurant,
    },
  });
});

/**
 * Delete restaurant (Admin only)
 */
export const deleteRestaurant = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const restaurant = await Restaurant.findByPk(id as string);

  if (!restaurant) {
    return next(new AppError('No restaurant found with that ID', StatusCodes.NOT_FOUND));
  }

  await restaurant.destroy();

  res.status(StatusCodes.NO_CONTENT).json({
    status: 'success',
    data: null,
  });
});

/**
 * Create a menu for a restaurant
 */
export const createMenu = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { name, description } = req.body;
  const { id: restaurantId } = req.params;

  const restaurant = await Restaurant.findByPk(restaurantId as string);
  if (!restaurant) {
    return next(new AppError('No restaurant found with that ID', StatusCodes.NOT_FOUND));
  }

  if (restaurant.ownerId !== req.user!.id && req.user!.role?.name !== 'admin') {
    return next(new AppError(Messages.AUTH_NO_PERMISSION, StatusCodes.FORBIDDEN));
  }

  const newMenu = await Menu.create({
    name,
    description,
    restaurantId: restaurantId as string,
  });

  res.status(StatusCodes.CREATED).json({
    status: 'success',
    data: {
      menu: newMenu,
    },
  });
});

/**
 * Add an item to a menu
 */
export const addMenuItem = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { name, description, price } = req.body;
  const { id: menuId } = req.params;

  const menu = await Menu.findByPk(menuId as string, {
    include: [{ model: Restaurant, as: 'restaurant' }],
  });

  if (!menu) {
    return next(new AppError('No menu found with that ID', StatusCodes.NOT_FOUND));
  }

  if (menu.restaurant?.ownerId !== req.user!.id && req.user!.role?.name !== 'admin') {
    return next(new AppError(Messages.AUTH_NO_PERMISSION, StatusCodes.FORBIDDEN));
  }

  const newItem = await MenuItem.create({
    name,
    description,
    price,
    menuId: menuId as string,
  });

  res.status(StatusCodes.CREATED).json({
    status: 'success',
    data: {
      item: newItem,
    },
  });
});
