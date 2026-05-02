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

    const fetchStudentLogs = async (studentId) => {
        try {
            const res = await API.get(logs/academic/${studentId}/logs/);
            setLogs(res.data);
        } catch (err) {
            console.error('Error fetching logs:', err);
            setMessage({ type: 'danger', text: 'Failed to load student logs' });
        }
    };


    useEffect(() => {
      if (user && user.role === 'academic') {
        setLoading(true);
        Promise.all([fetchStudents(), fetchEvaluations(), fetchStats()]).finally(() => setLoading(false));
      }
    }, [user]);

    const selectStudent = (student) => {
        setSelectedStudent(student);
        setNewEvaluation({
          ...newEvaluation,
          student: student.student.id,
        });

        fetchStudentLogs(student.student.id);
        setShowStudentDetails(true);
    };

    const handleChange = (e) => {
        setNewEvaluation({
          ...newEvaluation,
          [e.target.name]: Number(e.target.value),
        });
    };

    const submitEvaluation = async (e) => {
       e.preventDefault();

       if (!newEvaluation.student) {
        setMessage({ type: 'warning', text: 'Please select a student first' });
        return;
        }
        
