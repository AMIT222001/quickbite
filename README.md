# QuickBite Backend

A high-performance, modular restaurant management and ordering platform built with **Node.js**, **TypeScript**, and **Apache Kafka**.

## 🚀 Architecture Overview

QuickBite follows a **Modular Monolith** architecture, designed for easy scalability and maintenance. It leverages an **Event-Driven Architecture (EDA)** via Kafka to decouple long-running processes (like order tracking) from the main request-response cycle.

### Key Pillars:
- **Scalability**: Decoupled modules and event-driven status updates.
- **Type Safety**: End-to-end TypeScript implementation with Zod for schema validation.
- **Security**: Robust RBAC, MFA, and JWT-based authentication.
- **Maintainability**: Centralized constants, unified messaging system, and clear separation of concerns.

---

## 🛠️ Technology Stack

- **Runtime**: Node.js (v18+)
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL with Sequelize ORM
- **Messaging**: Apache Kafka (KafkaJS)
- **Validation**: Zod
- **Documentation**: Swagger UI
- **Logging**: Pino & Pino-Pretty

---

## ✨ Features

- **Identity & Access Management**:
  - Secure JWT-based authentication.
  - Role-Based Access Control (RBAC) with hierarchical permissions.
  - Multi-Factor Authentication (MFA) support.
  - Account deactivation and audit logs.
- **Order Management**:
  - Complex ordering flow with multiple menu items and quantities.
  - Real-time order status tracking via Kafka events (`PENDING`, `PREPARING`, `DELIVERED`, etc.).
- **Restaurant & Menu Control**:
  - Sophisticated owner/admin dashboard capabilities.
  - Dynamic menu and item management.
- **System Integrity**:
  - Centralized error handling and standardized API responses.
  - Rate limiting and input sanitization to prevent common vulnerabilities.

---

## 🏁 Getting Started

### 1. Prerequisites
- **Node.js** (v18 or higher)
- **PostgreSQL**
- **Apache Kafka** (Zookeeper + Broker)

### 2. Environment Setup
Create a `.env` file in the root directory and configure the following:

```env
PORT=3000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_user
DB_PASSWORD=your_password
DB_NAME=quickbite

# Auth
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=1d
JWT_COOKIE_EXPIRES_IN=1
ENCRYPTION_KEY=your_mfa_encryption_key

# Kafka
KAFKA_BROKER=localhost:9092

# Security
ALLOWED_ORIGINS=http://localhost:3000
```

### 3. Installation
```bash
npm install
```

### 4. Database Setup
The project uses **Umzug** for reliable migrations and data seeding.

```bash
# Run all pending migrations (Schema)
npm run db:migrate

# Seed initial data (Roles & Permissions)
npm run db:seed
```

---

## 🚀 Running the Server

```bash
# Development Mode (with hot-reload)
npm run dev

# Build for Production
npm run build

# Start Production Server
npm run start
```

---

## 📖 API Documentation

Once the server is running, you can access the interactive Swagger documentation at:
`http://localhost:3000/api-docs`

---

## 🛰️ Kafka Integration

QuickBite utilizes Kafka for reliable background processing.

| Topic Name | Use Case |
| :--- | :--- |
| `order-status-updates` | Triggers when orders are placed, updated, or cancelled. |
| `user-events` | (Upcoming) For analytics and notification triggers. |

To manage Kafka configuration, refer to `src/constants.ts` and `src/services/kafka.service.ts`.

---

## 📂 Project Structure

```text
├── migrations/         # Database schema changes
├── seeders/            # Initial data seeds
├── src/
│   ├── config/         # Server and environment configuration
│   ├── constants.ts    # Centralized constants (Statuses, Roles, Messages)
│   ├── middleware/     # Global and route-specific middleware
│   ├── models/         # Sequelize model definitions and interfaces
│   ├── modules/        # Feature-based business logic (Auth, Order, User, etc.)
│   ├── services/       # Core infrastructure services (Kafka, Auditing)
│   ├── utils/          # Common helper functions
│   ├── app.ts          # Express application setup
│   └── server.ts       # Application entry point
└── package.json
```

---

## 📄 License
This project is for demonstration and resume purposes. All rights reserved.
