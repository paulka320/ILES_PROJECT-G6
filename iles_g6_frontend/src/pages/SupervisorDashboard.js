// src/pages/SupervisorDashboard.js
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../auth/AuthContext";
import API from "../api/axios";
import { Container, Row, Col, Card, Table, Badge } from "react-bootstrap";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const SupervisorDashboard = () => {
  const { user } = useContext(AuthContext);
  const [students, setStudents] = useState([]);
  const [pendingLogs, setPendingLogs] = useState([]);
  const [evaluations, setEvaluations] = useState([]);

   useEffect(() => {
     const fetchData = async () => {
      try {
        const studentsRes = await API.get(`internships/supervisor/${user.id}/students/`);
        console.log("Supervisor students:",studentsRes.data);
        setStudents(studentsRes.data);

             const logsRes = await API.get(`logs/supervisor/${user.id}/pending/`);
           console.log("Pending logs:", logsRes.data);
        setPendingLogs(logsRes.data);

        const evalRes = await API.get(`evaluations/supervisor/${user.id}/evaluations/`);
        const data = Array.isArray(evalRes.data) ? evalRes.data :[];
