const express = require('express');
const Workout = require('../models/Workout');
const auth = require('../middleware/auth');

const router = express.Router();
router.use(auth);

// Get all workouts with filters
router.get('/', async (req, res) => {
  try {
    const { startDate, endDate, category } = req.query;
    let filter = { user: req.user._id };

    if (startDate || endDate) {
      filter.workoutDate = {};
      if (startDate) filter.workoutDate.$gte = new Date(startDate);
      if (endDate) filter.workoutDate.$lte = new Date(endDate);
    }
    if (category) filter.category = category;

    const workouts = await Workout.find(filter).sort({ workoutDate: -1 });
    res.json(workouts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create workout
router.post('/', async (req, res) => {
  try {
    const workout = await Workout.create({ ...req.body, user: req.user._id });
    res.status(201).json(workout);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update workout
router.put('/:id', async (req, res) => {
  try {
    const workout = await Workout.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true }
    );
    if (!workout) return res.status(404).json({ message: 'Workout not found' });
    res.json(workout);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete workout
router.delete('/:id', async (req, res) => {
  try {
    const workout = await Workout.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!workout) return res.status(404).json({ message: 'Workout not found' });
    res.json({ message: 'Workout deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get workout stats
router.get('/stats', async (req, res) => {
  try {
    const stats = await Workout.aggregate([
      { $match: { user: req.user._id } },
      { $group: { _id: '$category', totalCalories: { $sum: '$caloriesBurned' }, totalWorkouts: { $sum: 1 } } }
    ]);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
