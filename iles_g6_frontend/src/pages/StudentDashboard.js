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
              
  // Create OR Update Log
  const createLog = async () => {
    // Basic validation
    if (!newLog.week_number || !newLog.activities.trim()) {
      setMessage({ type: 'warning', text: 'Please fill in the week number and activities' });
      return;
    }                 
             
     try {
      if (editingId) {
        await API.put(logs/weeklylogs/${editingId}/, newLog);
        setMessage({ type: 'success', text: 'Log updated successfully' });
      } else {
        await API.post("logs/weeklylogs/", newLog);
        setMessage({ type: 'success', text: 'Log saved as draft' });
      }    

fetchLogs();
      setEditingId(null);
      setNewLog({
        week_number: "",
        activities: "",
        challenges: "",
      });
    } catch (err) {
      console.error("Create/Update Error:", err.response || err);
      setMessage({ type: 'danger', text: err.response?.data?.error || 'Failed to save log' });
    }
  };

  // Submit Log
  const submitLog = async (id) => {
    try {
      await API.post(logs/weeklylogs/${id}/submit/);
      setMessage({ type: 'success', text: 'Log submitted successfully' });
      fetchLogs();
    } catch (err) {
      console.error("Submit Error:", err.response || err);
      setMessage({ type: 'danger', text: err.response?.data?.error || 'Failed to submit log' });
    }
  };

// Delete Log
  const deleteLog = async (id) => {
    if (!window.confirm('Are you sure you want to delete this log?')) return;

 try {
      await API.delete(logs/weeklylogs/${id}/);
      setMessage({ type: 'success', text: 'Log deleted successfully' });
      fetchLogs();
    } catch (err) {
      console.error("Delete Error:", err.response || err);
      setMessage({ type: 'danger', text: err.response?.data?.error || 'Failed to delete log' });
    }
  };    
  
// Edit Log
  const editLog = (log) => {

    setEditingId(log.id);

    setNewLog({
      week_number: log.week_number,
      activities: log.activities,
      challenges: log.challenges,
    });

  };

// Chart Data
  const chartData =
    evaluations.map((ev, index) => ({

      week: index + 1,

      score: ev.total_score,

    }));

// Stats
  const totalLogs = logs.length;

  const submittedLogs =
    logs.filter(
      (l) => l.status === "submitted"
    ).length;

    const avgScore =
    evaluations.length > 0
      ? (
          evaluations.reduce(
            (a, b) =>
              a + b.total_score,
            0
          ) / evaluations.length
        ).toFixed(2)
      : 0;

  return (
    <Container fluid className="p-4">
      {/* ALERT MESSAGE */}
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

{/* Welcome */}
      <Row className="mb-4">
        <Col>
          <Card className="bg-success text-white p-3">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h2>📚 Student Dashboard</h2>
                <p>Welcome, {user?.username} | Role: {user?.role}</p>
                {loading && <p>Loading dashboard data...</p>}
              </div>
              <Link to="/notifications">
                <Button variant="light">🔔 Notifications</Button>
              </Link>
            </div>
          </Card>
        </Col>
      </Row>

  {/* Placement */}

{placement && (

<Row className="mb-4">

<Col>

<Card className="p-3">

<h4>Current Placement</h4>

<p>
<strong>Company:</strong>{" "}
{placement.company_name}
</p>

<p>
<strong>Start Date:</strong>{" "}
{placement.start_date}
</p>

<p>
<strong>End Date:</strong>{" "}
{placement.end_date}
</p>

</Card>

</Col>

</Row>

)}

 {/* Stats */}
      <Row className="mb-4">
        <Col md={4}>
          <Card className="p-3 text-center bg-primary text-white">
            <h6>Total Logs</h6>
            <h3>{totalLogs}</h3>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="p-3 text-center bg-success text-white">
            <h6>Submitted Logs</h6>
            <h3>{submittedLogs}</h3>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="p-3 text-center bg-warning">
            <h6>Average Score</h6>
            <h3>{avgScore}</h3>
          </Card>
        </Col>
      </Row>
                 
 {/* Create Log */}
      <Row className="mb-4">
        <Col>
          <Card className="p-3">
            <h4>📝 {editingId ? "Edit Weekly Log" : "Create Weekly Log"}</h4>
            <Form>
              <Row className="mb-2">
                <Col md={2}>
                  <Form.Control
                    type="number"
                    name="week_number"
                    placeholder="Week"
                    value={newLog.week_number}
                    onChange={handleChange}
                    required
                  />
                </Col>
              </Row>
             <Row className="mb-2">
                <Col>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="activities"
                    placeholder="Activities done this week"
                    value={newLog.activities}
                    onChange={handleChange}
                    required
                  />
                </Col>
              </Row>
              <Row className="mb-3">
                      <Col>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="challenges"
                    placeholder="Challenges faced this week"
                    value={newLog.challenges}
                    onChange={handleChange}
                  />
                </Col>
                </Row>
              <Button variant="primary" onClick={createLog}>
                {editingId ? "Update Log" : "Save Draft"}
              </Button>
              {editingId && (
                <Button
                  variant="secondary"
                  className="ms-2"
                  onClick={() => {
                    setEditingId(null);
                    setNewLog({ week_number: "", activities: "", challenges: "" });
                  }}
                >
                  Cancel Edit
                </Button>
              )}
            </Form>
          </Card>
        </Col>
      </Row>

{/* Logs Table */}
      <Row className="mb-4">
        <Col>
          <Card className="p-3">
            <h4>📋 Weekly Logs</h4>
            <Table striped bordered hover responsive>
              <thead className="table-info">
                <tr>
                  <th>Week</th>
                  <th>Activities</th>
                  <th>Challenges</th>
                  <th>Status</th>
                  <th>Feedback</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {logs.length > 0 ? (
                  logs.map((log) => (
                    <tr key={log.id}>
                      <td>{log.week_number}</td>
                      <td>{log.activities}</td>
                      <td>{log.challenges || "None"}</td>
                      <td>
                        <Badge
                          bg={
                            log.status === "approved"
                              ? "success"
                              : log.status === "submitted"
                              ? "primary"
                              : "warning"
                          }
                            >
                          {log.status}
                        </Badge>
                      </td>
                      <td>{log.supervisor_comment || "No feedback yet"}</td>
                      <td>
                        {log.status === "draft" && (
                          <>
                            <Button
                              size="sm"
                              variant="success"
                              className="me-2"
                              onClick={() => submitLog(log.id)}
                            >
                            Submit
                            </Button>
                            <Button
                              size="sm"
                              variant="warning"
                              className="me-2"
                              onClick={() => editLog(log)}
                            >
