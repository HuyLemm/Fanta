const ActivityModel = require('../models/Activity');

const logActivity = async (userId, movieId, action, details) => {
  try {
    const newLog = new ActivityModel({
      userId,
      movieId,
      action,
      details
    });
    await newLog.save();
  } catch (error) {
    console.error('Error logging activity:', error);
  }
};

module.exports = logActivity;
