import React, { useEffect, useState } from 'react';
import MainLayout from './components/MainLayout';
import LandingPage from './components/LandingPage';
import { AuthProvider, useAuth } from './services/AuthContext';
import './constants/colors.css';

/* --- wrapper so we can access context --- */
const AppShell = () => {
  const { accessToken } = useAuth();
  const [gapiReady, setGapiReady] = useState(false);

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
  }, []);

  if (!gapiReady) return <div>Loading Google APIs…</div>;

  return accessToken ? (
    <>
      <MainLayout accessToken={accessToken} />
    </>
  ) : (
    <LandingPage />
  );
};

const App = () => (
  <AuthProvider>
    <AppShell />
  </AuthProvider>
);

export default App;
