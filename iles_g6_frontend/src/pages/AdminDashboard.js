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
}