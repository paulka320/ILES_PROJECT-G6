import {useEffect,useState} from "react";
import API from "../api/axios";
import {Container, Row, Col, Card} from "react-bootstrap";


const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalStudents:0,
        totalSupervisors:0,
        totalPlacements:0,
        avgScore:0,
    });

    useEffect (() => {
        const fetchStats = async () => {
            try {
                const res = await API.get("users/admin/stats/");
                setStats(res.data);
            }catch (err){
                console.error("Error fetching admin stats:",err);
            }

        };
        fetchStats();
    }, []);

    return (
        <Container fluid className = "p-4">
            <Row className = "mb-4">
                <Col>
                    <Card className = "bg-dark text-white p-3">
                        <h2>Admin Dashboard</h2>
                    </Card>
                </Col>
            </Row>
            <Row className= "mb-4">
                <Col md={3}>
                    <Card className = "text-center p-3">
                        <h5>Total Students</h5>
                        <h2>{stats.totalStudents}</h2>
                    </Card>
                </Col>
                <Col md = {3}>
                    <Card className="text-center p-3">
                        <h5>Total Supervisors</h5>
                        <h2>{stats.totalSupervisors}</h2>
                    </Card>
                </Col>
                <Col md = {3}>
                    <Card className="text-center p-3">
                        <h5>Total Placements</h5>
                        <h2>{stats.totalPlacements}</h2>
                    </Card>
                </Col>
                <Col md = {3}>
                    <Card className="text-center p-3">
                        <h5>Average Evaluation Score</h5>
                        <h2>{stats.avgScore}</h2>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default AdminDashboard;