# Booking Lessons Server

This is the backend server for the Booking Lessons application, built with Node.js and Express.js, utilizing a MySQL database through Sequelize ORM.

## Project Structure

```
server/
├── Config/         # Database and other configuration files
├── Controller/     # Request handlers and business logic
├── Middleware/     # Custom middleware functions
├── Model/         # Database models and schemas
├── Routes/        # API route definitions
├── Services/      # Business logic services
├── utils/         # Utility functions and helpers
├── seeders/       # Database seed files
└── server.js      # Main application entry point
```

## Technology Stack

- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **MySQL** - Database
- **Sequelize** - ORM for database operations
- **JWT** - Authentication and authorization
- **Bcrypt** - Password hashing
- **Nodemailer** - Email services
- **Multer** - File upload handling
- **Cloudinary** - Cloud storage for media files
- **PayPal SDK** - Payment processing
- **Google APIs** - Google integration services
- **FFMPEG** - Media processing

## Key Features

1. **Authentication & Authorization**
   - JWT-based authentication
   - Google OAuth integration
   - Password hashing with bcrypt
   - Role-based access control

2. **File Management**
   - File upload support with Multer
   - Cloud storage integration with Cloudinary
   - Media processing capabilities with FFMPEG

3. **Payment Processing**
   - PayPal integration for secure payments
   - Transaction management

4. **Email Services**
   - Email notifications using Nodemailer
   - HTML email templates

5. **API Security**
   - CORS enabled
   - Request validation
   - Error handling middleware

## Getting Started

1. **Installation**
   ```bash
   npm install
   ```

2. **Environment Setup**
   Create a `.env` file with the following variables:
   ```
   PORT=3000
   DB_NAME=your_database_name
   DB_USER=your_database_user
   DB_PASSWORD=your_database_password
   DB_HOST=localhost
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_key
   CLOUDINARY_API_SECRET=your_cloudinary_secret
   PAYPAL_CLIENT_ID=your_paypal_client_id
   PAYPAL_CLIENT_SECRET=your_paypal_client_secret
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   ```

3. **Database Setup**
   ```bash
   # Run database migrations
   npx sequelize-cli db:migrate

   # Run seeders (if any)
   npx sequelize-cli db:seed:all
   ```

4. **Start the Server**
   ```bash
   npm start
   ```

## API Routes

- **Authentication Routes** (`/auth`)
  - POST /auth/register - User registration
  - POST /auth/login - User login
  - GET /auth/google - Google OAuth login

- **Main Routes** (`/api`)
  - Various endpoints for business logic
  - Protected routes requiring authentication
  - File upload endpoints
  - Payment processing endpoints

## Error Handling

The application includes global error handling middleware for:
- Not found routes (404)
- Validation errors
- Database errors
- Authentication errors

## Development

- Uses `nodemon` for automatic server restart during development
- Express async handler for cleaner async/await syntax
- Express validator for request validation

## Security Features

- CORS enabled for cross-origin requests
- Request validation
- Secure password hashing
- JWT token-based authentication
- Environment variable protection
- Secure file upload handling

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

ISC License
