import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Form, Button, Container, Alert, Spinner } from "react-bootstrap";
import { AuthContext } from "../auth/AuthContext";
import API from "../api/axios";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

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
      const user = await login(formData.username, formData.password);

      if (user.role === "admin") navigate("/admin");
      else if (user.role === "supervisor") navigate("/supervisor");
      else if (user.role === "academic") navigate("/academic");
      else navigate("/student");
    } catch (err) {
      console.error("Login Error:", err.response || err);
      setMessage({ type: "danger", text: "Invalid username or password." });
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
