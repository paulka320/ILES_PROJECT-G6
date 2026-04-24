// importing libraries
import {userEffect, useState, useContext} from "react";
import {AuthContext} from "../auth/AuthContext";
import API from "../api/axios";
import {container, Row, Col, card, Table, Badge} from "react-bootstrap";
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer} from "recharts";

const AcademicDashboard = () =>{
  const{user} = useState([]);
  





