# My Application

A general-purpose Node.js application using Express.js.

## Table of Contents

1. [Project Overview](#project-overview)
2. [Features](#features)
3. [Use Cases](#use-cases)
4. [Prerequisites](#prerequisites)
5. [Local Setup](#local-setup)
6. [Running the Application](#running-the-application)
7. [Docker Setup](#docker-setup)
8. [Available Scripts](#available-scripts)
9. [Authentication](#authentication)
10. [Examples](#examples)

## Project Overview

This is a Node.js application built with Express.js. It is designed to be containerized using Docker.

## Features

- JWT-based authentication and role-based authorization
- Rate limiting for API requests
- Centralized error handling
- Configurable logging
- Support for caching
- Database interaction utilities
- Pagination utilities
- Job queuing system
- Input validation
- Retry mechanism for resilient operations

## Use Cases

This application is suitable for various use cases, including:
1. Building RESTful APIs with authentication and authorization
2. Creating microservices with rate limiting and error handling
3. Implementing job queuing and processing systems
4. Developing applications that require caching and pagination
5. Building applications with robust logging and configuration management
6. Creating scalable and maintainable backend services

## Prerequisites

- Node.js (>=16.0.0)
- npm (>=8.0.0)
- Docker (for containerization)

## Local Setup

1. Clone the repository
2. Run `npm install` to install dependencies
3. Create a `.env` file based on the environment variables required (check `src/utils/config.js` for reference)

## Running the Application

- For development: `npm run dev`
- For production: `npm start`

## Docker Setup

1. Build the Docker image: `docker build -t my-application .`
2. Run the Docker container: `docker run -p 3000:3000 my-application`

## Available Scripts

- `start`: `node dist/index.js`
- `dev`: `nodemon --exec babel-node src/index.js`
- `build`: `babel src -d dist --copy-files`
- `test`: `jest`
- `test:watch`: `jest --watch`
- `test:coverage`: `jest --coverage`
- `lint`: `eslint src --ext .js`
- `lint:fix`: `eslint src --ext .js --fix`
- `clean`: `rimraf dist coverage`

## Authentication

The application uses JWT-based authentication. The `auth.js` middleware provides functions for generating and verifying tokens.

### Generating Tokens

To generate a token, use the `generateToken` function:
```javascript
import { generateToken } from './src/middleware/auth.js';

const payload = { userId: 1, role: 'admin' };
const secret = 'your-secret-key';
const token = generateToken(payload, secret);
```

### Authenticating Requests

To authenticate requests, use the `authenticate` middleware:
```javascript
import { authenticate } from './src/middleware/auth.js';

app.use(authenticate('your-secret-key'));
```

### Authorizing Users

To authorize users based on roles, use the `authorize` middleware:
```javascript
import { authorize } from './src/middleware/auth.js';

app.get('/admin', authorize('admin'), (req, res) => {
  res.send('Admin content');
});
```

## Examples

### Authenticating a User

1. Generate a token for a user with the role 'user'.
2. Use the token to access protected routes.

Example using `curl`:
```bash
# Generate token (for demonstration purposes only, don't expose your secret key in real scenarios)
token=$(curl -X POST -H "Content-Type: application/json" -d '{"userId":1,"role":"user"}' http://localhost:3000/auth/token)

# Access protected route
curl -X GET -H "Authorization: Bearer $token" http://localhost:3000/protected
```

## Additional Information

- The application uses Babel for ES6+ support and Jest for testing.
- Environment variables are managed using `dotenv`.
- The application is configured to run on port 3000 by default.
