import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const initializeAuth = async () => {
      const accessToken = localStorage.getItem('accessToken');
      if (accessToken) {
        try {
          const apiUrl = process.env.REACT_APP_API_URL;
          const response = await axios.get(`${apiUrl}/base/api/validate_token/`, {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
            },
          });
          setIsLoggedIn(true);
          setUser({ username: response.data.username, is_superuser: response.data.is_superuser });
        } catch (error) {
          console.error('Error validating token:', error);
          localStorage.removeItem('accessToken');
        }
      }
    };

    initializeAuth();
  }, []);

  const login = async (username, password) => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL;
      const response = await axios.post(`${apiUrl}/base/api/token/`, {
        username,
        password,
      });
      localStorage.setItem('accessToken', response.data.access);
      localStorage.setItem('refreshToken', response.data.refresh);
      setIsLoggedIn(true);
      setUser({ username: response.data.username, is_superuser: response.data.is_superuser });
    } catch (error) {
      console.error('Login error:', error.response ? error.response.data : error.message);
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setIsLoggedIn(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
