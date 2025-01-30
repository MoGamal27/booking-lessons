const TimeSlot = require('../Model/timeSlot');
const asyncHandler = require('express-async-handler');


exports.createTimeSlot = asyncHandler(async (req, res) => {
    const { teacherId, timeSlot } = req.body;
    
    
  
      const [slot, created] = await TimeSlot.findOrCreate({
        where: { 
          teacherId, 
          timeSlot, 
          dayOfWeek: parseInt(dayOfWeek, 10) 
        },
        defaults: { isAvailable: true }
      });
  
      if (!created) {
        await slot.update({ isAvailable: !slot.isAvailable });
      }
  
      res.json(slot);
    
  });

  exports.getTeacherTimeeSlots = asyncHandler(async (req, res) => {
    const { teacherId } = req.params;
    const { date } = req.query;
    
    // Calculate day of week from the date
    const dayOfWeek = new Date(date).getDay();

    const timeSlots = await TimeSlot.findAll({
      where: { 
        teacherId,
        dayOfWeek: dayOfWeek || 0 // Provide default value
      }
    });
    res.json(timeSlots);
  });

  exports.updateTimeSlot = asyncHandler(async (req, res) => {
    const { teacherId, slots } = req.body;
    
    const updates = slots.map(slot => 
      TimeSlot.upsert({
        teacherId,
        timeSlot: slot.time,
        dayOfWeek: slot.day,
        isAvailable: slot.isAvailable
      })
    );

    await Promise.all(updates);
    res.json({ success: true });
  });

