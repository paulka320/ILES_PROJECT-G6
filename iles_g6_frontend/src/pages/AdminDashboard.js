import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { 
  getAdminStats,
  getAllUsers,
  getAllPlacements,
  getAllLogs,
  getAllEvaluations,
  deleteUser,
  deleteLog,
  approveLog,
  rejectLog,
  assignSupervisor,
  assignAcademicSupervisor,
  createPlacement,
  updateUserRole,
} from "../api/admin";
import { 
  Container,
  Row,
  Col,
  Card,
  Table,
  Button,
  Modal,
  Form,
  Alert,
  Badge,
  Nav,
  Tab,
} from "react-bootstrap";

const AdminDashboard = () => {