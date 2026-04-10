# Kafka Integration Documentation

This document outlines the Kafka event-driven architecture within the QuickBite platform.

## Architecture Overview

Kafka is used as a distributed event streaming platform to decouple critical business processes and enable asynchronous communication between different parts of the system (and potential future microservices).

### Centralized Service
The Kafka integration is managed by the `KafkaService` located in `src/services/kafka.service.ts`. This service provides a high-level API for:
- **Producing messages** (`emit` method)
- **Consuming messages** (`subscribe` method)
- **Connection management** (auto-reconnect and graceful shutdown)

## Current Usage

Currently, Kafka is primarily integrated into the **Order Module** to track the lifecycle of orders.

### Topics
Topics are managed centrally in `src/constants/kafka.constants.ts`.

| Topic Name | Purpose |
| :--- | :--- |
| `order-status-updates` | Primary topic for all order lifecycle changes. |
| `user-events` | (Reserved) For future user-related events like registration or login. |
| `restaurant-events` | (Reserved) For restaurant-related updates. |

### Integration Points: Order Controller
Location: `src/modules/order/order.controller.ts`

Kafka events are emitted in the following scenarios:

1.  **Order Placement** (`placeOrder`):
    - **When**: After a successful database transaction for a new order.
    - **Status**: `PENDING`
    - **Payload**: `{ orderId: string, status: 'PENDING', timestamp: Date }`

2.  **Status Update** (`updateOrderStatus`):
    - **When**: When a restaurant owner or admin updates an order status (e.g., `CONFIRMED`, `DISH_READY`, `OUT_FOR_DELIVERY`, `DELIVERED`).
    - **Status**: The new status of the order.
    - **Payload**: `{ orderId: string, status: string, timestamp: Date }`

3.  **Cancellation** (`cancelOrder`):
    - **When**: When a user or admin cancels a pending order.
    - **Status**: `CANCELLED`
    - **Payload**: `{ orderId: string, status: 'CANCELLED', timestamp: Date }`

## Why Kafka?

1.  **Scalability**: Offloading event processing to Kafka ensures that the API remains responsive. Other services can consume these events at their own pace.
2.  **Decoupling**: The Order module doesn't need to know which other services (notifications, delivery tracking, analytics) need to react to an order update. It simply "emits" the event.
3.  **Resilience**: Messages in Kafka are persistent. If a consumer service (e.g., the notification service) goes down, it can resume processing events from where it left off once it's back online.
4.  **Auditability**: The `order-status-updates` topic serves as a source of truth for the entire history of an order.

## Payload Examples

```json
{
  "orderId": "550e8400-e29b-41d4-a716-446655440000",
  "status": "CONFIRMED",
  "timestamp": "2026-04-10T10:15:00.000Z"
}
```

## Future Roadmap
- Implement **Consumers** for a real-time Notification Service.
- Use **User Events** to trigger welcome emails or security alerts.
- Integrate **Restaurant Events** for inventory or menu synchronization.
