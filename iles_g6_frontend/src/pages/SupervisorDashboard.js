// src/pages/SupervisorDashboard.js
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../auth/AuthContext";
import API from "../api/axios";
import { Container, Row, Col, Card, Table, Badge } from "react-bootstrap";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const SupervisorDashboard = () => {
  const { user } = useContext(AuthContext);
  const [students, setStudents] = useState([]);
  const [pendingLogs, setPendingLogs] = useState([]);
  const [evaluations, setEvaluations] = useState([]);

   useEffect(() => {
     const fetchData = async () => {
      try {
        const studentsRes = await API.get(`internships/supervisor/${user.id}/students/`);
        console.log("Supervisor students:",studentsRes.data);
        setStudents(studentsRes.data);

        const logsRes = await API.get(`logs/supervisor/${user.id}/pending/`);
        console.log("Pending logs:", logsRes.data);
        setPendingLogs(logsRes.data);

        const evalRes = await API.get(`evaluations/supervisor/${user.id}/evaluations/`);
        const data = Array.isArray(evalRes.data) ? evalRes.data :[];

        console.log("Evaluations:", data);
        setEvaluations(data);
      
      } catch (err) {
        console.error("Error fetching supervisor dashboard:", err);
      }
    };
    fetchData();
  }, [user]);

  const chartData = evaluations.map((ev) => ({
    student: ev.student.username,
    score: ev.total_score,
  }));

  return (
    <Container fluid className="p-4">
      <Row className="mb-4">
        <Col>
          <Card className="bg-success text-white p-3">
            <h2>Welcome, {user.username}!</h2>
            <p>Role: {user.role}</p>
          </Card>
        </Col>
      </Row>
  