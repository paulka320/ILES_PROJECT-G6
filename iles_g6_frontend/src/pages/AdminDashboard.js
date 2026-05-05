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
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [students, setStudents] = useState([]);
  const [supervisors, setSupervisors] = useState([]);
  const [academics, setAcademics] = useState([]);
  const [placements, setPlacements] = useState([]);
  const [logs, setLogs] = useState([]);
  const [evaluations, setEvaluations] = useState([]);

  const [showCreatePlacement, setShowCreatePlacement] = useState(false);
  const [showEditRole, setShowEditRole] = useState(false);
  const [showAssignAcademic, setShowAssignAcademic] = useState(false);

  const [createPlacementForm, setCreatePlacementForm] = useState({
    student_id: "",
    company_name: "",
    start_date: "",
    end_date: "",
    academic_id: "",
    supervisor_id: "",
  });
  const [editRoleForm, setEditRoleForm] = useState({ user_id: null, role: "" });
  const [assignAcademicForm, setAssignAcademicForm] = useState({
    placementId: null,
    academic_id: "",
  });

  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchAll();
  }, []);
    
