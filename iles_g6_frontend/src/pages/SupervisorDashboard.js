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

      <Row className="mb-4">
        <Col md={6}>
          <Card className="p-3">
            <h4>Assigned Students</h4>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                {students.map((stu) => (
                  <tr key={stu.id}>
                    <td>{stu.username}</td>
                    <td>{stu.role}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="p-3">
            <h4>Pending Weekly Logs</h4>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Week</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {pendingLogs.map((log) => (
                  <tr key={log.id}>
                    <td>{log.student.username}</td>
                    <td>{log.week_number}</td>
                    <td>
                      <Badge bg="warning">{log.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card className="p-3">
            <h4>Evaluation Scores</h4>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="student" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="score" stroke="#82ca9d" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p>No evaluation data yet</p>
            )}
          </Card>
        </Col>
      </Row>
    </Container>
  );
};
