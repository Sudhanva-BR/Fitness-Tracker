const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String, required: true, enum: ['Cardio', 'Strength', 'Flexibility', 'Yoga', 'Sports', 'Other'] },
  name: { type: String, required: true },
  sets: { type: Number, default: 1 },
  reps: { type: Number, default: 0 },
  weight: { type: Number, default: 0 },
  duration: { type: Number, required: true },
  caloriesBurned: { type: Number, required: true },
  workoutDate: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Workout', workoutSchema);
