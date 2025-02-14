FROM node:18-alpine 

# Copy local code to the container image
WORKDIR /usr/src/app
COPY . .

# Install dependencies
RUN npm i
RUN npx prisma generate
RUN apk add --no-cache openssl1.1-compat

# Run the app on entry
ENTRYPOINT [ "npx", "ts-node", "main.ts" ]
