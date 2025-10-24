#
# ---- STAGE 1: Builder ----
#
# Use the full Node.js 22 image (Debian-based) for the build stage.
# This image includes 'build-essentials' (like C++ compilers)
# which are necessary if your dependencies need to build native modules.
FROM node:22 AS builder

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (or yarn.lock, etc.)
# This is done first to leverage Docker's build cache.
# If these files don't change, Docker won't re-run 'npm ci'.
COPY package*.json ./

# Install all dependencies, including devDependencies needed for building
RUN npm ci

# Copy the rest of your application's source code
# This is done *after* npm ci, so code changes don't bust the dependency cache.
COPY . .

# Run your build script (e.g., for TypeScript compilation, webpack, etc.)
# This assumes you have a "build" script in your package.json
# like: "build": "tsc -p ." or "build": "next build"
RUN npm run build

#
# ---- STAGE 2: Production ----
#
# Use the minimal and more secure Node.js 22 Alpine image.
# Alpine is a lightweight Linux distribution, which significantly
# reduces the final image size and attack surface.
FROM node:22-alpine

# Set the working directory
WORKDIR /usr/src/app

# Create a non-root user and group for security.
# Running containers as 'root' is a major security risk.
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy package files again
COPY package*.json ./

# Install *only* production dependencies.
# We run 'npm ci' again here instead of copying node_modules from 'builder'.
# This is critical because native modules built on the 'builder' (Debian)
# are not compatible with the 'production' image (Alpine).
RUN npm ci --omit=dev --ignore-scripts

# Copy the built application code from the 'builder' stage.
# We also set the owner of these files to our new non-root user.
# Adjust "./dist" if your build script outputs to a different directory.
COPY --from=builder --chown=appuser:appgroup /usr/src/app/dist ./dist

# Set the NODE_ENV environment variable to 'production'.
# This is crucial for performance and security in many Node.js frameworks.
ENV NODE_ENV=production
ENV PORT=3001

# Expose the port your application will run on.
# This must match the PORT environment variable.
EXPOSE 3001

# Add a basic healthcheck
# Docker will periodically check this endpoint to ensure your app is running.
# Customize '/healthz' to a real health check endpoint in your app.
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q --spider http://localhost:3001/healthz || exit 1

# Switch to the non-root user
USER appuser

# The command to start the application.
# We use the 'exec' form (JSON array) to run 'node' as PID 1.
# This ensures that OS signals (like SIGTERM for 'docker stop')
# are properly received by the Node.js process for graceful shutdowns.
#
# Using 'npm start' is generally discouraged in production containers
# as it adds an unnecessary 'npm' process layer.
CMD [ "node", "dist/app.js" ]
