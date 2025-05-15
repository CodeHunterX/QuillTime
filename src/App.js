import React, { useEffect, useState } from 'react';
import MainLayout from './components/MainLayout';
import LandingPage from './components/LandingPage';
import PrivacyPolicy from './pages/PrivacyPolicy';
import { AuthProvider, useAuth } from './services/AuthContext';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import './constants/colors.css';

/* --- wrapper so we can access context --- */
const AppShell = () => {
  const { accessToken } = useAuth();
  const [gapiReady, setGapiReady] = useState(false);
  const [page, setPage] = useState('main');

  /* load gapi + picker once */
  useEffect(() => {
    const load = () => {
      window.gapi.load('client:picker', async () => {
        await window.gapi.client.init({
          apiKey: process.env.REACT_APP_GOOGLE_API_KEY,
          discoveryDocs: [
            'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest',
            'https://docs.googleapis.com/$discovery/rest?version=v1',
          ],
        });
        setGapiReady(true);
      });
    };
    const s = document.createElement('script');
    s.src = 'https://apis.google.com/js/api.js';
    s.onload = load;
    document.body.appendChild(s);

    if (window.location.hash === '#/privacy') {
      setPage('privacy');
    }
  }, []);

  const goToMain = () => setPage('main');
  const goToPrivacy = () => setPage('privacy');

  if (!gapiReady) return <div>Loading Google APIs…</div>;

  return page === 'privacy' ? (
    <PrivacyPolicy onBack={goToMain} />
  ) : accessToken ? (
    <MainLayout accessToken={accessToken} onPrivacyClick={goToPrivacy} />
  ) : (
    <LandingPage onPrivacyClick={goToPrivacy} />
  );
};

const App = () => (
  <AuthProvider>
    <Router>
      <Routes>
        <Route path="/" element={<AppShell />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
      </Routes>
    </Router>
  </AuthProvider>

);

export default App;
