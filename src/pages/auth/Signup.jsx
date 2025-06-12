import React from 'react';
import { Card, Form, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { todoApi } from '../../api/todoApi';
import toast from 'react-hot-toast';

const Signup = ({ onSignup }) => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting }
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await todoApi.signup(data);
      const user = response.data?.user || response.user || response;
      const token = response.token;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      onSignup(user);
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.message || 'Failed to sign up');
    }
  };

  const password = watch('password');

  return (
    <div className="auth-container d-flex justify-content-center align-items-center ">

      <Card className="auth-card">
        <Card.Body className="p-4">
          <div className="text-center mb-4">
            <div className="rounded-circle p-3 d-inline-block mb-3 bg-color"
             >
              <UserPlus size={32} className="text-white" />
            </div>
            <h2 className="mb-2">Create Account</h2>
            <p className="text-muted">Join us to get organized</p>
          </div>

          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group className="mb-3">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your full name"
                {...register('name', { required: 'Name is required' })}
                isInvalid={!!errors.name}
              />
              <Form.Control.Feedback type="invalid">
                {errors.name?.message}
              </Form.Control.Feedback>
            </Form.Group>

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

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Create a password"
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Must be at least 6 characters'
                  },
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/,
                    message:
                      'Must include uppercase, lowercase, number, and special character'
                  }
                })}
                isInvalid={!!errors.password}
              />
              <Form.Control.Feedback type="invalid">
                {errors.password?.message}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm your password"
                {...register('passwordConfirm', {
                  required: 'Please confirm your password',
                  validate: (value) =>
                    value === password || 'Passwords do not match'
                })}
                isInvalid={!!errors.passwordConfirm}
              />
              <Form.Control.Feedback type="invalid">
                {errors.passwordConfirm?.message}
              </Form.Control.Feedback>
            </Form.Group>

            <Button
              type="submit"
              className="w-100 mb-3 bg-color"
             
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating Account...' : 'Create Account'}
            </Button>

            <div className="text-center">
              <p className="mb-0">
                Already have an account?{' '}
                <Link to="/login" className="text-decoration-none text-color"
                  >
                  Sign In
                </Link>
              </p>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Signup;
