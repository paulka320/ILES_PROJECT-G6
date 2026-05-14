import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Form, Button, Container, Alert, Spinner, Modal } from "react-bootstrap";
import { AuthContext } from "../auth/AuthContext";
import API from "../api/axios";
import { requestPasswordReset, resetPassword } from "../api/auth";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [resetStep, setResetStep] = useState("email"); // "email", "token", "password"
  const [resetData, setResetData] = useState({
    email: "",
    token: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "student",
  });

  const resetForm = () => {
    setFormData({ username: "", email: "", password: "", role: "student" });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);
 
    try {
      const user = await login({
        username: formData.username,
        password: formData.password,
      });

      if (user.role === "admin") navigate("/admin");
      else if (user.role === "supervisor") navigate("/supervisor");
      else if (user.role === "academic") navigate("/academic");
      else navigate("/student");
    } catch (err) {
      console.error("Login Error:", err.response || err);
      console.error("Error details:", err.response?.data);
      setMessage({ type: "danger", text: err.response?.data?.detail || err.response?.data?.error || "Invalid username or password." });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    try {
      await API.post("/users/register/", {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });

      setMessage({ type: "success", text: "Registration successful. Please login." });
      setIsRegister(false);
      resetForm();
    } catch (err) {
      console.error("Registration Error:", err.response || err);
      setMessage({ type: "danger", text: err.response?.data?.error || "Registration failed." });
    } finally {
      setLoading(false);
    }
  };

  const handleRequestPasswordReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      await requestPasswordReset(resetData.email);
      setResetStep("token");
      setMessage({
        type: "success",
        text: "Password reset code sent to your email. Check your inbox and enter the code.",
      });
    } catch (err) {
      console.error("Password Reset Request Error:", err.response || err);
      setMessage({
        type: "danger",
        text: err.response?.data?.error || "Email not found. Please check and try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyTokenAndReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (resetData.newPassword !== resetData.confirmPassword) {
      setMessage({ type: "danger", text: "Passwords do not match." });
      setLoading(false);
      return;
    }

    try {
      await resetPassword(resetData.email, resetData.token, resetData.newPassword);
      setMessage({ type: "success", text: "Password reset successful! You can now login with your new password." });
      setShowPasswordReset(false);
      setResetStep("email");
      setResetData({ email: "", token: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      console.error("Password Reset Error:", err.response || err);
      setMessage({
        type: "danger",
        text: err.response?.data?.error || "Password reset failed. Invalid or expired code.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClosePasswordReset = () => {
    setShowPasswordReset(false);
    setResetStep("email");
    setResetData({ email: "", token: "", newPassword: "", confirmPassword: "" });
    setMessage(null);
  };

  return (
    <Container
      fluid
      className="d-flex justify-content-center align-items-center min-vh-100"
      style={{ background: "linear-gradient(135deg, #0d6efd 0%, #198754 100%)" }}
    >
      <Card className="shadow-lg border-0" style={{ width: "420px", maxWidth: "95%" }}>
        <Card.Body className="p-4">
          <div className="text-center mb-4">
            <div className="mb-2">
              <span className="badge bg-primary rounded-pill px-3 py-2">ILES</span>
            </div>
            <h3 className="fw-bold mb-1">
              {isRegister ? "Create your account" : "Welcome back"}
            </h3>
            <p className="text-muted mb-0">
              {isRegister
                ? "Register to join the internship management system."
                : "Sign in to continue to the internship portal."}
            </p>
          </div>

          {message && (
            <Alert
              variant={message.type}
              onClose={() => setMessage(null)}
              dismissible
              className="mb-4"
            >
              {message.text}
            </Alert>
          )}

          <Form onSubmit={isRegister ? handleRegister : handleLogin}>
            <Form.Group className="mb-3" controlId="loginUsername">
              <Form.Label>Username or Email</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your username or email"
                value={formData.username}
                required
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
            </Form.Group>

            {isRegister && (
              <Form.Group className="mb-3" controlId="loginEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  required
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                <Form.Text className="text-muted">We&apos;ll never share your email.</Form.Text>
              </Form.Group>
            )}

            <Form.Group className="mb-4" controlId="loginPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                required
                minLength={6}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </Form.Group>

            {isRegister && (
              <Form.Group className="mb-4" controlId="loginRole">
                <Form.Label>Role</Form.Label>
                <Form.Select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  required
                >
                  <option value="student">Student</option>
                  <option value="supervisor">Workplace Supervisor</option>
                  <option value="academic">Academic Supervisor</option>
                  <option value="admin">Admin</option>
                </Form.Select>
                <Form.Text className="text-muted">
                  Select your role in the internship system.
                </Form.Text>
              </Form.Group>
            )}

            {!isRegister && (
              <div className="text-end mb-3">
                <Button
                  variant="link"
                  size="sm"
                  className="text-decoration-none p-0"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowPasswordReset(true);
                  }}
                >
                  Forgot Password?
                </Button>
              </div>
            )}

            <Button type="submit" className="w-100 py-2" variant="primary" disabled={loading}>
              {loading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  {isRegister ? "Registering..." : "Signing in..."}
                </>
              ) : (
                isRegister ? "Register" : "Login"
              )}
            </Button>
          </Form>

          <div className="text-center mt-4">
            <p className="text-muted">
              {isRegister ? "Already have an account?" : "Don't have an account?"}
            </p>
            <Button
              variant="link"
              className="text-decoration-none"
              onClick={() => {
                setIsRegister(!isRegister);
                setMessage(null);
                resetForm();
              }}
            >
              {isRegister ? "Login" : "Create an account"}
            </Button>
          </div>
        </Card.Body>
      </Card>

      {/* Password Reset Modal */}
      <Modal show={showPasswordReset} onHide={handleClosePasswordReset} centered>
        <Modal.Header closeButton>
          <Modal.Title>Reset Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {message && (
            <Alert variant={message.type} onClose={() => setMessage(null)} dismissible>
              {message.text}
            </Alert>
          )}

          {resetStep === "email" && (
            <Form onSubmit={handleRequestPasswordReset}>
              <Form.Group className="mb-3">
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter your email address"
                  value={resetData.email}
                  required
                  onChange={(e) =>
                    setResetData({ ...resetData, email: e.target.value })
                  }
                />
                <Form.Text className="text-muted">
                  We&apos;ll send a password reset code to this email.
                </Form.Text>
              </Form.Group>
              <Button
                type="submit"
                variant="primary"
                className="w-100"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Sending...
                  </>
                ) : (
                  "Send Reset Code"
                )}
              </Button>
            </Form>
          )}

          {resetStep === "token" && (
            <Form onSubmit={handleVerifyTokenAndReset}>
              <Form.Group className="mb-3">
                <Form.Label>Reset Code</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter the code from your email"
                  value={resetData.token}
                  required
                  onChange={(e) =>
                    setResetData({ ...resetData, token: e.target.value })
                  }
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>New Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter new password"
                  value={resetData.newPassword}
                  required
                  minLength={6}
                  onChange={(e) =>
                    setResetData({ ...resetData, newPassword: e.target.value })
                  }
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Confirm new password"
                  value={resetData.confirmPassword}
                  required
                  minLength={6}
                  onChange={(e) =>
                    setResetData({ ...resetData, confirmPassword: e.target.value })
                  }
                />
              </Form.Group>

              <Button
                type="submit"
                variant="success"
                className="w-100"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Resetting...
                  </>
                ) : (
                  "Reset Password"
                )}
              </Button>
            </Form>
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Login;              