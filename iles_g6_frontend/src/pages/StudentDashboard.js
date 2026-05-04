import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../auth/AuthContext";
import API from "../api/axios";

import {
  getStudentLogs,
  getStudentPlacement,
  getStudentEvaluations,
} from "../api/student";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import {
  Card,
  Container,
  Row,
  Col,
  Table,
  Badge,
  Button,
  Form,
  Alert,
} from "react-bootstrap";

const StudentDashboard = () => {
  const { user } = useContext(AuthContext);

  const [logs, setLogs] = useState([]);
  const [placement, setPlacement] = useState(null);
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const [editingId, setEditingId] = useState(null);
  
const [newLog, setNewLog] = useState({
    week_number: "",
    activities: "",
    challenges: "",
  });

 // Fetch Logs
  const fetchLogs = async () => {
    try {
      const logRes = await getStudentLogs();
      setLogs(logRes.data);
      } catch (err) {
      console.error("Fetch Logs Error:", err);
      setMessage({ type: 'danger', text: 'Failed to load weekly logs' });
    }
  };

  // Fetch All Dashboard Data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await fetchLogs();

        const placementRes = await getStudentPlacement();
        setPlacement(placementRes.data[0]);
        
      } catch (err) {
        console.error("Dashboard Error:", err.response || err);
        setMessage({ type: 'danger', text: 'Failed to load dashboard data' });
      } finally {
        setLoading(false);
      }
    };

     if (user && user.role === 'student') {
      fetchData();
    }
  }, [user]);

  // Handle Input Change
  const handleChange = (e) => {
    setNewLog({
      ...newLog,
      [e.target.name]: e.target.value,
    });

  };
              
                   
             
        




        




