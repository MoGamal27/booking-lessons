const { Schedule, User, Teacher } = require('../Model/index');

exports.createSchedule = async (req, res) => {
    try {
        const { teacherId, availableTimes} = req.body;
        
        const schedule = await Schedule.create({ 
            teacherId, 
            availableTimes: JSON.stringify(availableTimes) ,
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
            where: { teacherId : teacherId },
            include: [{ model: Teacher, as: 'Teacher', attributes: ['id', 'name', 'image', 'video', 'bio'] }],
        });

        // Map through schedules to parse availableTimes if it's a string
        const schedulesWithParsedTimes = schedules.map(schedule => ({
            ...schedule.toJSON(),
            availableTimes: JSON.parse(schedule.availableTimes) // Parse the string to JSON
        }));

        res.status(200).json(schedulesWithParsedTimes);
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
// update schedule teacherid 
exports.updateScheduleByTeacherId = async (req, res) => {
    const { teacherId } = req.params;
    const { availableTimes } = req.body;

    try {
        // Find the existing schedule for the teacher
        let schedule = await Schedule.findOne({ teacherId });

        if (!schedule) {
            // If no schedule exists, create a new one
            schedule = new Schedule({ teacherId, availableTimes });
        } else {
            // If schedule exists, update the available times
            schedule.availableTimes = availableTimes;
        }

        // Save the updated or new schedule
        await schedule.save();

        res.status(200).json({
            message: 'Schedule updated successfully',
            schedule
        });
    } catch (error) {
        console.error('Error updating schedule:', error);
        res.status(500).json({
            message: 'An error occurred while updating the schedule',
            error: error.message
        });
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

