FROM node:21

# Create and set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Clean cache (optional)
RUN npm cache clean --force

# Install dependencies
RUN npm install 

# Copy the rest of the source code
COPY . .

# Build the application
RUN npm run build

# Expose app port
EXPOSE 5000

# Run the app
CMD [ "node", "dist/src/main" ]