import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null); // State to hold user details

  useEffect(() => {
    const initializeAuth = async () => {
      const accessToken = localStorage.getItem('accessToken');
      if (accessToken) {
        try {
          const response = await fetch('http://localhost:8000/base/api/validate_token/', {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            setIsLoggedIn(true);
            setUser({ username: data.username }); // Adjust based on actual user details you expect
          } else {
            console.log('Token validation failed');
            localStorage.removeItem('accessToken'); // Clear the invalid token
          }
        } catch (error) {
          console.error('Error validating token:', error);
        }
      }
    };

    initializeAuth();
  }, []);

  const login = async (username, password) => {
    try {
      const response = await fetch('http://localhost:8000/base/api/token/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('accessToken', data.access);
        localStorage.setItem('refreshToken', data.refresh);
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
    setIsLoggedIn(false);
    setUser(null);
  };

  // Provide the isLoggedIn, user, login, and logout in the context value
  // This makes them available to any component in your app that uses the useAuth hook
  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
