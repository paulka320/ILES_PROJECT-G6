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

  const fetchAll = async () => {
    try {
      const statsRes = await getAdminStats();
      const usersRes = await getAllUsers();
      const placementsRes = await getAllPlacements();
      const logsRes = await getAllLogs();
      const evalRes = await getAllEvaluations();

      setStats(statsRes.data);
      const usersData = usersRes.data?.results || usersRes.data || [];
      setUsers(usersData);

      setStudents(usersData.filter((u) => u.role === "student"));
      setSupervisors(usersData.filter((u) => u.role === "supervisor"));
      setAcademics(usersData.filter((u) => u.role === "academic"));

      const placementsData = placementsRes.data?.results || placementsRes.data || [];
      setPlacements(placementsData);

      const logsData = logsRes.data?.results || logsRes.data || [];
      setLogs(logsData);

      const evalData = evalRes.data?.results || evalRes.data || [];
      setEvaluations(evalData);

      } catch (err) {
        console.error("❌ Admin Error:", err.response || err);
        setMessage({ 
          type: "danger",
          text: "Failed to load dashboard data",
        });
      }
  };

  const handleCreatePlacement = async () => {
    try {
      if (
        !createPlacementForm.student_id ||
        !createPlacementForm.company_name ||
        !createPlacementForm.start_date ||
        !createPlacementForm.end_date
      ) {
        setMessage({ type: "warning", text: "Please fill in all required fields" });
        return;
      }
      await createPlacement(createPlacementForm);
      setMessage({ type: "success", text: "Placement created successfully" });
      
      setCreatePlacementForm({
        student_id: "",
        company_name: "",
        start_date: "",
        end_date: "",
        academic_id: "",
        supervisor_id: "",
      });

      setShowCreatePlacement(false);
      fetchAll();
    } catch (err) {
      setMessage({ 
        type: "danger",
        text: err.response?.data?.message || "Failed to create placement",
      });
    }
  };

  const handleUpdateRole = async () => {
    try {
      if (!editRoleForm.user_id || !editRoleForm.role) {
        setMessage({ type: "warning", text: "Please select a role" });
        return;
      }

      await updateUserRole(editRoleForm.user_id, editRoleForm.role);
      setMessage({ type: "success", text: "User role updated successfully" });
      setShowEditRole(false);
      setEditRoleForm({ user_id: null, role: "" });
      fetchAll();
    } catch (err) {
      setMessage({
        type: "danger",
        text: "Failed to update user role",
      });
    }
  };

  const handleAssignAcademic = async () => {
    try {
      if (!assignAcademicForm.placementId || !assignAcademicForm.academic_id) {
        setMessage({ type: "warning", text: "Please select an academic supervisor" });
        return;
      }

      await assignAcademicSupervisor(
        assignAcademicForm.placementId,
        assignAcademicForm.academic_id
      );
      setMessage({ type: "success", text: "Academic supervisor assigned successfully" });
      setShowAssignAcademic(false);
      setAssignAcademicForm({ placementId: null, academic_id: "" });
      fetchAll();
    } catch (err) {
      setMessage({
        type: "danger",
        text: "Failed to assign academic supervisor",
      });
    }
  };

    
