const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
  fullName: String,
  nic: String,
  email: { type: String, required: true, unique: true },
  contactNumber: String,
  userType: { type: String, enum: ['Admin', 'Examiner', 'Student'] },
  permissions: [String],
});
module.exports = mongoose.model('User', UserSchema);