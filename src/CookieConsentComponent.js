import React from 'react';
import CookieConsent from 'react-cookie-consent';

const CookieConsentComponent = ({ onAccept }) => {
  return (
    <CookieConsent onAccept={onAccept}>
      🍪 This website uses cookies to ensure you get the best experience on the website.
      {/* <span style={{ fontSize: "10px" }}>This bit of text is smaller :O</span> */}
    </CookieConsent>
  );
};

export default CookieConsentComponent;
