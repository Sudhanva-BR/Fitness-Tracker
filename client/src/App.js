import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import WorkoutsPage from './pages/WorkoutsPage';
import ProfilePage from './pages/ProfilePage';
import { Login, Register } from './components/Auth';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    document.body.className = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleLogin = (userData) => {
    console.log('Login successful, setting user:', userData);
    setUser(userData);
    // Force navigation to home page
    window.location.href = '/';
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/login';
  };

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        Loading...
      </div>
    );
  }

  return (
    <Router>
      <div className={`app ${theme}`}>
        {user && <Navbar user={user} logout={logout} toggleTheme={toggleTheme} theme={theme} />}
        
        <Routes>
          <Route 
            path="/login" 
            element={!user ? <Login onLogin={handleLogin} /> : <Navigate to="/" replace />} 
          />
          <Route 
            path="/register" 
            element={!user ? <Register onLogin={handleLogin} /> : <Navigate to="/" replace />} 
          />
          <Route 
            path="/" 
            element={user ? <Home user={user} /> : <Navigate to="/login" replace />} 
          />
          <Route 
            path="/workouts" 
            element={user ? <WorkoutsPage /> : <Navigate to="/login" replace />} 
          />
          <Route 
            path="/profile" 
            element={user ? <ProfilePage user={user} /> : <Navigate to="/login" replace />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
