import React from 'react';
import { Container, Navbar, Nav, Button } from 'react-bootstrap';
import { Outlet, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';

const DashboardLayout = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <div className="todo-container">
      <Navbar bg="white" expand="lg" className="shadow-sm">
        <Container>
          <Navbar.Brand className="navbar-brand">Todo Dashboard</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Navbar.Text className="me-3">
                Welcome, {user?.name}!
              </Navbar.Text>
              <Button 
                variant="outline-danger" 
                onClick={handleLogout}
                className="d-flex align-items-center gap-2"
              >
                <LogOut size={18} />
                Logout
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="py-4">
        <Outlet />
      </Container>
    </div>
  );
};

export default DashboardLayout; 