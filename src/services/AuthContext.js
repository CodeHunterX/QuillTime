import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [gisReady, setGisReady] = useState(false);

  // Load GIS script on first mount
  useEffect(() => {
    if (window.google?.accounts) {
      setGisReady(true);
    } else {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => setGisReady(true);
      document.body.appendChild(script);
    }

    // Try restoring session from localStorage
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('accessToken');
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setAccessToken(storedToken);
    }
  }, []);

  const login = () => {
    if (!gisReady || !window.google?.accounts?.oauth2) {
      console.error('Google Identity Services not ready.');
      return;
    }

    const tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
      scope: 'openid email profile https://www.googleapis.com/auth/drive.metadata.readonly',
      callback: (response) => {
        if (response.error) {
          console.error('Login failed', response);
          return;
        }

        const token = response.access_token;
        setAccessToken(token);
        localStorage.setItem('accessToken', token);

        // Fetch user profile
        fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then((res) => res.json())
          .then((data) => {
            const userInfo = {
              name: data.name,
              email: data.email,
              photoURL: data.picture,
            };
            setUser(userInfo);
            localStorage.setItem('user', JSON.stringify(userInfo));
          })
          .catch((err) => {
            console.error('Failed to fetch user info', err);
          });
      },
    });

    tokenClient.requestAccessToken({ prompt: 'consent' });
  };

  const logout = () => {
    setUser(null);
    setAccessToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
  };

  return (
    <AuthContext.Provider value={{ user, accessToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
