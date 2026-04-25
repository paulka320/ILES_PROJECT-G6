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