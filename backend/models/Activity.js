const mongoose = require('mongoose');
const ActivitySchema = new mongoose.Schema({
  user: String,
  action: String,
  subject: String,
  time: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Activity', ActivitySchema);