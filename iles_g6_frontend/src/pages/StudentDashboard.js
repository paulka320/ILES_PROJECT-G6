import { useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { getStudentLogs, getStudentPlacement, getStudentEvaluations } from "../api/student";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card, Container, Row, Col, Table, Badge } from "react-bootstrap";

const StudentDashboard = () => {
    const { user } = useContext(AuthContext);
    const [logs, setLogs] = useState([]);
    const [placement, setPlacement] = useState(null);
    const [evaluations, setEvaluations] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {

                const logRes = await getStudentLogs();
                console.log("LOG DATA:", logRes.data);
                setLogs(logRes.data);

                const placementRes = await getStudentPlacement();
                console.log("PLACEMENT DATA:", placementRes.data);
                setPlacement(placementRes.data);

                const evalRes = await getStudentEvaluations();
                console.log("EVALUATION DATA:", evalRes.data);
                setEvaluations(evalRes.data);
            } catch (err){
                console.log(" Dashboard :", err.response || err);
            }
        };
        fetchData();
    }, [user]);

    const chartData = evaluations.map((ev, index) => ({
        week: index + 1,
        score: ev.total_score,
    }));

    const totalLogs = logs.length;
    const submittedLogs = logs.filter((l) => l.status === "submitted").length;
    const pendingLogs = totalLogs - submittedLogs;
    const avgScore = evaluations.length > 0 ? (evaluations.reduce((a,b) => a + b.total_score, 0) / evaluations.length).toFixed(2) : 0;

    return (
        <Container fluid className="p-4">
            <Row className="mb-4">
                <Card className="bg-primary text-white p-3">
                    <h2>Welcome, {user.username}</h2>

