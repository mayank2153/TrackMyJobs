import React, { useState } from 'react';
import axios from 'axios';

// TypeScript fix to recognize the chrome object
declare const chrome: any;

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    try {
      if (!email || !password) {
        setErrorMessage('Email and password are required.');
        return;
      }

      // Making the POST request with the user's email and password
      const response = await axios.post(
        'http://localhost:4000/api/users/login',
        {
          email,
          password,
        },
        { withCredentials: true } // Important to allow credentials (cookies) to be included
      );

      const { user } = response.data; // Get user data from response
      console.log('Login successful:', response.data);

      // Send the userId to Chrome extension's local storage
      loginSuccess(user._id);

    } catch (error) {
      console.error('Error logging in', error);
      setErrorMessage('Failed to log in. Please try again.');
    }
  };

  const loginSuccess = (userId: string) => {
    chrome.storage.local.set({ userId }, function () {
      console.log('User ID saved to extension storage.');
      window.location.href = '/dashboard';
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800">Login</h2>
        {errorMessage && (
          <p className="text-sm text-center text-red-500">{errorMessage}</p>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Login
          </button>
        </form>
        <p className="text-sm text-center text-gray-600">
          Don't have an account? <a href="#" className="text-indigo-600 hover:underline">Sign up</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
