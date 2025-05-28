import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useUser from '../context/UserProvider';

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useUser();

  const handleChange = (e) => {
    if (!e || !e.target) {
      console.error('Event or event.target is undefined in handleChange');
      return;
    }
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await axios.post('/api/auth/login', formData, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });
      // Destructure user data from response
      const { token, user } = response.data;

      // Combine token with user data
      const userData = {
        ...user,
        token: token
      };

      // Check for blocked status
      if (userData.status === 'Blocked') {
        setError('Your account has been blocked. Please contact the administrator.');
        setLoading(false);
        return;
      }

      // Use context login method
      await login(userData);

      if (response.data) {
        // Store user info in sessionStorage
        const userData = {
          ...response.data.user,
          role: response.data.user.role.trim()
        };

        sessionStorage.setItem('userInfo', JSON.stringify(userData));
        sessionStorage.setItem('userToken', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        axios.defaults.withCredentials = true;

        if (userData.role === 'Admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      }
    } catch (error) {
      console.error('Login error:', error);

      // Check for blocked status in error response
      if (error.response?.data?.blocked) {
        setError(error.response.data.message || 'Your account has been blocked. Please contact the administrator.');
      } else {
        setError(error.response?.data?.message || 'Login failed. Please check your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-bl from-gray-100 via-slate-400 to-slate-600 px-4">
      <div className="w-full max-w-md p-8 bg-white backdrop-blur-lg rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

        {/* Enhanced Error Display for Blocked Status */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded relative mb-4">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <form className="space-y-4" onSubmit={handleLogin}>
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="text-center text-sm mt-4">
          Don't have an account?{' '}
          <span
            className="text-blue-600 cursor-pointer hover:underline"
            onClick={() => navigate('/register')}
          >
            Register here
          </span>
        </p>
      </div>
    </div>
  );
}
