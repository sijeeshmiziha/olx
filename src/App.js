import React, { useContext } from 'react';
import './App.css';
import ContextAuth, { AuthContext } from './contextStore/AuthContext';
import AppProviders from './contextStore/AppProviders';
import MainRoutes from './Routes/MainRoutes';
import BarLoading from './Components/Loading/BarLoading';

function AppContent() {
  const { authLoading } = useContext(AuthContext);
  if (authLoading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <BarLoading />
      </div>
    );
  }
  return (
    <AppProviders>
      <MainRoutes />
    </AppProviders>
  );
}

function App() {
  return (
    <ContextAuth>
      <AppContent />
    </ContextAuth>
  );
}

export default App;
