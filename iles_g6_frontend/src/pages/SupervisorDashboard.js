// src/pages/SupervisorDashboard.js
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../auth/AuthContext";
import API from "../api/axios";
import { Container, Row, Col, Card, Table, Badge, Button, Form, Alert } from "react-bootstrap";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Link } from "react-router-dom";



const SupervisorDashboard = () => {
  const { user } = useContext(AuthContext);

  const [students, setStudents] = useState([]);

  const [loading, setLoading] = useState(false);

  const [pendingLogs, setPendingLogs] = useState([]);

  const [message, setMessage] = useState(null);

  const [comments, setComments] = useState({});

  const [evaluations, setEvaluations] = useState([]);

  

    const fetchData = async () => {
      setLoading(true);
      try {
        const studentsRes = await API.get(`internships/supervisor/students/`);

        setStudents(studentsRes.data);

        const logsRes = await API.get(`logs/supervisor/pending/`);
        
        setPendingLogs(logsRes.data);

        const evalRes = await API.get(`evaluations/academic/${user.id}/evaluations/`);
        const data = Array.isArray(evalRes.data) ? evalRes.data :[];

        
        setEvaluations(data);
      
      } catch (err) {
        console.error("Error fetching supervisor dashboard:", err);
        setMessage({type:'danger',text:'Failed to Load dashboard data'});

      } finally {
        setLoading(false);
      }
    };

    useEffect(() =>{
      if (user && user.role =='supervisor') {
        fetchData();
      }
    },[user]);

  const handleCommentChange = (id, value) => {

    setComments ({
      ...comments,
      [id]: value,
    });
  };

  const reviewLog = async (id, action) => {
    if (!comments[id] || comments[id].trim()===''){
      setMessage({type: 'warning',text:'please provide feedback before approving or rejecting'});
      return;
    }
    try {
      await API.post(`logs/weeklylogs/${id}/review`,{
        action,
        supervisor_comment: comments[id],
      });
      const statusText = action ==='approve' ? 'approved' : 'rejected';
      setMessage({ type: 'success', text:`Log ${statusText} successfully `});
      setComments({...comments, [id]: ''});
      fetchData();
    } catch (err) {
      console.error("Review Error:", err.response || err);
      setMessage({type: 'danger', text:err.response?.data?.error || 'Failed to review log'});
    }
  };

  const chartData =
   evaluations.map((ev) => ({

      student: ev.student?.username,
      score: ev.total_score,
  }));

  return (
    <Container fluid className="p-4">
      {message && (
        <Alert
            variant={message.type}
            onclose={()=> setMessage(null)}
            dismissible
            className="mb-4"
            >
              {message.text}
            </Alert>
      )}
      <Row className="mb-4">
        <Col>
          <Card className="bg-primary text-white p-3">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h2>👨‍🏫 Supervisor Dashboard</h2>
                <p>Welcome, {user?.username} | Role: {user?.role}</p>
                {loading && <p>Loading Dashboard data...</p>}
              </div>
              <Link to="/notifications">
                <Button variant="light">🔔 Notifications</Button>
              </Link>
            </div>
            
          </Card>
        </Col>
      </Row>

      <Row className="mb-4">

        <Col md={6}>

          <Card className="p-3">

            <h4>👥 Assigned Students</h4>
            <Table striped bordered hover responsive>
              <thead className="table-info">
                <tr>
                  <th>Username</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                {students.length > 0 ? (
                  students.map((stu) => (
                    <tr key={stu.id}>
                      <td>{stu.student?.username || 'N/A'}</td>
                      <td>
                      <Badge bg="info">{stu.student?.role || 'N/A'}</Badge>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr></tr>
                )
                )}
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

export default SupervisorDashboard;