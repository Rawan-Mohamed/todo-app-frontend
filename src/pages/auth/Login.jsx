import React from 'react';
import { Card, Form, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { User } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { todoApi } from '../../api/todoApi';
import toast from 'react-hot-toast';

const Login = ({ onLogin }) => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await todoApi.login(data);
      const user = response.data?.user || response.user || response;
      const token = response.token;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      onLogin(user);
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.message || 'Failed to login');
    }
  };

  return (
    <div className="auth-container d-flex justify-content-center align-items-center ">
      <Card className="auth-card">
        <Card.Body className="p-4">
          <div className="text-center mb-4">
            <div className="rounded-circle p-3 d-inline-block mb-3 bg-color"
              >
              <User size={32} className="text-white" />
            </div>
            <h2 className="mb-2">Welcome Back</h2>
            <p className="text-muted">Sign in to manage your todos</p>
          </div>

          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group className="mb-3">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: 'Invalid email address'
                  }
                })}
                isInvalid={!!errors.email}
              />
              <Form.Control.Feedback type="invalid">
                {errors.email?.message}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter your password"
                {...register('password', { required: 'Password is required' })}
                isInvalid={!!errors.password}
              />
              <Form.Control.Feedback type="invalid">
                {errors.password?.message}
              </Form.Control.Feedback>
            </Form.Group>

            <Button
              type="submit"
              className="w-100 mb-3 bg-color"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </Button>

            <div className="text-center">
              <p className="mb-0">
                Don't have an account?{' '}
                <Link to="/signup" className="text-color text-decoration-none">
                  Sign Up
                </Link>
              </p>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>

  );
};

export default Login;
