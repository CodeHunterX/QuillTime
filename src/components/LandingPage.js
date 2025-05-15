import React from 'react';
import { useAuth } from '../services/AuthContext';
import './LandingPage.css';          // styles just for the splash

// ⬇︎ Google icon as an inline SVG so we don’t load extra assets
const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 533.5 544.3">
    <path fill="#4285f4" d="M533.5 278.4c0-18.3-1.7-36-5-53.2H272v100.7h147.2c-6.3 34.1-24.9 63-52.8 82.2v68h85.4c50-46.1 78.7-114 78.7-197.7z"/>
    <path fill="#34a853" d="M272 544.3c71.3 0 131.2-23.6 174.9-64.2l-85.4-68c-23.7 16-54.1 25.4-89.6 25.4-68.9 0-127.3-46.5-148.2-109.1h-88.5v68.6C82.3 491.1 171.1 544.3 272 544.3z"/>
    <path fill="#fbbc04" d="M123.8 328.4c-10.5-31.3-10.5-65.3 0-96.6v-68.6h-88.5c-34.3 68.6-34.3 150.5 0 219.1l88.5-53.9z"/>
    <path fill="#ea4335" d="M272 107.7c37.4 0 71 12.9 97.5 38.3l73-73c-49-45.7-112.3-72.4-170.5-72.4-100.9 0-189.7 53.2-236.9 138.4l88.5 68.6C144.7 154.2 203.1 107.7 272 107.7z"/>
  </svg>
);
const LandingPage = () => {
  const { login } = useAuth();
  return (
    <div className="landing-wrapper">
      <div className="glass-card">
      <img
  src="/QuillTime_transparent.png"
  alt="QuillTime Logo"
  className="logo-image"
/>

        <p className="tagline">A focused place to craft your best words.</p>

        <button className="google-btn" onClick={login}>
          <GoogleIcon />
          <span>Sign in with Google</span>
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
