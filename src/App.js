import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './MainPage';
import CookieConsentComponent from './components/CookieConsentComponent';
import FilmFestival from './components/FilmFestival';
import ForgotPasswordPage from './ForgotPasswordPage';
import PasswordResetConfirmPage from './PasswordResetConfirmPage';
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
              <Route path="/main" element={
                <>
                  <MainPage />
                  <CookieConsentComponent />
                </>
              } />
              <Route path="/" element={<FilmFestival />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-confirm/:uid/:token" element={<PasswordResetConfirmPage />} />
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
