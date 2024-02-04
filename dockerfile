FROM node:18-slim

# Copy local code to the container image
WORKDIR /usr/src/app
COPY . .

# Install dependencies
RUN npm i

# Run the app on entry
ENTRYPOINT [ "npx", "ts-node", "main.ts" ]
