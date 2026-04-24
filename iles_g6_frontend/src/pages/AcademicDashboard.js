// importing libraries
import {userEffect, useState, useContext} from "react";
import {AuthContext} from "../auth/AuthContext";
import API from "../api/axios";
import {container, Row, Col, card, Table, Badge} from "react-bootstrap";
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer} from "recharts";

const AcademicDashboard = () =>{
  const{user} = useContext(AuthContext);
  const [students, setStudents] =useState([]);
  const [evalutions, setEvalutions] =useState([]);

  useEffect(() =>{
    const fetchData =async() =>{
      try{
        const studentsRes = await API.get(internship/academic/${user.id}/students/);
        setStudents(studentsRes.data);
        
        const evalRes = await API.get(evalutions/);
        
  





