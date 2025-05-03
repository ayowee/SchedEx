const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  fullName: String,
  nic: String,
  email: { type: String, required: true, unique: true },
  password: { type: String },
  contactNumber: String,
  userType: { type: String, enum: ['SuperAdmin', 'Admin', 'Examiner', 'Student'], required: true },
  isFirstLogin: { type: Boolean, default: true },
  permissions: [String],
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Method to compare password
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);