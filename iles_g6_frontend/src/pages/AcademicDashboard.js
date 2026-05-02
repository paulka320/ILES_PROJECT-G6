import { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../auth/AuthContext';
import API from '../api/axios';
import { Container, Row, Col, Card, Table, Button, Form, Badge, Alert, Modal, Tab, Nav } from 'react-bootstrap';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const AcademicDashboard = () => {
    const { user } = useContext(AuthContext);
    const [students, setStudents] = useState([]);
    const [evaluations, setEvaluations] = useState([]);
    const [stats, setStats] = useState(null);
    const [logs, setLogs] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const [showEvaluationModal, setShowEvaluationModal] = useState(false);
    const [showStudentDetails, setShowStudentDetails] = useState(false);

    const [newEvaluation, setNewEvaluation] = useState({
        student: '',
        attendance_score: '',
        performance_score: '',
        report_score: '',
    });


    const fetchStudents = async () => {
        try {
            const res = await API.get(internships/academic/students/);
            setStudents(res.data);
        } catch (err) {
            console.error('Error fetching students:', err);
            setMessage({ type: 'danger', text: 'Failed to load students' });
        }
    };
    
    const fetchEvaluations = async () => {
        try {
            const res = await API.get(evaluations/academic/${user.id}/evaluations/);
            setEvaluations(res.data);
        } catch (err) {
            console.error('Error fetching evaluations:', err);
            setMessage({ type: 'danger', text: 'Failed to load evaluations' });
        }
    };

    const fetchStats = async () => {
        try {
            const res = await API.get(evaluations/academic/${user.id}/stats/);
            setStats(res.data);
        } catch (err) {
            console.error('Error fetching stats:', err);
            setMessage({ type: 'danger', text: 'Failed to load statistics' });
        }
    };
