import React from 'react';
import { useAuth } from '../services/AuthContext';
import './NavBar.css';

const NavBar = () => {
  const { user, login, logout } = useAuth();

  return (
    <nav className="nav-bar">
      <div className="logo">📝 QuillTime</div>

      <div className="auth-section">
        {user ? (
          <>
            {user.photoURL && (
              <img
                src={user.photoURL}
                alt={user.name}
                className="avatar"
              />
            )}
            <button className="auth-button" onClick={logout}>Logout</button>
          </>
        ) : (
          <button className="auth-button" onClick={login}>Login</button>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
