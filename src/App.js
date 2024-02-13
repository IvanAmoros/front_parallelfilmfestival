import React, { useState } from 'react';
import './App.css';
import MainPage from './MainPage';
import CookieConsentComponent from './CookieConsentComponent'; // Make sure the import path is correct

function App() {
  const [analyticsInitialized, setAnalyticsInitialized] = useState(false);

  const initializeAnalytics = () => {
    if (!analyticsInitialized) {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        'gtm.start': new Date().getTime(),
        event: 'gtm.js'
      });
      window.gtag = function() { window.dataLayer.push(arguments); };
      window.gtag('js', new Date());
      window.gtag('config', 'G-NF487Q1T0Z');
      setAnalyticsInitialized(true);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <MainPage />
        <CookieConsentComponent onAccept={initializeAnalytics} />
      </header>
    </div>
  );
}

export default App;
