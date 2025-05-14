import React, { useEffect, useState } from 'react';
import MainLayout from './components/MainLayout';
import { AuthProvider } from './services/AuthContext';
import './constants/colors.css';

const App = () => {
  const [accessToken, setAccessToken] = useState(null);
  const [gapiReady, setGapiReady] = useState(false);

  useEffect(() => {
    const loadGoogleApis = () => {
      window.gapi.load('client:picker', async () => {
        try {
          await window.gapi.client.init({
            apiKey: process.env.REACT_APP_GOOGLE_API_KEY,
            discoveryDocs: [
              'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest',
              'https://docs.googleapis.com/$discovery/rest?version=v1',
            ],
          });
          console.log('[App] GAPI client initialized');
          setGapiReady(true);
        } catch (err) {
          console.error('[App] GAPI client init error:', err);
        }
      });
    };

    const script1 = document.createElement('script');
    script1.src = 'https://apis.google.com/js/api.js';
    script1.onload = loadGoogleApis;
    document.body.appendChild(script1);

    const script2 = document.createElement('script');
    script2.src = 'https://accounts.google.com/gsi/client';
    script2.async = true;
    script2.defer = true;
    script2.onload = () => {
      console.log('[App] GIS loaded');
    };
    document.body.appendChild(script2);
  }, []);

  const handleLogin = () => {
    const tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
      scope: 'https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/documents',
      callback: (response) => {
        if (response.error) {
          console.error('[App] Token error:', response);
        } else {
          console.log('[App] Token received');
          setAccessToken(response.access_token);
        }
      },
    });

    tokenClient.requestAccessToken({ prompt: 'consent' });
  };

  if (!gapiReady || !window.google?.accounts) {
    return <div>Loading Google APIs...</div>;
  }

  if (!accessToken) {
    return (
      <div style={{ padding: '2rem' }}>
        <h2>QuillTime</h2>
        <button onClick={handleLogin}>Sign in with Google</button>
      </div>
    );
  }

  return (
    <AuthProvider>
      <MainLayout accessToken={accessToken} />
    </AuthProvider>
  );
};

export default App;
