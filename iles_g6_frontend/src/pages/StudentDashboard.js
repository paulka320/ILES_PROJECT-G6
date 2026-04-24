import { useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { getStudentLogs, getStudentPlacement, getStudentEvaluations } from "../api/student";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card, Container, Row, Col, Table, Badge } from "react-bootstrap";

const StudentDashboard = () => {