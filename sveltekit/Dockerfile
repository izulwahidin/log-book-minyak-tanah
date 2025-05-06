# SvelteKit with pnpm
FROM node:20-alpine

# Install pnpm globally
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy only lockfile and package.json for caching
COPY ./app/pnpm-lock.yaml ./app/package.json ./

# Install dependencies
RUN pnpm install

# Copy the rest of the app
COPY ./app .

# Build the app
RUN pnpm build

EXPOSE 3000

# Run the preview server with host binding
CMD ["pnpm", "preview", "--host"]
