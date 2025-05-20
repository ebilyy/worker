# IT Job Search Platform - Backend

## Overview
Backend service for the IT Job Search Platform, built with Express.js, TypeScript, and Prisma.

## Prerequisites
- Node.js >= 20.12.2
- npm >= 10.5.0
- PostgreSQL

## Setup
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory with the following content:
   ```
   PORT=3000
   NODE_ENV=development
   JWT_SECRET=your_jwt_secret_here
   JWT_EXPIRES_IN=7d
   DATABASE_URL="postgresql://user:password@localhost:5432/job_search_db?schema=public"
   ```
4. Build the project:
   ```bash
   npm run build
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```

## Available Scripts
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build the project
- `npm start` - Start production server
- `npm run lint` - Run linting
- `npm test` - Run tests

## Project Structure
```
src/
├── config/        # Configuration files
├── controllers/   # Route controllers
├── middleware/    # Custom middleware
├── models/        # Data models
├── routes/        # API routes
├── services/      # Business logic
├── types/         # TypeScript types
└── utils/         # Utility functions
```

## API Documentation
Coming soon...

## Contributing
1. Create a feature branch
2. Commit your changes
3. Push to the branch
4. Create a Pull Request 