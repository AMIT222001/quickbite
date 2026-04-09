# Running the Project with Docker

This guide explains how to run the entire stack (Application, PostgreSQL, Redis, and Kafka) using Docker and Docker Compose.

## Prerequisites
- [Docker](https://docs.docker.com/get-docker/) installed.
- [Docker Compose](https://docs.docker.com/compose/install/) installed.

## Getting Started

### 1. Build and Start the Containers
Run the following command to build the application image and start all services in the background:

```bash
docker compose up -d --build
```

### 2. Verify the Services
You can check the logs of all containers using:

```bash
docker compose logs -f
```

The application will be accessible at [http://localhost:3000](http://localhost:3000).

### 3. Running Database Migrations
Since migrations are now separated from the server startup, you should run them manually in the container after the database is up:

```bash
docker compose exec app npm run db:migrate
```

## Service Overview

| Service | Hostname | Internal Port | External Port | Description |
|---------|----------|---------------|---------------|-------------|
| **app** | `app` | 3000 | 3000 | Express Backend |
| **db** | `db` | 5432 | 5432 | PostgreSQL Database |
| **redis** | `redis` | 6379 | 6379 | Redis Cache |
| **kafka** | `kafka` | 9092 | 9092 | Apache Kafka Broker |
| **zookeeper** | `zookeeper` | 2181 | 2181 | Kafka Coordinator |

## Environment Variables
The application uses the environment variables defined in the `app` service of `docker-compose.yml`. In a production environment, you should move these to a secure `.env` file or use a secret management system.

> [!IMPORTANT]
> The current setup includes placeholder secrets for `JWT_SECRET` and `ENCRYPTION_KEY`. Ensure you change these to unique, secure strings in a live production environment.
