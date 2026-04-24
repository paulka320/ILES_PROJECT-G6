// Import React hooks for state management, lifecycle, and context
import { useEffect, useState, useContext } from "react";
// Import authentication context to access logged-in user info
import { AuthContext } from "../auth/AuthContext";
// Import configured Axios instance for API requests
import API from "../api/axios";
import { Container, Row, Col, Card, Table } from "react-bootstrap";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const AcademicDashboard = () => {
  const { user } = useContext(AuthContext);
  const [students, setStudents] = useState([]);
  const [evaluations, setEvaluations] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const studentsRes = await API.get(
          `internship/academic/${user.id}/students/`
        );
        setStudents(studentsRes.data);

        const evalRes = await API.get(`evaluations/`);
        setEvaluations(evalRes.data);
      } catch (err) {
        console.error("Error fetching academic dashboard:", err);
      }
    };

    if (user) fetchData();
  }, [user]);

  const chartData = evaluations.map((ev) => ({
    student: ev.student?.username,
    score: ev.total_score,
  }));

  return (
    <Container fluid className="p-4">
      <Row className="mb-4">
        <Col>
          <Card className="bg-info text-white p-3">
            <h2>Welcome, {user?.username}!</h2>
            <p>Role: {user?.role}</p>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col>
          <Card className="p-3">
            <h4>Supervised Students</h4>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Placement Company</th>
                </tr>
              </thead>
              <tbody>
                {students.map((stu) => (
                  <tr key={stu.id}>
                    <td>{stu.username}</td>
                    <td>
                      {stu.placement?.company_name || "N/A"}
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
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#8884d8"
                    strokeWidth={3}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p>No evaluations data yet</p>
            )}
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AcademicDashboard;
