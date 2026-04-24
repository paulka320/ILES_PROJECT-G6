// src/pages/SupervisorDashboard.js
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../auth/AuthContext";
import API from "../api/axios";
import { Container, Row, Col, Card, Table, Badge } from "react-bootstrap";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const SupervisorDashboard = () => {
  const { user } = useContext(AuthContext);
