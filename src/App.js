import React from 'react';
import logo from './logo.svg';
import './App.css';
import MainPage from './MainPage'; // Importing MainPage component

function App() {
  return (
    <div className="App">
      <header className="App-header">
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
        <MainPage /> {/* Rendering MainPage component */}
      </header>
    </div>
  );
}

export default App;
