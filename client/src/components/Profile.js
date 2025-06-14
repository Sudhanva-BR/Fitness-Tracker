import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const Profile = ({ user }) => {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    age: user?.age || '',
    profileImage: user?.profileImage || '',
    theme: user?.theme || 'light'
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        age: user.age || '',
        profileImage: user.profileImage || '',
        theme: user.theme || 'light'
      });
    }
  }, [user]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await api.put('/auth/profile', formData);
      setMessage('Profile updated successfully!');
      
      // Update localStorage
      const updatedUser = { ...user, ...formData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (error) {
      setMessage('Error updating profile: ' + (error.response?.data?.message || 'Unknown error'));
    }
    setLoading(false);
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>My Profile</h1>
        {formData.profileImage && (
          <img src={formData.profileImage} alt="Profile" className="profile-image" />
        )}
      </div>

      <form className="profile-form" onSubmit={handleSubmit}>
        {message && (
          <div className={`alert ${message.includes('Error') ? 'alert-error' : 'alert-success'}`}>
            {message}
          </div>
        )}

        <div className="form-group">
          <label>Name</label>
          <input type="text" name="name" className="form-control" value={formData.name} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Age</label>
          <input type="number" name="age" className="form-control" value={formData.age} onChange={handleChange} min="1" max="120" />
        </div>

        <div className="form-group">
          <label>Profile Image URL</label>
          <input type="url" name="profileImage" className="form-control" value={formData.profileImage} onChange={handleChange} placeholder="https://example.com/image.jpg" />
        </div>

        <div className="form-group">
          <label>Theme Preference</label>
          <select name="theme" className="form-control" value={formData.theme} onChange={handleChange}>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Updating...' : 'Update Profile'}
        </button>
      </form>
    </div>
  );
};

export default Profile;
