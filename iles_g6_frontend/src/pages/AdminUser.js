import { useEffect, useState } from "react";

import API from "../api/axios";
import { 
    Container,
    Row,
    Col,
    Card,
    Table,
} from "react-bootstrap";

const AdminUsers = () => {
    const [users, setUsers] = useState([]);

    const fetchUsers = async () => {
        try {
            const res = 
                await API.get("users/users/");
            setUsers(res.data);
        } catch (err) {
            console.error (
                "users Fetch Error:",
                err
            );
        }
    };

    useEffect(() => {
        fetchUsers();
    },[]);

    return (
<Container fluid className="p-4">
    <Row>
        <Col>
        <Card className="p-3">
            
        </Card>
        </Col>
    </Row>
</Container>
    )
}