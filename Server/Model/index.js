const { sequelize } = require('../Config/connectDB');

const User = require('./userModel');
const Schedule = require('./scheduleModel');
const Teacher = require('./teacherModel');
const Booking = require('./bookingModel');

// define associations
User.hasMany(Schedule, { foreignKey: 'teacherId', sourceKey: 'id' });
Schedule.belongsTo(User, { foreignKey: 'teacherId', targetKey: 'id' });

User.hasMany(Teacher, { foreignKey: 'userId', sourceKey: 'id' });
Teacher.belongsTo(User, { foreignKey: 'userId', targetKey: 'id' });

User.hasMany(Booking, { foreignKey: 'teacherId', sourceKey: 'id' });
Booking.belongsTo(User, { foreignKey: 'teacherId', targetKey: 'id' });

User.hasMany(Booking, { foreignKey: 'studentId', sourceKey: 'id' });
Booking.belongsTo(User, { foreignKey: 'studentId', targetKey: 'id' });




module.exports = {
    User,
    Schedule,
    Teacher,
    Booking
}