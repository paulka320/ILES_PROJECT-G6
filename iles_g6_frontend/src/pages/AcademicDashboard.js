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

        if (
            newEvaluation.attendance_score < 0 ||
            newEvaluation.attendance_score > 10 ||
            newEvaluation.performance_score < 0 ||
            newEvaluation.performance_score > 10 ||
            newEvaluation.report_score < 0 ||
            newEvaluation.report_score > 10
        ) {
            setMessage({ type: 'warning', text: 'Scores must be between 0 and 10' });
            return;
        }

        setSubmitting(true);
        try {
            await API.post(evaluations/evaluations/, newEvaluation);
            setMessage({ type: 'success', text: 'Evaluation submitted successfully' });
            setShowEvaluationModal(false);
            setNewEvaluation({
                student: '',
                attendance_score: '',
                performance_score: '',
                report_score: '',
            });
            fetchEvaluations();
            fetchStats();
        } catch (err) {
          setMessage({ type: 'danger', text: 'Evaluation submission failed' });
        } finally {
          setSubmitting(false);
        }
    };


    const chartData = evaluations.map((ev) => ({
        student: ev.student_details?.username,
        score: ev.total_score,
    }));

    const performanceData = evaluations.map((ev) => ({
        student: ev.student_details?.username,
        attendance: ev.attendance_score,
        performance: ev.performance_score,
        report: ev.report_score,
        total: ev.total_score,
    }));

    return (
        <Container fluid className="p-4">
            {message && <Alert variant={message.type} onClose={() => setMessage(null)} dismissible className="mb-4">
                {message.text}
            </Alert>}

            <Row className="mb-4">
                <Col>
                    <Card className='bg-info text-white p-3'>
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <h2>Academic Dashboard</h2>
                                <p>Welcome, {user?.username}|Role: {user?.role}</p>
                                {loading && <p>Loading data...</p>}
                            </div>
                            <Link to='/notifications'>
                            Notifications</Button>
                            </Link>
                        </div>
                    </Card>
                </Col>
            </Row>

            {stats && (
                <Row className="mb-4">
                    <Col md={4}>
                        <Card className='p-3 text-center bg-primary text-white'>
                            <h6>Assigned Students</h6>
                            <h3>{stats.totalStudents || 0}</h3>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Card className='p-3 text-center bg-success text-white'>
                            <h6>Total Evaluations</h6>
                            <h3>{stats.totalEvaluations || 0}</h3>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Card className='p-3 text-center bg-warning'>
                            <h6>Average Score</h6>
                            <h3>{stats.averageScore?.toFixed(2) || 'N/A'}</h3>
                        </Card>
                    </Col>
                </Row>
            )}

            <><Tab.Container defaultActiveKey='students'>
        <Card className='mb-4'>
            <Card.Header>
                <Nav variant='pills'>
                    <Nav.Item>
                        <Nav.Link eventKey='students'>My Students</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey='evaluations'>Evaluations</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey='performance'>Performance</Nav.Link>
                    </Nav.Item>
                </Nav>
            </Card.Header>

            <Card.Body>
                <Tab.Content>
                    <Tab.Pane eventKey='students'>
                        <div className='mb-3'>
                            <Button variant='success' onClick={() => setShowEvaluationModal(true)}>
                                Create Evaluation
                            </Button>
                        </div>
                        <Table striped bordered hover responsive>
                            <thead className='table-info'>
                                <tr>
                                    <th>Student</th>
                                    <th>Company</th>
                                    <th>Start Date</th>
                                    <th>End Date</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.length > 0 ? students.map((stu) => (
                                    <tr key={stu.id}>
                                        <td>{stu.student?.username || 'N/A'}</td>
                                        <td>{stu.company?.name || 'N/A'}</td>
                                        <td>{stu.start_date ? new Date(stu.start_date).toLocaleDateString() : 'N/A'}</td>
                                        <td>{stu.end_date ? new Date(stu.end_date).toLocaleDateString() : 'N/A'}</td>
                                        <td>
                                            <Badge bg='success'>Active</Badge>
                                        </td>
                                        <td>
                                            <Button variant='primary' size='sm' className='me-2' onClick={() => selectStudent(stu)}>
                                                View Details
                                            </Button>
                                            <Button variant='info' size='sm' onClick={() => {
                                                setNewEvaluation({
                                                    ...newEvaluation,
                                                    student: stu.student.id,
                                                });
                                                setShowEvaluationModal(true);
                                            } }>
                                                Evaluate
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                                    :
                                }
                                ): (
                                <tr>
                                    <td colSpan='6' className='text-center text muted'>
                                        No students assigned yet
                                    </td>
                                </tr>
                                )}
                            </tbody>
                        </Table>
                    </Tab.Pane>

                    <Tab.Pane eventKey='evaluations'>
                        <Table striped bordered hover responsive>
                            <thead className='table-success'>
                                <tr>
                                    <th>Student</th>
                                    <th>Attendance(40%)</th>
                                    <th>Performance(30%)</th>
                                    <th>Report(30%)</th>
                                    <th>Total Score</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {evaluations.length > 0 ? (
                                    evaluations.map((ev) => (
                                        <tr key={ev.id}>
                                            <td>{ev.student_details?.username || 'N/A'}</td>
                                            <td>{ev.attendance_score?.toFixed(2) || 'N/A'}</td>
                                            <td>{ev.performance_score?.toFixed(2) || 'N/A'}</td>
                                            <td>{ev.report_score?.toFixed(2) || 'N/A'}</td>
                                            <td>
                                                <strong>{ev.total_score?.toFixed(2) || 'N/A'}</strong>
                                            </td>
                                            <td>{ev.created_at ? new Date(ev.created_at).toLocaleDateString() : 'N/A'}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan='6' className='text-center text-muted'>
                                            No evaluations submitted yet
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </Tab.Pane>

                    <Tab.Pane eventKey='performance'>
                        <Row className='mb-4'>
                            <Col md={6}>
                                <Card className='p-4'>
                                    <h5>Score Trends</h5>
                                    <hr />
                                    {chartData.length > 0 ? (
                                        <ResponsiveContainer width='100%' height={300}>
                                            <LineChart data={chartData}>
                                                <CartesianGrid strokeDasharray='3 3' />
                                                <XAxis dataKey='student' />
                                                <YAxis domain={[0, 10]} />
                                                <Tooltip />
                                                <Line type='monotone' dataKey='score' stroke='#17a2b8' strokeWidth={3} />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <p className='text-center text-muted'>
                                            No evaluation data available
                                        </p>
                                    )}
                                </Card>
                            </Col>
                            <Col md={6}>
                                <Card className='p-4'>
                                    <h5>Performance Breakdown</h5>
                                    <hr />
                                    {performanceData.length > 0 ? (
                                        <ResponsiveContainer width='100%' height={300}>
                                            <BarChart data={performanceData}>
                                                <CartesianGrid strokeDasharray='3 3' />
                                                <XAxis dataKey='student' />
                                                <YAxis domain={[0, 10]} />
                                                <Tooltip />
                                                <Bar dataKey='attendance' fill='#28a745' />
                                                <Bar dataKey='performance' fill='#ffc107' />
                                                <Bar dataKey='report' fill='#dc3545' />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <p className='text-center text-muted'>
                                            No evaluation data available
                                        </p>
                                    )}
                                </Card>
                            </Col>
                        </Row>
                        <Card className='p-4'>
                            <h5>Performance Summary</h5>
                            <hr />
                            <Row>
                                <Col md={3}>
                                    <p>
                                        <strong>Evaluations Completed:</strong>{' '}
                                        <Badge bg='success'>{evaluations.length}</Badge>
                                    </p>
                                </Col>
                                <Col md={3}>
                                    <p>
                                        <strong>Students Evaluated:</strong>{' '}
                                        <Badge bg='info'>
                                            {new Set(evaluations.map((ev) => ev.student)).size}
                                        </Badge>
                                    </p>
                                </Col>
                                <Col md={3}>
                                    <p>
                                        <strong>Average Attendance:</strong>{' '}
                                        <Badge bg='primary'>
                                            {evaluations.length > 0
                                                ? (
                                                    evaluations.reduce((sum, e) => sum + e.attendance_score, 0
                                                    ) / evaluations.length
                                                ).toFixed(2)
                                                : 'N/A'}
                                        </Badge>
                                    </p>
                                </Col>
                                <Col md={3}>
                                    <p>
                                        <strong>Completion Rate:</strong>{' '}
                                        <Badge bg='warning'>
                                            {students.length > 0
                                                ? (
                                                    (evaluations.length / students.length) *
                                                    100
                                                ).toFixed(0) + '%'
                                                : '0%'}
                                        </Badge>
                                    </p>
                                </Col>
                            </Row>
                        </Card>
                    </Tab.Pane>
                </Tab.Content>
            </Card.Body>
        </Card>
    </Tab.Container><Modal show={showStudentDetails} onHide={() => setShowStudentDetails(false)} size='lg'>
            <Modal.Header closeButton>
                <Modal.Title>
                    Student Details: {selectedStudent?.student?.username}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {selectedStudent && (
                    <>
                        <Row className='mb-3'>
                            <Col md={6}>
                                <Card className='p-3'>
                                    <h6>Placement Information</h6>
                                    <hr />
                                    <p>
                                        <strong>Company:</strong>
                                        {selectedStudent.company_-name}
                                    </p>
                                    <p>
                                        <strong>Start Date:</strong>{' '}
                                        {new Date(selectedStudent.start_date).toLocaleDateString()}
                                    </p>
                                    <p>
                                        <strong>End Date:</strong>{' '}
                                        {new Date(selectedStudent.end_date).toLocaleDateString()}
                                    </p>
                                    <p>
                                        <strong>Placement Supervisor:</strong>{' '}
                                        {selectedStudent.supervisor_-name || 'Not Assigned'}
                                    </p>
                                </Card>
                            </Col>
                            <Col md={6}>
                                <Card className='p-3'>
                                    <h6>Weekly Logs</h6>
                                    <hr />
                                    {logs.length > 0 ? (
                                        <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                            {logs.map((log) => (
                                                <div key={log.id} className='mb-2 p-2 border rounded'>
                                                    <div className='d-flex justify-content-between'>
                                                        <strong>Week {log.week_number}</strong>
                                                        <Badge bg={
                                                            log.status === 'approved'
                                                                ? 'success'
                                                                : log.status === 'rejected'
                                                                ? 'danger'
                                                                : 'warning'
                                                        }
                                                        >
                                                            {log.status}
                                                        </Badge>
                                                    </div>
                                                    <p className='mb-1'>
                                                        <small>
                                                            <strong>Activities:</strong> {log.activities}
                                                        </small>
                                                    </p>
                                                    {log.supervisor_comment && (
                                                        <p className='mb-0'>
                                                            <small>
                                                                <strong>Supervisor Comment:</strong>{' '}
                                                                {log.supervisor_comment}
                                                            </small>
                                                        </p>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className='text-muted'>No logs submitted yet</p>
                                    )}
                                </Card>
                            </Col>
                        </Row>

                    </>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant='secondary' onClick={() => setShowStudentDetails(false)}>
                    Close
                </Button>
                <Button variant='success' onClick={() => {
                    setShowStudentDetails(false);
                    setNewEvaluationModal(true);
                }}
                >
                    Create Evaluation
                </Button>
            </Modal.Footer>
            </Modal>














        </></>
