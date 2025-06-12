import React from 'react';
import { Container } from 'react-bootstrap';
import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="auth-container">
      <Container>
        <Outlet />
      </Container>
    </div>
  );
};

export default AuthLayout; 