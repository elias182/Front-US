// AuthContext.js
import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      fetchUserProfile(token);
    }
  }, []);

  const fetchUserProfile = async (token) => {
    try {
      const response = await fetch('http://backend-us-production-8ae2.up.railway.app/api/user-profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (response.ok) {
        setUserProfile(data);
        setIsAuthenticated(true);
      } else {
        console.error('Failed to fetch user profile:', data);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const login = (token) => {
    localStorage.setItem('accessToken', token);
    setIsAuthenticated(true);
    fetchUserProfile(token);
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    setIsAuthenticated(false);
    setUserProfile(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userProfile, setUserProfile, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
