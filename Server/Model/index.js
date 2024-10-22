const { sequelize } = require('../Config/connectDB');

const User = require('./userModel');
const Schedule = require('./scheduleModel');
const Teacher = require('./teacherModel');
const Booking = require('./bookingModel');

// define associations
Teacher.hasMany(Schedule, { foreignKey: 'teacherId', sourceKey: 'id' });
Schedule.belongsTo(Teacher, { foreignKey: 'teacherId', targetKey: 'id' });

Teacher.hasMany(Booking, { foreignKey: 'teacherId', sourceKey: 'id' });
Booking.belongsTo(Teacher, { foreignKey: 'teacherId', targetKey: 'id' });

User.hasMany(Booking, { foreignKey: 'studentId', sourceKey: 'id' });
Booking.belongsTo(User, { foreignKey: 'studentId', targetKey: 'id' });




module.exports = {
    User,
    Schedule,
    Teacher,
    Booking
}