import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../auth/AuthContext';
import { Button, Nav, Navbar } from 'react-bootstrap';

const Navigation = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardPath = (role) => {
    switch (role) {
      case 'admin':
        return '/admin';
      case 'supervisor':
        return '/supervisor';
      case 'academic':
        return '/academic';
      case 'student':
        return '/student';
      default:
        return '/student';
    }
  };

  if (!user) return null;

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-3">
      <Navbar.Brand as={Link} to={getDashboardPath(user.role)}>
        🎓 ILES Internship System
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
          <Nav.Link as={Link} to={getDashboardPath(user.role)}>
            🏠 Dashboard
          </Nav.Link>
          <Nav.Link as={Link} to="/notifications">
            🔔 Notifications
          </Nav.Link>
          {user.role === 'admin' && (
            <Nav.Link as={Link} to="/admin/placements">
              📍 Placements
            </Nav.Link>
          )}
        </Nav>
        <Nav className="ms-auto">
          <Navbar.Text className="me-3">
            Welcome, <strong>{user.username}</strong> ({user.role})
          </Navbar.Text>
          <Button variant="outline-light" onClick={handleLogout}>
            🚪 Logout
          </Button>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Navigation;