# Use the official Bun image
FROM oven/bun

# Set working directory
WORKDIR /app

# Copy files
COPY . .

# Install deps
RUN bun install

# Start the app
CMD ["bun", "run", "."]
