const { Schedule, User } = require('../Model/index');

exports.createSchedule = async (req, res) => {
    try {
        const { teacherId, availableTimes, price } = req.body;
        
        const schedule = await Schedule.create({ 
            teacherId, 
            availableTimes: JSON.stringify(availableTimes) ,
            price
        });

        res.status(201).json(schedule);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getScheduleByTeacher = async (req, res) => {
    try {
        const { teacherId } = req.params;
        const schedules = await Schedule.findAll({
            where: { teacherId },
            include: [{ model: User, as: 'User' }]
        });
        res.status(200).json(schedules);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getAllSchedules = async (req, res) => {
    try {
        const schedules = await Schedule.findAll();
        res.status(200).json(schedules);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.updateSchedule = async (req, res) => {
    try {
        const { id } = req.params;
        const { availableTimes } = req.body;
        const schedule = await Schedule.findByPk(id);
        if (schedule) {
            schedule.availableTimes = availableTimes;
            await schedule.save();
            res.status(200).json(schedule);
        } else {
            res.status(404).json({ message: 'Schedule not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteSchedule = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Schedule.destroy({ where: { id } });
        if (deleted) {
            res.status(204).send("Schedule deleted");
        } else {
            res.status(404).json({ message: 'Schedule not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
