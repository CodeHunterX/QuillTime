import React from 'react';
import { useAuth } from '../services/AuthContext';
import { Link } from 'react-router-dom';
import './NavBar.css';

const NavBar = ({ onPrivacyClick }) => {
  const { user, login, logout } = useAuth(); // ✅ valid now

  return (
    <nav className="nav-bar">
      <Link to="/" className="brand">
      <img src="/QuillTime_Logo.png" alt="QuillTime" className="nav-logo" />
      <span>QuillTime</span>
      </Link>
      <div className="auth-section">
        {user ? (
          <>
            {user.photoURL ? (
              <img src={user.photoURL} alt={user.name} className="avatar" />
            ) : (
              <span>{user.name}</span>
            )}
            <button className="auth-btn" onClick={logout}>Logout</button>
          </>
        ) : (
          <button className="auth-btn" onClick={login}>Login</button>
        )}
        <Link to="/privacy" className="auth-btn secondary">Privacy Policy</Link>
      </div>
    </nav>
  );
};

export default NavBar;
