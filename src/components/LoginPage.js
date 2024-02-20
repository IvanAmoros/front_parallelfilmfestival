import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import './LoginPage.css';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // New state for toggling password visibility
  const [loginError, setLoginError] = useState('');
  const navigate = useNavigate();
  const { isLoggedIn, login } = useAuth();

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/');
    }
  }, [isLoggedIn, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(username, password, () => navigate('/'));
    } catch (error) {
      console.error('Login error:', error);
      setLoginError('Failed to login. Please try again.');
    }
  };

  // Toggle the visibility of the password
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="LoginPage">
      <img src="/images/this-is-my-house.gif" alt="Log In" />
      {loginError && <p>{loginError}</p>}
      <form onSubmit={handleLogin}>
        <div>
          <input
            type="text"
            id="username"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="passwordContainer">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="button" onClick={togglePasswordVisibility} className="togglePassword">
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>
        <button type="submit">Log In</button>
      </form>
    </div>
  );
}

export default LoginPage;
