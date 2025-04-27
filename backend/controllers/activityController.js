const Activity = require('../models/Activity');

exports.getRecentActivities = async (req, res) => {
  const activities = await Activity.find().sort({ time: -1 }).limit(20);
  res.json(activities);
};

exports.createActivity = async (req, res) => {
  const activity = new Activity(req.body);
  await activity.save();
  res.json(activity);
};
