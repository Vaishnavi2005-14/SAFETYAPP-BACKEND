const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const ContactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true }
});

const ProfileSchema = new mongoose.Schema({
  name: { type: String, default: '' },
  age: { type: String, default: '' },
  phone: { type: String, default: '' },
  aadhaar: { type: String, default: '' },
  customMessage: { type: String, default: '🚨 Emergency! I need help immediately. My location:' },
  shakeEnabled: { type: Boolean, default: true },
  shakeSensitivity: { type: String, default: 'Medium' }
});

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profile: { type: ProfileSchema, default: () => ({}) },
  contacts: { type: [ContactSchema], default: [
    { name: 'Police Helpline', phone: '100' },
    { name: 'Women Helpline', phone: '1091' }
  ] }
});

UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
