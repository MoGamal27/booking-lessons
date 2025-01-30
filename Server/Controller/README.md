# Controllers Documentation

This directory contains all the controllers that handle the business logic for different aspects of the application. Here's a detailed breakdown of each controller:

## 1. TimeSlotController.js
Manages teacher availability and time slot management:
- Creating available time slots
- Managing teacher schedules
- Handling time slot bookings and cancellations

## 2. adminController.js
Handles administrative operations:
- User management
- System configuration
- Administrative dashboard operations
- User role management

## 3. authController.js
Manages authentication-related operations:
- User registration
- Login functionality
- Token management
- Session handling

## 4. bookingController.js (Main Business Logic)
Largest controller handling all booking-related operations:
- Lesson booking creation
- Booking modifications
- Booking cancellations
- Booking status management
- Schedule coordination
- Booking history

## 5. password-resetController.js
Handles password recovery and reset functionality:
- Password reset requests
- Token verification
- Password update operations
- Security validations

## 6. paymentController.js
Manages all payment-related operations:
- Payment processing
- Transaction management
- Payment verification
- Refund handling
- Payment history
- Integration with PayPal

## 7. teacherController.js
Manages teacher-specific operations:
- Teacher profile management
- Availability settings
- Schedule management
- Performance metrics

## 8. userController.js
Handles general user operations:
- Profile management
- User preferences
- Account settings
- User data operations

## 9. userGoogleController.js
Manages Google OAuth integration:
- Google sign-in
- Google account linking
- Google profile data synchronization

## Controller Design Patterns

All controllers follow these common patterns:
1. **Async/Await Pattern**: For handling asynchronous operations
2. **Error Handling**: Consistent error handling and response formats
3. **Input Validation**: Request validation before processing
4. **Response Format**: Standardized response structure
5. **Authentication Checks**: Proper authentication and authorization

## Common Response Format
```javascript
{
  status: "success" | "error",
  message: "Operation description",
  data: {} | [] // Optional data payload
}
```

## Error Handling
Controllers implement comprehensive error handling for:
- Validation errors
- Authentication errors
- Database operation errors
- External service errors
- Business logic errors

## Security Measures
- Input sanitization
- Request validation
- Authorization checks
- Rate limiting
- Data encryption where necessary

## Best Practices
1. Keep controllers focused and single-responsibility
2. Implement proper validation
3. Use service layer for complex business logic
4. Maintain consistent error handling
5. Document API endpoints
6. Include appropriate logging
7. Implement proper security measures
