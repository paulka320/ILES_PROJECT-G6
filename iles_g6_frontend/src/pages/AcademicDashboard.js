// Import authentication context, API service, UI components, and charting tools for user data access, backend communication, interface layout, and data visualization
import { useEffect, useState, useContext } from "react";

import { AuthContext } from "../auth/AuthContext";

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
// Academic dashboard component: retrieves the logged-in user from context, 
//fetches supervised students and evaluation data via API on load/user change, 
//stores them in state, prepares chart data, and renders user info, a student's table, 
//and evaluation score visualization using React Bootstrap and Recharts
const AcademicDashboard = () => {
  const { user } = useContext(AuthContext);
  const [students, setStudents] = useState([]);
  const [evaluations, setEvaluations] = useState([]);
 // useEffect runs when the component mounts or when the user changes
  useEffect(() => {
    const fetchData = async () => {
      try {
         // Fetch students assigned to the academic user
        const studentsRes = await API.get(
          `internship/academic/${user.id}/students/`
        );
        setStudents(studentsRes.data);
 // Fetch evaluation data
        const evalRes = await API.get(`evaluations/`);
        setEvaluations(evalRes.data);
      } catch (err) {
        console.error("Error fetching academic dashboard:", err);
      }
    };

    if (user) fetchData();
  }, [user]);

  const chartData = evaluations.map((ev) => ({
    student: ev. student?.username,
    score: ev.total_score,
  }));

  return (
    <Container fluid className="p-4">
     {/* Header section showing logged-in user info */}
      <Row className="mb-4">
        <Col>
          <Card className="bg-info text-white p-3">
            <h2>Welcome, {user?.username}!</h2>
            <p>Role: {user?.role}</p>
          </Card>
        </Col>
      </Row>
{/* Table displaying supervised students */}
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
// Exporting component for use in other parts of the app
export default AcademicDashboard;
