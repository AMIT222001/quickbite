import { Request, Response, NextFunction } from 'express';
import { Order, OrderItem, MenuItem, Restaurant, User } from '../../models/index.js';
import { AppError, catchAsync } from '../../utils/index.js';
import { StatusCodes, KafkaTopics, Messages, OrderStatuses, UserRoles, Status } from '../../constants.js';
import { kafkaService } from '../../services/index.js';
import sequelize from '../../config/database.js';

/**
 * Place a new order
 */
export const placeOrder = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { restaurantId, deliveryAddress, items } = req.body;
  const userId = req.user!.id;

  // 1) Verify restaurant exists
  const restaurant = await Restaurant.findByPk(restaurantId);
  if (!restaurant) {
    return next(new AppError(Messages.RESTAURANT_NOT_FOUND, StatusCodes.NOT_FOUND));
  }

  // 2) Create order in transaction
  const result = await sequelize.transaction(async (t) => {
    let totalAmount = 0;
    const orderItemsData: any[] = [];

    // Check items and calculate total
    for (const item of items) {
      const menuItem = await MenuItem.findByPk(item.menuItemId);
      if (!menuItem) {
        throw new AppError(`Menu item ${item.menuItemId} not found`, StatusCodes.NOT_FOUND);
      }
      
      const itemPrice = Number(menuItem.price);
      totalAmount += itemPrice * item.quantity;

      orderItemsData.push({
        menuItemId: item.menuItemId,
        quantity: item.quantity,
        priceAtOrdering: itemPrice,
      });
    }

    // Create the order
    const order = await Order.create(
      {
        userId,
        restaurantId,
        deliveryAddress,
        totalAmount,
        status: OrderStatuses.PENDING,
      },
      { transaction: t }
    );

    // Create order items
    await Promise.all(
      orderItemsData.map((itemData) =>
        OrderItem.create({ ...itemData, orderId: order.id }, { transaction: t })
      )
    );

    return order;
  });

  // 3) Send Kafka event (Asynchronous)
  await kafkaService.emit(KafkaTopics.ORDER_STATUS_UPDATES, { orderId: result.id, status: OrderStatuses.PENDING }, result.id);

  res.status(StatusCodes.CREATED).json({
    status: Status.SUCCESS,
    data: {
      order: result,
    },
  });
});

/**
 * Get order details
 */
export const getOrder = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const order = await Order.findByPk(id as string, {
    include: [
      {
        model: OrderItem,
        as: 'items',
        include: [{ model: MenuItem, as: 'menuItem' }],
      },
      { model: Restaurant, as: 'restaurant' },
      { model: User, as: 'user', attributes: ['id', 'firstName', 'lastName', 'email'] },
    ],
  });

  if (!order) {
    return next(new AppError(Messages.ORDER_NOT_FOUND, StatusCodes.NOT_FOUND));
  }

  // Check if current user is the owner of the order, restaurant owner, or admin
  if (
    order.userId !== req.user!.id &&
    order.restaurant?.ownerId !== req.user!.id &&
    req.user!.role?.name !== UserRoles.ADMIN
  ) {
    return next(new AppError(Messages.ORDER_FORBIDDEN_VIEW, StatusCodes.FORBIDDEN));
  }

  res.status(StatusCodes.OK).json({
    status: Status.SUCCESS,
    data: {
      order,
    },
  });
});

/**
 * List user's orders
 */
export const getUserOrders = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user!.id;
  const page = parseInt(req.query.page as string || '1');
  const limit = parseInt(req.query.limit as string || '10');
  const offset = (page - 1) * limit;

  const { rows: orders, count } = await Order.findAndCountAll({
    where: { userId },
    limit,
    offset,
    order: [['createdAt', 'DESC']],
    include: [{ model: Restaurant, as: 'restaurant', attributes: ['name', 'address'] }],
  });

  res.status(StatusCodes.OK).json({
    status: Status.SUCCESS,
    results: orders.length,
    total: count,
    page,
    pages: Math.ceil(count / limit),
    data: {
      orders,
    },
  });
});

/**
 * Update order status (Admin/Owner)
 */
export const updateOrderStatus = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { status } = req.body;
  const { id: orderId } = req.params;

  const order = await Order.findByPk(orderId as string, {
    include: [{ model: Restaurant, as: 'restaurant' }],
  });

  if (!order) {
    return next(new AppError(Messages.ORDER_NOT_FOUND, StatusCodes.NOT_FOUND));
  }

  // Check if owner or admin
  if (order.restaurant?.ownerId !== req.user!.id && req.user!.role?.name !== 'admin') {
    return next(new AppError(Messages.ORDER_FORBIDDEN_UPDATE, StatusCodes.FORBIDDEN));
  }

  await order.update({ status });

  // Send Kafka event
  await kafkaService.emit(KafkaTopics.ORDER_STATUS_UPDATES, { orderId: order.id, status }, order.id);

  res.status(StatusCodes.OK).json({
    status: Status.SUCCESS,
    data: {
      order,
    },
  });
});

/**
 * Cancel order
 */
export const cancelOrder = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id: orderId } = req.params;

  const order = await Order.findByPk(orderId as string);

  if (!order) {
    return next(new AppError('No order found with that ID', StatusCodes.NOT_FOUND));
  }

  // Check ownership (only the user who placed the order or admin can cancel)
  if (order.userId !== req.user!.id && req.user!.role?.name !== 'admin') {
    return next(new AppError(Messages.ORDER_FORBIDDEN_CANCEL, StatusCodes.FORBIDDEN));
  }

  // Only allow cancellation if order is still PENDING
  if (order.status !== OrderStatuses.PENDING) {
    return next(new AppError(Messages.ORDER_CANCEL_INVALID_STATE(order.status), StatusCodes.BAD_REQUEST));
  }

  await order.update({ status: OrderStatuses.CANCELLED });

  // Send Kafka event
  await kafkaService.emit(KafkaTopics.ORDER_STATUS_UPDATES, { orderId: order.id, status: OrderStatuses.CANCELLED }, order.id);

  res.status(StatusCodes.OK).json({
    status: Status.SUCCESS,
    message: 'Order cancelled successfully',
  });
});

/**
 * Admin view - List all orders
 */
export const getAllOrders = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const orders = await Order.findAll({
    include: [
      { model: Restaurant, as: 'restaurant', attributes: ['name'] },
      { model: User, as: 'user', attributes: ['firstName', 'lastName'] },
    ],
    order: [['createdAt', 'DESC']],
  });

  res.status(StatusCodes.OK).json({
    status: Status.SUCCESS,
    results: orders.length,
    data: {
      orders,
    },
  });
});
