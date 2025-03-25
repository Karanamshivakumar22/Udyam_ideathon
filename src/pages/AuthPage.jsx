import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase } from 'lucide-react';
import axios from 'axios';
import { useTheme } from '../contexts/ThemeContext';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { darkMode } = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Reset error on new submission

    try {
      let response;

      if (isLogin) {
        // Login API call
        response = await axios.post('/api/login', {
          email,
          password,
        });
      } else {
        // Signup API call
        response = await axios.post('/api/register', {
          username,
          email,
          password,
        });
      }

      // Success: Save token and navigate
      localStorage.setItem('token', response.data.access);
      navigate('/dashboard');
    } catch (error) {
      // Handle errors based on the API response
      if (error.response) {
        const { status, data } = error.response;

        if (status === 401) {
          setError('Invalid email or password.');
        } else if (status === 409) {
          setError('Email already in use.');
        } else {
          setError(data.message || 'Authentication failed. Please try again.');
        }
      } else {
        setError('Network error. Please try again later.');
      }
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center ${
        darkMode ? 'dark:bg-gray-900 dark:text-white' : 'bg-gray-50'
      }`}
    >
      <div className="max-w-md w-full space-y-8 p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        {/* Header */}
        <div className="text-center">
          <Briefcase className="mx-auto h-12 w-12 text-blue-600" />
          <h2 className="mt-6 text-3xl font-bold">
            {isLogin ? 'Sign in to Skilling for Entrepreneurship' : 'Join Skilling for Entrepreneurship'}
          </h2>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded-lg text-center">
            {error}
          </div>
        )}

        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* Username Field (only on signup) */}
          {!isLogin && (
            <div>
              <label htmlFor="username" className="sr-only">
                Username
              </label>
              <input
                name="username"
                type="text"
                required
                className="appearance-none rounded-lg block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 placeholder-gray-500 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          )}

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="sr-only">
              Email address
            </label>
            <input
              name="email"
              type="email"
              required
              className="appearance-none rounded-lg block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 placeholder-gray-500 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <input
              name="password"
              type="password"
              required
              className="appearance-none rounded-lg block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 placeholder-gray-500 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {isLogin ? 'Sign in' : 'Sign up'}
            </button>
          </div>
        </form>

        {/* Toggle Link */}
        <div className="text-center">
          <button
            className="text-blue-600 hover:text-blue-500"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin
              ? 'Need an account? Sign up'
              : 'Already have an account? Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
}
