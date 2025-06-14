import React, { useState } from 'react';

export const WorkoutForm = ({ workout, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    category: workout?.category || 'Cardio',
    name: workout?.name || '',
    sets: workout?.sets || 1,
    reps: workout?.reps || 0,
    weight: workout?.weight || 0,
    duration: workout?.duration || '',
    caloriesBurned: workout?.caloriesBurned || '',
    workoutDate: workout?.workoutDate ? new Date(workout.workoutDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (!formData.name.trim()) {
      setError('Workout name is required');
      setLoading(false);
      return;
    }
    if (!formData.duration || formData.duration <= 0) {
      setError('Duration must be greater than 0');
      setLoading(false);
      return;
    }
    if (!formData.caloriesBurned || formData.caloriesBurned <= 0) {
      setError('Calories burned must be greater than 0');
      setLoading(false);
      return;
    }

    const result = await onSubmit(formData);
    if (!result.success) {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <div className="workout-form-container">
      <form onSubmit={handleSubmit}>
        <h3>{workout ? '✏️ Edit Workout' : '➕ Add New Workout'}</h3>
        {error && <div className="alert alert-error">{error}</div>}
        
        <div className="form-group">
          <label>🏷️ Category</label>
          <select name="category" className="form-control" value={formData.category} onChange={handleChange} required>
            <option value="Cardio">🏃‍♂️ Cardio</option>
            <option value="Strength">🏋️‍♂️ Strength</option>
            <option value="Flexibility">🤸‍♂️ Flexibility</option>
            <option value="Yoga">🧘‍♂️ Yoga</option>
            <option value="Sports">⚽ Sports</option>
            <option value="Other">🎯 Other</option>
          </select>
        </div>

        <div className="form-group">
          <label>📝 Workout Name</label>
          <input 
            type="text" 
            name="name" 
            className="form-control" 
            value={formData.name} 
            onChange={handleChange} 
            placeholder="e.g., Morning Run, Push-ups, etc."
            required 
          />
        </div>

        <div className="grid grid-2">
          <div className="form-group">
            <label>💪 Sets</label>
            <input 
              type="number" 
              name="sets" 
              className="form-control" 
              value={formData.sets} 
              onChange={handleChange} 
              min="1" 
            />
          </div>
          <div className="form-group">
            <label>🔁 Reps</label>
            <input 
              type="number" 
              name="reps" 
              className="form-control" 
              value={formData.reps} 
              onChange={handleChange} 
              min="0" 
            />
          </div>
        </div>

        <div className="grid grid-2">
          <div className="form-group">
            <label>🏋️ Weight (kg)</label>
            <input 
              type="number" 
              name="weight" 
              className="form-control" 
              value={formData.weight} 
              onChange={handleChange} 
              min="0" 
              step="0.5" 
            />
          </div>
          <div className="form-group">
            <label>⏱️ Duration (minutes) *</label>
            <input 
              type="number" 
              name="duration" 
              className="form-control" 
              value={formData.duration} 
              onChange={handleChange} 
              required 
              min="1" 
            />
          </div>
        </div>

        <div className="grid grid-2">
          <div className="form-group">
            <label>🔥 Calories Burned *</label>
            <input 
              type="number" 
              name="caloriesBurned" 
              className="form-control" 
              value={formData.caloriesBurned} 
              onChange={handleChange} 
              required 
              min="1" 
            />
          </div>
          <div className="form-group">
            <label>📅 Workout Date</label>
            <input 
              type="date" 
              name="workoutDate" 
              className="form-control" 
              value={formData.workoutDate} 
              onChange={handleChange} 
              required 
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
          <button type="submit" className="btn btn-success" disabled={loading}>
            {loading ? '⏳ Saving...' : (workout ? '✅ Update Workout' : '➕ Add Workout')}
          </button>
          <button type="button" onClick={onCancel} className="btn btn-secondary">
            ❌ Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export const WorkoutCard = ({ workout, onEdit, onDelete }) => (
  <div className="workout-card">
    <div className="workout-header">
      <h4>{workout.name}</h4>
      <div>
        <span className="workout-category">{workout.category}</span>
        <div className="workout-actions" style={{ marginLeft: '1rem' }}>
          <button onClick={() => onEdit(workout)} className="btn btn-sm btn-primary">✏️ Edit</button>
          <button onClick={() => onDelete(workout._id)} className="btn btn-sm btn-danger" style={{ marginLeft: '0.5rem' }}>🗑️ Delete</button>
        </div>
      </div>
    </div>
    <div className="workout-details">
      <div className="workout-detail">
        <div className="workout-detail-label">💪 Sets</div>
        <div className="workout-detail-value">{workout.sets}</div>
      </div>
      <div className="workout-detail">
        <div className="workout-detail-label">🔁 Reps</div>
        <div className="workout-detail-value">{workout.reps}</div>
      </div>
      <div className="workout-detail">
        <div className="workout-detail-label">🏋️ Weight</div>
        <div className="workout-detail-value">{workout.weight}kg</div>
      </div>
      <div className="workout-detail">
        <div className="workout-detail-label">⏱️ Duration</div>
        <div className="workout-detail-value">{workout.duration}min</div>
      </div>
      <div className="workout-detail">
        <div className="workout-detail-label">🔥 Calories</div>
        <div className="workout-detail-value">{workout.caloriesBurned}</div>
      </div>
      <div className="workout-detail">
        <div className="workout-detail-label">📅 Date</div>
        <div className="workout-detail-value">{new Date(workout.workoutDate).toLocaleDateString()}</div>
      </div>
    </div>
  </div>
);

export const WorkoutList = ({ workouts, loading, onEdit, onDelete }) => {
  if (loading) return <div className="loading">Loading workouts...</div>;
  if (workouts.length === 0) return (
    <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
      <h3>No workouts found</h3>
      <p>Start your fitness journey by adding your first workout!</p>
    </div>
  );

  return (
    <div>
      {workouts.map(workout => (
        <WorkoutCard key={workout._id} workout={workout} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
};
