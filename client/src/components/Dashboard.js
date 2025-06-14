import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, LineElement, PointElement } from 'chart.js';
import { Bar, Pie, Line, Doughnut } from 'react-chartjs-2';
import { useWorkouts } from '../hooks/useWorkouts';
import { WorkoutForm } from './Workouts';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, LineElement, PointElement);

const Dashboard = ({ user }) => {
  const { workouts, stats, loading, addWorkout } = useWorkouts();
  const [showWorkoutForm, setShowWorkoutForm] = useState(false);
  const [dashboardStats, setDashboardStats] = useState({
    totalWorkouts: 0,
    totalCalories: 0,
    thisWeekWorkouts: 0,
    averageCalories: 0,
    totalDuration: 0,
    favoriteCategory: '',
    streak: 0,
    weeklyGoal: 5
  });

  const [timeFilter, setTimeFilter] = useState('week');

  useEffect(() => {
    if (workouts.length > 0) {
      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      
      const thisWeekWorkouts = workouts.filter(
        workout => new Date(workout.workoutDate) >= weekAgo
      );
      
      const totalCalories = workouts.reduce((sum, workout) => sum + workout.caloriesBurned, 0);
      const totalDuration = workouts.reduce((sum, workout) => sum + workout.duration, 0);
      
      // Find favorite category
      const categoryCount = {};
      workouts.forEach(workout => {
        categoryCount[workout.category] = (categoryCount[workout.category] || 0) + 1;
      });
      const favoriteCategory = Object.keys(categoryCount).reduce((a, b) => 
        categoryCount[a] > categoryCount[b] ? a : b, ''
      );

      // Calculate streak
      const sortedWorkouts = [...workouts].sort((a, b) => new Date(b.workoutDate) - new Date(a.workoutDate));
      let streak = 0;
      let currentDate = new Date();
      
      for (let workout of sortedWorkouts) {
        const workoutDate = new Date(workout.workoutDate);
        const diffDays = Math.floor((currentDate - workoutDate) / (1000 * 60 * 60 * 24));
        
        if (diffDays <= streak + 1) {
          streak++;
          currentDate = workoutDate;
        } else {
          break;
        }
      }
      
      setDashboardStats({
        totalWorkouts: workouts.length,
        totalCalories,
        thisWeekWorkouts: thisWeekWorkouts.length,
        averageCalories: workouts.length > 0 ? Math.round(totalCalories / workouts.length) : 0,
        totalDuration,
        favoriteCategory,
        streak,
        weeklyGoal: 5
      });
    }
  }, [workouts]);

  // Handle Add Today's Workout button click
  const handleAddTodaysWorkout = () => {
    setShowWorkoutForm(true);
  };

  // Handle workout form submission
  const handleWorkoutSubmit = async (workoutData) => {
    const result = await addWorkout(workoutData);
    if (result.success) {
      setShowWorkoutForm(false);
    }
    return result;
  };

  // Handle cancel workout form
  const handleCancelWorkout = () => {
    setShowWorkoutForm(false);
  };

  // Enhanced chart data
  const barData = {
    labels: workouts.slice(0, 10).map((workout, index) => 
      `${workout.name.substring(0, 8)}...`
    ),
    datasets: [
      {
        label: 'Calories Burned',
        data: workouts.slice(0, 10).map(workout => workout.caloriesBurned),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const pieData = {
    labels: stats.map(stat => stat._id),
    datasets: [
      {
        label: 'Calories by Category',
        data: stats.map(stat => stat.totalCalories),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(236, 72, 153, 0.8)',
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(239, 68, 68, 1)',
          'rgba(139, 92, 246, 1)',
          'rgba(236, 72, 153, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  // Weekly progress line chart
  const getWeeklyData = () => {
    const weekData = Array(7).fill(0);
    const weekLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    
    workouts.forEach(workout => {
      const workoutDate = new Date(workout.workoutDate);
      const dayOfWeek = workoutDate.getDay();
      const adjustedDay = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Adjust Sunday to be last
      weekData[adjustedDay] += workout.caloriesBurned;
    });

    return {
      labels: weekLabels,
      datasets: [
        {
          label: 'Weekly Calories',
          data: weekData,
          borderColor: 'rgba(59, 130, 246, 1)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: 'rgba(59, 130, 246, 1)',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 6,
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
    },
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        Loading your fitness dashboard...
      </div>
    );
  }

  const progressPercentage = (dashboardStats.thisWeekWorkouts / dashboardStats.weeklyGoal) * 100;

  return (
    <div className="container fade-in">
      <div className="dashboard-header">
        <h1>Welcome back, {user.name}! 💪</h1>
        <p>Ready to crush your fitness goals today?</p>
        <div className="progress-section" style={{ marginTop: '2rem' }}>
          <p style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>
            Weekly Goal Progress: {dashboardStats.thisWeekWorkouts}/{dashboardStats.weeklyGoal} workouts
          </p>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
            ></div>
          </div>
          <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
            {progressPercentage >= 100 ? '🎉 Goal achieved!' : `${Math.round(progressPercentage)}% complete`}
          </p>
        </div>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card slide-in">
          <div className="stat-value">{dashboardStats.totalWorkouts}</div>
          <div className="stat-label">Total Workouts</div>
          <div className="badge badge-primary" style={{ marginTop: '1rem' }}>All Time</div>
        </div>
        <div className="stat-card slide-in">
          <div className="stat-value">{dashboardStats.totalCalories.toLocaleString()}</div>
          <div className="stat-label">Total Calories Burned</div>
          <div className="badge badge-success" style={{ marginTop: '1rem' }}>🔥 Energy</div>
        </div>
        <div className="stat-card slide-in">
          <div className="stat-value">{dashboardStats.thisWeekWorkouts}</div>
          <div className="stat-label">This Week's Workouts</div>
          <div className="badge badge-warning" style={{ marginTop: '1rem' }}>📅 Weekly</div>
        </div>
        <div className="stat-card slide-in">
          <div className="stat-value">{Math.round(dashboardStats.totalDuration / 60)}h</div>
          <div className="stat-label">Total Training Time</div>
          <div className="badge badge-danger" style={{ marginTop: '1rem' }}>⏱️ Duration</div>
        </div>
        <div className="stat-card slide-in">
          <div className="stat-value">{dashboardStats.streak}</div>
          <div className="stat-label">Current Streak</div>
          <div className="badge badge-primary" style={{ marginTop: '1rem' }}>🔥 Days</div>
        </div>
        <div className="stat-card slide-in">
          <div className="stat-value">{dashboardStats.favoriteCategory || 'None'}</div>
          <div className="stat-label">Favorite Category</div>
          <div className="badge badge-success" style={{ marginTop: '1rem' }}>❤️ Preferred</div>
        </div>
      </div>

      {/* Charts Section */}
      {workouts.length > 0 ? (
        <>
          <div className="grid grid-2">
            <div className="chart-container">
              <h3 className="chart-title">📊 Calories per Workout (Last 10)</h3>
              <Bar data={barData} options={chartOptions} />
            </div>
            <div className="chart-container">
              <h3 className="chart-title">🥧 Calories by Category</h3>
              <Pie data={pieData} options={chartOptions} />
            </div>
          </div>

          <div className="grid grid-2">
            <div className="chart-container">
              <h3 className="chart-title">📈 Weekly Progress</h3>
              <Line data={getWeeklyData()} options={chartOptions} />
            </div>
            <div className="chart-container">
              <h3 className="chart-title">🎯 Goal Achievement</h3>
              <Doughnut 
                data={{
                  labels: ['Completed', 'Remaining'],
                  datasets: [{
                    data: [dashboardStats.thisWeekWorkouts, Math.max(0, dashboardStats.weeklyGoal - dashboardStats.thisWeekWorkouts)],
                    backgroundColor: ['rgba(16, 185, 129, 0.8)', 'rgba(229, 231, 235, 0.8)'],
                    borderColor: ['rgba(16, 185, 129, 1)', 'rgba(229, 231, 235, 1)'],
                    borderWidth: 2,
                  }]
                }}
                options={chartOptions}
              />
            </div>
          </div>
        </>
      ) : (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <h3>📊 No Data Yet</h3>
          <p>Start tracking your workouts to see beautiful charts and analytics!</p>
        </div>
      )}

      {/* Recent Workouts Section */}
      <div className="recent-workouts">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h3>🏃‍♂️ Recent Workouts</h3>
          <div className="badge badge-primary">{workouts.length} Total</div>
        </div>
        
        {workouts.length > 0 ? (
          workouts.slice(0, 3).map(workout => (
            <div key={workout._id} className="workout-card">
              <div className="workout-header">
                <h4>{workout.name}</h4>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <span className="workout-category">{workout.category}</span>
                  <div className="badge badge-success">
                    {new Date(workout.workoutDate).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div className="workout-details">
                <div className="workout-detail">
                  <div className="workout-detail-label">🔥 Calories</div>
                  <div className="workout-detail-value">{workout.caloriesBurned}</div>
                </div>
                <div className="workout-detail">
                  <div className="workout-detail-label">⏱️ Duration</div>
                  <div className="workout-detail-value">{workout.duration}min</div>
                </div>
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
              </div>
            </div>
          ))
        ) : (
          <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
            <h4>No workouts yet</h4>
            <p>Start your fitness journey by adding your first workout!</p>
          </div>
        )}
      </div>

      {/* Motivational Section with Working Button */}
      <div className="card" style={{ textAlign: 'center', marginTop: '2rem', background: 'var(--gradient-success)', color: 'white' }}>
        <h3 style={{ marginBottom: '1rem' }}>💡 Today's Motivation</h3>
        <p style={{ fontSize: '1.1rem', fontStyle: 'italic', marginBottom: '1.5rem' }}>
          "The only bad workout is the one that didn't happen. Keep pushing forward!"
        </p>
        <div style={{ marginTop: '1.5rem' }}>
          <button 
            className="btn btn-primary" 
            style={{ background: 'white', color: 'var(--primary-color)', fontWeight: '600' }}
            onClick={handleAddTodaysWorkout}
          >
            🎯 Add Today's Workout
          </button>
        </div>
      </div>

      {/* Workout Form Modal */}
      {showWorkoutForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <WorkoutForm
              workout={null}
              onSubmit={handleWorkoutSubmit}
              onCancel={handleCancelWorkout}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
