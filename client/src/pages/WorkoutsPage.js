import React, { useState } from 'react';
import { WorkoutList, WorkoutForm } from '../components/Workouts';
import { useWorkouts } from '../hooks/useWorkouts';

const WorkoutsPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState(null);
  const [filters, setFilters] = useState({ 
    startDate: '', 
    endDate: '', 
    category: '',
    sortBy: 'date',
    sortOrder: 'desc'
  });
  const [searchTerm, setSearchTerm] = useState('');
  const { workouts, loading, fetchWorkouts, addWorkout, updateWorkout, deleteWorkout } = useWorkouts();

  const handleFilterChange = (e) => {
    const newFilters = { ...filters, [e.target.name]: e.target.value };
    setFilters(newFilters);
    fetchWorkouts(newFilters);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredWorkouts = workouts.filter(workout =>
    workout.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    workout.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddWorkout = () => {
    setEditingWorkout(null);
    setShowForm(true);
  };

  const handleEditWorkout = (workout) => {
    setEditingWorkout(workout);
    setShowForm(true);
  };

  const handleFormSubmit = async (workoutData) => {
    const result = editingWorkout 
      ? await updateWorkout(editingWorkout._id, workoutData)
      : await addWorkout(workoutData);
    
    if (result.success) {
      setShowForm(false);
      setEditingWorkout(null);
    }
    return result;
  };

  const handleDeleteWorkout = async (id) => {
    if (window.confirm('Are you sure you want to delete this workout? This action cannot be undone.')) {
      await deleteWorkout(id);
    }
  };

  const clearAllFilters = () => {
    setFilters({ startDate: '', endDate: '', category: '', sortBy: 'date', sortOrder: 'desc' });
    setSearchTerm('');
    fetchWorkouts();
  };

  return (
    <div className="container fade-in">
      <div className="page-header">
        <div>
          <h1>💪 My Workouts</h1>
          <p>Track, manage, and analyze your fitness journey</p>
        </div>
        <button onClick={handleAddWorkout} className="btn btn-success">
          ➕ Add New Workout
        </button>
      </div>

      {/* Enhanced Search and Filters */}
      <div className="filters">
        <h3>🔍 Search & Filter Workouts</h3>
        
        {/* Search Bar */}
        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
          <input
            type="text"
            placeholder="🔍 Search workouts by name or category..."
            className="form-control"
            value={searchTerm}
            onChange={handleSearchChange}
            style={{ fontSize: '1rem', padding: '1rem' }}
          />
        </div>

        <div className="filters-row">
          <div className="form-group">
            <label>📅 Start Date</label>
            <input
              type="date"
              name="startDate"
              className="form-control"
              value={filters.startDate}
              onChange={handleFilterChange}
            />
          </div>
          <div className="form-group">
            <label>📅 End Date</label>
            <input
              type="date"
              name="endDate"
              className="form-control"
              value={filters.endDate}
              onChange={handleFilterChange}
            />
          </div>
          <div className="form-group">
            <label>🏷️ Category</label>
            <select
              name="category"
              className="form-control"
              value={filters.category}
              onChange={handleFilterChange}
            >
              <option value="">All Categories</option>
              <option value="Cardio">🏃‍♂️ Cardio</option>
              <option value="Strength">🏋️‍♂️ Strength</option>
              <option value="Flexibility">🤸‍♂️ Flexibility</option>
              <option value="Yoga">🧘‍♂️ Yoga</option>
              <option value="Sports">⚽ Sports</option>
              <option value="Other">🎯 Other</option>
            </select>
          </div>
          <div className="form-group">
            <label>📊 Sort By</label>
            <select
              name="sortBy"
              className="form-control"
              value={filters.sortBy}
              onChange={handleFilterChange}
            >
              <option value="date">📅 Date</option>
              <option value="calories">🔥 Calories</option>
              <option value="duration">⏱️ Duration</option>
              <option value="name">📝 Name</option>
            </select>
          </div>
          <div className="form-group">
            <label>🔄 Order</label>
            <select
              name="sortOrder"
              className="form-control"
              value={filters.sortOrder}
              onChange={handleFilterChange}
            >
              <option value="desc">⬇️ Descending</option>
              <option value="asc">⬆️ Ascending</option>
            </select>
          </div>
          <div className="form-group">
            <button onClick={clearAllFilters} className="btn btn-secondary">
              🗑️ Clear All
            </button>
          </div>
        </div>

        {/* Filter Summary */}
        <div style={{ marginTop: '1rem', padding: '1rem', background: 'var(--bg-color)', borderRadius: '8px' }}>
          <p style={{ margin: 0, color: 'var(--secondary-color)' }}>
            📈 Showing {filteredWorkouts.length} of {workouts.length} workouts
            {searchTerm && ` matching "${searchTerm}"`}
            {filters.category && ` in ${filters.category}`}
          </p>
        </div>
      </div>

      {/* Workout Form Modal */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <WorkoutForm
              workout={editingWorkout}
              onSubmit={handleFormSubmit}
              onCancel={() => {
                setShowForm(false);
                setEditingWorkout(null);
              }}
            />
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-4" style={{ marginBottom: '2rem' }}>
        <div className="stat-card">
          <div className="stat-value">{filteredWorkouts.length}</div>
          <div className="stat-label">Filtered Results</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">
            {filteredWorkouts.reduce((sum, w) => sum + w.caloriesBurned, 0).toLocaleString()}
          </div>
          <div className="stat-label">Total Calories</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">
            {Math.round(filteredWorkouts.reduce((sum, w) => sum + w.duration, 0) / 60)}h
          </div>
          <div className="stat-label">Total Duration</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">
            {filteredWorkouts.length > 0 ? 
              Math.round(filteredWorkouts.reduce((sum, w) => sum + w.caloriesBurned, 0) / filteredWorkouts.length) : 0}
          </div>
          <div className="stat-label">Avg Calories</div>
        </div>
      </div>

      {/* Workout List */}
      <WorkoutList
        workouts={filteredWorkouts}
        loading={loading}
        onEdit={handleEditWorkout}
        onDelete={handleDeleteWorkout}
      />
    </div>
  );
};

export default WorkoutsPage;
