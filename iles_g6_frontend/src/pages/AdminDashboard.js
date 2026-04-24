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

    return ()
}