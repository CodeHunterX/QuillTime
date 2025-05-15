import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null);
  const [gisReady, setGisReady] = useState(false);

  /* ▸ Load Google Identity Services script ONCE */
  useEffect(() => {
    if (window.google?.accounts) {
      setGisReady(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => setGisReady(true);
    document.body.appendChild(script);
  }, []);

  /* ▸ Login handler */
  const login = () => {
    if (!gisReady) {
      console.error('GIS not ready yet');
      return;
    }

    const tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
      scope: 'https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/documents https://www.googleapis.com/auth/drive.metadata.readonly openid email profile',
      callback: async (resp) => {
        if (resp.error) {
          console.error('[Auth] Token error', resp);
          return;
        }

        setAccessToken(resp.access_token);

        // optional: fetch profile for avatar/name
        const infoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${resp.access_token}` },
        });
        const profile = await infoRes.json();
        setUser({
          name: profile.name,
          photoURL: profile.picture,
          email: profile.email,
        });
      },
    });

    tokenClient.requestAccessToken({ prompt: 'consent' });
  };

  /* ▸ Logout handler */
  const logout = () => {
    if (accessToken) {
      window.google.accounts.oauth2.revoke(accessToken);
    }
    setAccessToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, accessToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
