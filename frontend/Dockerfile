# Use an official Node.js 18 LTS runtime as a parent image
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if available) and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the frontend application code
COPY . .

# Expose the port that the frontend development server will run on
EXPOSE 3000

# Define the command to run your frontend development server
CMD ["npm", "run", "dev"]
