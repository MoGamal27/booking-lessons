const { sequelize } = require('../Config/connectDB');

const User = require('./userModel');
const Teacher = require('./teacherModel');
const Booking = require('./bookingModel');
const Point = require('./PointModel');
const Token = require('./tokenModel');
const TimeSlot = require('./timeSlot');

// define associations
Teacher.hasMany(Booking, { foreignKey: 'teacherId', sourceKey: 'id' });
Booking.belongsTo(Teacher, { foreignKey: 'teacherId', targetKey: 'id' });

User.hasMany(Booking, { foreignKey: 'studentId', sourceKey: 'id' });
Booking.belongsTo(User, { foreignKey: 'studentId', targetKey: 'id' });

Teacher.hasMany(Point, { foreignKey: 'teacherId', as: 'teacherRequests' });
User.hasMany(Point, { foreignKey: 'studentId', as: 'studentRequests' });

Point.belongsTo(Teacher, { foreignKey: 'teacherId', as: 'teacher' });
Point.belongsTo(User, { foreignKey: 'studentId', as: 'student' });

User.hasMany(Token, { foreignKey: 'userId', sourceKey: 'id' });
Token.belongsTo(User, { foreignKey: 'userId', targetKey: 'id' });

Teacher.hasMany(TimeSlot, { foreignKey: 'teacherId', sourceKey: 'id' });
TimeSlot.belongsTo(Teacher, { foreignKey: 'teacherId', targetKey: 'id' });

module.exports = {
    User,
    Teacher,
    Booking
}