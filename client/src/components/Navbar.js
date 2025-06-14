import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = ({ user, logout, toggleTheme, theme }) => {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h2>🏋️‍♂️ FitTracker Pro</h2>
      </div>
      
      <ul className="nav-links">
        <li>
          <Link 
            to="/" 
            className={location.pathname === '/' ? 'active' : ''}
          >
            📊 Dashboard
          </Link>
        </li>
        <li>
          <Link 
            to="/workouts" 
            className={location.pathname === '/workouts' ? 'active' : ''}
          >
            💪 Workouts
          </Link>
        </li>
        <li>
          <Link 
            to="/profile" 
            className={location.pathname === '/profile' ? 'active' : ''}
          >
            👤 Profile
          </Link>
        </li>
      </ul>
      
      <div className="navbar-actions">
        <div className="user-welcome">
          <span>👋 {user.name}</span>
        </div>
        <button 
          onClick={toggleTheme} 
          className="theme-toggle"
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
        <button 
          onClick={logout} 
          className="btn btn-danger"
        >
          🚪 Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
