import { useEffect, useState } from "react";
import API from "../api/axios";
import Navigation from "../components/Navigation";
import { Link } from 'react-router-dom';
import { Container, Row, Col, Button, Card, Table } from 'react-bootstrap';



const  AdminPlacements = () => {
    
    const [placements, setPlacements] = 
        useState([]);
    
    const fetchPlacements = async () => {

        try {
            const res = 
                await API.get(
                    "internships/admin/placements/"
                );
            setPlacements(res.data);
        } catch (err) {
            console.error (
                "placements Error:",
                err.response || err
            );
        }
    };

    useEffect(() =>{
        fetchPlacements();
    }, []);

    return (
      <>
        <Navigation />
        <Container fluid className="p-4">
          <Row className="mb-3">
            <Col>
              <div className="d-flex flex-wrap gap-2">
                <Link to="/admin">
                  <Button variant="outline-primary">🏠 Admin Dashboard</Button>
                </Link>
                <Link to="/notifications">
                  <Button variant="outline-light">🔔 Notifications</Button>
                </Link>
              </div>
            </Col>
          </Row>
          <Row>
            <Col>
              <Card className="p-3">
                <h4>All Placements</h4>
            <Table striped bordered>
                <thead>
                    <tr>
                        <th>Student</th>
                        <th>Company</th>
                        <th>Supervisor</th>
                        <th>Academic</th>
                    </tr>
                </thead>
                <tbody>
                {placements.map((p) =>(
                    <tr key ={p.id}>
                        <td>{p.student?.username}</td>
                        <td>{p.company_name}</td>
                        <td>{p.supervisor_name?.username}</td>
                        <td>{p.academic_supervisor?.username}</td>
                    </tr>
                ))}
                </tbody>
            </Table>
        </Card>
        </Col>
    </Row>
  </Container>
    </>
    );

};
export default AdminPlacements;