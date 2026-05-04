import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Form, Button, Container, Alert, Spinner } from "react-bootstrap";
import { AuthContext } from "../auth/AuthContext";
import API from "../api/axios";

const Login = () => {
  const { login } = useContext(AuthContext);
