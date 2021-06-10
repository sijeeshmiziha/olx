import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import ErrorBoundary from './Components/ErrorBoundary/ErrorBoundary';
import { initAnalytics } from './firebase/analytics';
import { initAppCheck } from './firebase/appCheck';
import { initPerformance } from './firebase/performance';
import { fetchRemoteConfig } from './firebase/remoteConfig';
import { silentCatch } from './utils/errorHandler';

// Suppress Firestore internal permission errors that bypass onSnapshot handlers
// (caused by the SDK's enqueueAndForget in persistent_stream when rules reject a listener)
window.addEventListener('unhandledrejection', (event) => {
  const err = event.reason;
  if (err && err.code === 'permission-denied') {
    console.warn('Firestore permission-denied (suppressed):', err.message);
    event.preventDefault();
  }
});

// Initialize Firebase services (Analytics, Performance, Remote Config, App Check)
initAnalytics();
initPerformance();
initAppCheck();
fetchRemoteConfig().catch(silentCatch('index:fetchRemoteConfig'));

ReactDOM.render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>,
  document.getElementById('root')
);
