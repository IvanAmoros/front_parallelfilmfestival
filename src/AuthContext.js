import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken'));
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const initializeAuth = async () => {
      if (accessToken) {
        try {
          const response = await axios.get(`${apiUrl}/base/api/validate_token/`, {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
            },
          });

          if (response.status === 200) {
            const data = response.data;
            setIsLoggedIn(true);
            setUser({ username: data.user.username, email: data.user.email, is_superuser: data.user.is_superuser });
          } else {
            console.log('Token validation failed');
            localStorage.removeItem('accessToken');
            setAccessToken(null);
          }
        } catch (error) {
          console.error('Error validating token:', error);
        }
      }
    };

    initializeAuth();
  }, [accessToken, apiUrl]);

  const login = async (username, password) => {
    try {
      const response = await axios.post(`${apiUrl}/base/api/token/`, { username, password });

      if (response.status === 200) {
        const data = response.data;
        localStorage.setItem('accessToken', data.access);
        localStorage.setItem('refreshToken', data.refresh);
        localStorage.setItem('username', data.username);
        localStorage.setItem('email', data.email);
        localStorage.setItem('is_superuser', data.is_superuser);
        setAccessToken(data.access);
        setIsLoggedIn(true);
        setUser({ username: data.username });
      } else {
        console.error('Login failed.');
        // Handle login failure, e.g., by setting an error state here
      }
    } catch (error) {
      console.error('Login error:', error);
      // Handle error, e.g., by setting an error state here
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('username');
    localStorage.removeItem('email');
    localStorage.removeItem('is_superuser');
    setIsLoggedIn(false);
    setUser(null);
    setAccessToken(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
