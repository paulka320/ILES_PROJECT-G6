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




              
                    <Card className="bg-primary text-white p-3">
                        <h2>Welcome, {user.username}</h2>
                        <p>Role: {user.role}</p>
                    </Card>
                </Col>
            </Row>

            {placement && (
                <Row className="mb-4">
                    <Col>
                        <Card className="p-3">
                            <h4>Placement Information</h4>
                            <p><strong>Company:</strong> {placement.company_name}</p>
                            <p><strong>Start Date:</strong> {placement.start_date}</p>
                            <p><strong>End Date:</strong> {placement.end_date}</p>

                        </Card>
                    </Col>
                </Row>
            )}

            <Row className="mb-4">
                <Col md={4}>
                    <Card className="text-center p-3">
                        <h5>Total Logs</h5>
                        <h2>{totalLogs}</h2>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="text-center p-3">
                        <h5>Submitted Logs</h5>
                        <h2>{submittedLogs}</h2>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="text-center p-3">
                        <h5>Average Score</h5>
                        <h2>{avgScore}</h2>
                    </Card>
                </Col>
            </Row>

            <Row className="mb-4">
                <Col>
                    <Card className="p-3">
                        <h4>Weekly Logs</h4>
                        <Table striped bordered hover responsive>
                            <thead>
                                <tr>
                                    <th>Week</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {logs.map((log) => (
                                    <tr key={log.id}>

                                        <td>{log.week}</td>
                                        <td>
                                            <Badge bg={log.status === "submitted" ? "success" : "warning"}>
                                                {log.status}
                                            </Badge>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Card>
                </Col>
            </Row>

            <Row>
                <Col>
                    <Card className="p-3">
                        <h4>Evaluation Scores Over Weeks</h4>
                        {chartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="week" label={{ value: "Week", position: "insideBottomRight", offset: 0 }} />
                                    <YAxis label={{ value: "Score", angle: -90, position: "insideLeft" }} />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="score" stroke="#8884d8" strokeWidth={3} />
                                </LineChart>
                            </ResponsiveContainer>
                        ) : (
                            <p>No evaluation data yet</p>
                        )}
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default StudentDashboard;
                            




        




