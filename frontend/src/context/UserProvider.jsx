import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { Cookie } from 'lucide-react';

const UserContext = createContext({
  user: null,
  loading: false,
  error: null,
  login: async () => { },
  logout: () => { },
  setUser: () => { },
  fetchUserProfile: async () => { }
});

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUserProfile = async () => {
    setLoading(true);
    setError(null);

    const token = sessionStorage.getItem('userToken');

    // If no token, redirect to login
    if (!token) {
      setLoading(false);
      setError('No authentication token found');
      return null;
    }

    try {
      const response = await axios.get('/api/users/profile');
      console.log('User Profile Response:', response.data);
      const userData = response.data;
      setUser(userData);
      sessionStorage.setItem('userInfo', JSON.stringify(userData));
      setLoading(false);
      return userData;
    } catch (err) {
      console.error('Profile Fetch Error:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });

      // Handle specific error scenarios
      if (err.response?.status === 401) {
        // Token might be expired or invalid
        logout();
        window.location.href = '/login';
      }

      setError(err.response?.data?.message || 'Failed to fetch profile');
      setLoading(false);
      throw err;
    }


  };

  const login = async (userData) => {
    try {

      if (userData.token) {
        sessionStorage.setItem('userToken', userData.token);
        // Set default authorization header for axios
        axios.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;
      }

      setUser(userData);
      sessionStorage.setItem('userInfo', JSON.stringify(userData));

      if (userData.token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;
      }

      return userData;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    sessionStorage.clear();
    localStorage.clear();
    delete axios.defaults.headers.common['Authorization'];
    axios.post('/api/auth/logout');
  };

  useEffect(() => {
    const userInfo = sessionStorage.getItem('userInfo');
    const userToken = sessionStorage.getItem('userToken');
    if (userInfo && userToken) {
      try {
        const parsedUserInfo = JSON.parse(userInfo);
        setUser(parsedUserInfo);

        axios.defaults.headers.common['Authorization'] = `Bearer ${userToken}`;

      } catch (error) {
        console.error('Error parsing user info:', error);
      }
    }
  }, []);

  const contextValue = {
    user,
    loading,
    error,
    login,
    logout,
    setUser,
    fetchUserProfile
  };

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
};

const useUser = () => {
  const context = useContext(UserContext);

  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }

  return context;
};

// eslint-disable-next-line react-refresh/only-export-components
export default useUser;
