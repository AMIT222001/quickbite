# --- Build Stage ---
FROM node:24-alpine AS builder

WORKDIR /usr/src/app

# Copy dependency manifests
COPY package*.json ./

# Install all dependencies (including devDependencies for tsc)
RUN npm install

# Copy source code and build
COPY . .
RUN npm run build

# --- Production Stage ---
FROM node:24-alpine

WORKDIR /usr/src/app

ENV NODE_ENV=production

# Copy dependency manifests
COPY package*.json ./

# Install only production dependencies
RUN npm install --omit=dev

# Copy compiled code from builder stage
COPY --from=builder /usr/src/app/dist ./dist

# Expose the application port
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start"]
