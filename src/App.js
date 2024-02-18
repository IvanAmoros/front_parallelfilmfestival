import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainPage from './MainPage';
// import LoginPage from './LoginPage';
import CookieConsentComponent from './components/CookieConsentComponent';
import { AuthProvider } from './AuthContext';


function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <header className="App-header">
            {/* Header content if any */}
          </header>
          <main>
            <Routes>
              <Route path="/" element={
                <>
                  <MainPage />
                  <CookieConsentComponent />
                </>
              } />
              {/* <Route path="/login" element={<LoginPage />} /> */}
            </Routes>
          </main>
          {/* Footer or other components */}
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
