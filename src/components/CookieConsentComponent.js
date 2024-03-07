import React from 'react';
import CookieConsent from 'react-cookie-consent';

const GA_CODE = process.env.GA_CODE;

const CookieConsentComponent = () => {
  const initializeAnalytics = () => {
    if (!window.analyticsInitialized) {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        'gtm.start': new Date().getTime(),
        event: 'gtm.js'
      });
      window.gtag = function() { window.dataLayer.push(arguments); };
      window.gtag('js', new Date());
      window.gtag('config', `${GA_CODE}`);

      window.analyticsInitialized = true; // Set a flag to avoid re-initialization
    }
  };

  return (
    <CookieConsent onAccept={initializeAnalytics}>
      🍪 This website uses cookies to ensure you get the best experience on our website.
    </CookieConsent>
  );
};

export default CookieConsentComponent;
