import React from 'react';
import './constants/colors.css';
import NavBar from './components/NavBar';
import MainLayout from './components/MainLayout';
import { AuthProvider } from './services/AuthContext';

function App() {
  try {
    return (
      <AuthProvider>
        <div className="app-shell">
          <NavBar />
          <MainLayout />
        </div>
      </AuthProvider>

    );
  } catch (error) {
    console.error("App crashed:", error);
    return <div>Error rendering app.</div>;
  }  
}

export default App;
