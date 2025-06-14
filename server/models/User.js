const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  age: { type: Number, default: null },
  profileImage: { type: String, default: '' },
  theme: { type: String, enum: ['light', 'dark'], default: 'light' }
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  console.log('Hashing password for user:', this.email);
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  console.log('Comparing passwords...');
  const result = await bcrypt.compare(candidatePassword, this.password);
  console.log('Password comparison result:', result);
  return result;
};

module.exports = mongoose.model('User', userSchema);
