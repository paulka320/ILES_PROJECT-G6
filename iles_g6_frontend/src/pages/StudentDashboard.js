import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../auth/AuthContext";
import API from "../api/axios";

import {
  getStudentLogs,
  getStudentPlacement,
  getStudentEvaluations,
} from "../api/student";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import {
  Card,
  Container,
  Row,
  Col,
  Table,
  Badge,
  Button,
  Form,
  Alert,
} from "react-bootstrap";

const StudentDashboard = () => {
  const { user } = useContext(AuthContext);

  const [logs, setLogs] = useState([]);
  const [placement, setPlacement] = useState(null);
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);



              
                   
             
        




        




