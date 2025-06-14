import { useState, useEffect } from 'react';
import api from '../utils/api';

export const useWorkouts = () => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([]);

  const fetchWorkouts = async (filters = {}) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key]) params.append(key, filters[key]);
      });
      const response = await api.get(`/workouts?${params}`);
      setWorkouts(response.data);
    } catch (error) {
      console.error('Error fetching workouts:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get('/workouts/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const addWorkout = async (workoutData) => {
    try {
      const response = await api.post('/workouts', workoutData);
      setWorkouts(prev => [response.data, ...prev]);
      fetchStats();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Failed to add workout' };
    }
  };

  const updateWorkout = async (id, workoutData) => {
    try {
      const response = await api.put(`/workouts/${id}`, workoutData);
      setWorkouts(prev => prev.map(workout => workout._id === id ? response.data : workout));
      fetchStats();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Failed to update workout' };
    }
  };

  const deleteWorkout = async (id) => {
    try {
      await api.delete(`/workouts/${id}`);
      setWorkouts(prev => prev.filter(workout => workout._id !== id));
      fetchStats();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Failed to delete workout' };
    }
  };

  useEffect(() => {
    fetchWorkouts();
    fetchStats();
  }, []);

  return { workouts, loading, stats, fetchWorkouts, addWorkout, updateWorkout, deleteWorkout };
};
