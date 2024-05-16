import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from './utils/api'; // Import the custom Axios instance

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken'));
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refreshToken'));
  const apiUrl = process.env.REACT_APP_API_URL;

  const refreshAccessToken = useCallback(async () => {
    try {
      const response = await api.post(`${apiUrl}/base/api/token/refresh/`, { refresh: refreshToken });

      if (response.status === 200) {
        const data = response.data;
        localStorage.setItem('accessToken', data.access);
        setAccessToken(data.access);
        return data.access;
      } else {
        console.error('Token refresh failed.');
        logout();
      }
    } catch (error) {
      console.error('Error refreshing token:', error);
      logout();
    }
  }, [refreshToken, apiUrl]);

  useEffect(() => {
    const initializeAuth = async () => {
      if (accessToken) {
        const validateToken = async (token) => {
          try {
            const response = await api.get(`${apiUrl}/base/api/validate_token/`, {
              headers: {
                'Authorization': `Bearer ${token}`,
              },
            });
            return response.status === 200 ? response.data : null;
          } catch (error) {
            return null;
          }
        };

        let data = await validateToken(accessToken);

        if (!data && refreshToken) {
          const newAccessToken = await refreshAccessToken();
          if (newAccessToken) {
            data = await validateToken(newAccessToken);
          }
        }

        if (data) {
          setIsLoggedIn(true);
          setUser({ username: data.user.username, email: data.user.email, is_superuser: data.user.is_superuser });
        } else {
          console.log('Token validation failed');
          logout();
        }
      }
    };

    initializeAuth();
  }, [accessToken, refreshToken, apiUrl, refreshAccessToken]);

  const login = async (username, password) => {
    try {
      const response = await api.post(`${apiUrl}/base/api/token/`, { username, password });

      if (response.status === 200) {
        const data = response.data;
        localStorage.setItem('accessToken', data.access);
        localStorage.setItem('refreshToken', data.refresh);
        localStorage.setItem('username', data.username);
        localStorage.setItem('email', data.email);
        localStorage.setItem('is_superuser', data.is_superuser);
        setAccessToken(data.access);
        setRefreshToken(data.refresh);
        setIsLoggedIn(true);
        setUser({ username: data.username });
      } else {
        console.error('Login failed.');
      }
    } catch (error) {
      console.error('Login error:', error);
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
    setRefreshToken(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout, accessToken, refreshAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
};
