import React from 'react';
import { useAuth } from '../services/AuthContext';  // ← consume context
import './NavBar.css';                               // optional styling

const NavBar = () => {
  const { user, login, logout } = useAuth();         // <- get state & actions

  return (
    <nav className="nav-bar">
      <div className="brand">
      <img
        src="/QuillTime_Logo.png"
        alt="QuillTime Logo"
        className="nav-logo"
      /><span>QuillTime</span>
      </div>

      {/* auth section, right‑aligned */}
      <div className="auth-section">
        {user ? (
          <>
            {user.photoURL ? (
              <img src={user.photoURL} alt={user.name}
                   className="avatar" />
            ) : (
              <span>{user.name}</span>
            )}
            <button className="auth-btn" onClick={logout}>Logout</button>
          </>
        ) : (
          <button className="auth-btn" onClick={login}>Sign in with Google</button>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
