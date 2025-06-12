import React, { useState, useEffect } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import Dashboard from './pages/dashboard/Dashboard';
import { todoApi } from './api/todoApi';
import './styles/main.css';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Auth Route Component (redirects to dashboard if already logged in)
const AuthRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    todoApi.logout();
    setUser(null);
  };

  const router = createBrowserRouter([
    {
      path: '/',
      element: <Navigate to="/dashboard" replace />
    },
    {
      path: '/',
      element: <AuthRoute><AuthLayout /></AuthRoute>,
      children: [
        { path: 'login', element: <Login onLogin={setUser} /> },
        { path: 'signup', element: <Signup onSignup={setUser} /> }
      ]
    },
    {
      path: '/dashboard',
      element: (
        <ProtectedRoute>
          <DashboardLayout user={user} onLogout={handleLogout} />
        </ProtectedRoute>
      ),
      children: [
        { index: true, element: <Dashboard /> }
      ]
    }
  ]);

  return (
    <>
      <Toaster position="top-right" />
      <RouterProvider router={router} />
    </>
  );
};

export default App;
