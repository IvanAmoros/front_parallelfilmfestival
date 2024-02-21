import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainPage from './MainPage';
import SkillsDisplay from './components/api/SkillsDisplay';
import LoginPage from './components/LoginPage';
import CookieConsentComponent from './components/CookieConsentComponent';
import { AuthProvider } from './AuthContext';
import Navbar from './components/Navbar';


function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <header className="App-header">
            <Navbar />
          </header>
          <main>
            <Routes>
              <Route path="/" element={
                <>
                  <MainPage />
                  <SkillsDisplay />
                  <CookieConsentComponent />
                </>
              } />
              <Route path="/login" element={<LoginPage />} />
            </Routes>
          </main>
          {/* Footer or other components */}
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
