import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('Attempting login with:', formData.email);
      
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log('Login response:', data);

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Call the onLogin callback
        onLogin(data.user);
        
        // Force navigation to home page
        navigate('/', { replace: true });
        
        // Backup navigation method
        setTimeout(() => {
          window.location.href = '/';
        }, 100);
        
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Network error: ' + error.message);
    }
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Login to Fitness Tracker</h2>
        {error && <div className="alert alert-error">{error}</div>}
        <div className="form-group">
          <label>Email</label>
          <input 
            type="email" 
            name="email" 
            className="form-control" 
            value={formData.email} 
            onChange={handleChange} 
            required 
            autoComplete="email"
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input 
            type="password" 
            name="password" 
            className="form-control" 
            value={formData.password} 
            onChange={handleChange} 
            required 
            autoComplete="current-password"
          />
        </div>
        <button 
          type="submit" 
          className="btn btn-primary" 
          style={{ width: '100%' }} 
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
        <p style={{ textAlign: 'center', marginTop: '1rem' }}>
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </form>
    </div>
  );
};

export const Register = ({ onLogin }) => {
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    confirmPassword: '' 
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      console.log('Attempting registration with:', formData.email);
      
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
        }),
      });

      const data = await response.json();
      console.log('Register response:', data);

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Call the onLogin callback
        onLogin(data.user);
        
        // Force navigation to home page
        navigate('/', { replace: true });
        
        // Backup navigation method
        setTimeout(() => {
          window.location.href = '/';
        }, 100);
        
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError('Network error: ' + error.message);
    }
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Create Account</h2>
        {error && <div className="alert alert-error">{error}</div>}
        <div className="form-group">
          <label>Name</label>
          <input 
            type="text" 
            name="name" 
            className="form-control" 
            value={formData.name} 
            onChange={handleChange} 
            required 
            autoComplete="name"
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input 
            type="email" 
            name="email" 
            className="form-control" 
            value={formData.email} 
            onChange={handleChange} 
            required 
            autoComplete="email"
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input 
            type="password" 
            name="password" 
            className="form-control" 
            value={formData.password} 
            onChange={handleChange} 
            required 
            autoComplete="new-password"
          />
        </div>
        <div className="form-group">
          <label>Confirm Password</label>
          <input 
            type="password" 
            name="confirmPassword" 
            className="form-control" 
            value={formData.confirmPassword} 
            onChange={handleChange} 
            required 
            autoComplete="new-password"
          />
        </div>
        <button 
          type="submit" 
          className="btn btn-primary" 
          style={{ width: '100%' }} 
          disabled={loading}
        >
          {loading ? 'Creating Account...' : 'Register'}
        </button>
        <p style={{ textAlign: 'center', marginTop: '1rem' }}>
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </form>
    </div>
  );
};
