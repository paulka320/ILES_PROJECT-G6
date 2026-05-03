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
            <h4>System Users</h4>
            <Table striped bordered>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Username</th>
                        <th>Role</th>
                    </tr>
                </thead>
                <tbody>

                    {users.map((user) =>(
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.username}</td>
                            <td>{user.role}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Card>
        </Col>
    </Row>
</Container>
    );
};

export default AdminUsers;