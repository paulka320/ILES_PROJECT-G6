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
        setEvaluations(evalRes.data);
      }catch (err){
        console.error("Error fetching academic dashboard:", err);
      }
    };
    fetchData();
  }, [user]);
      const chartData = evaluations.map((ev) =>({
       student: ev. student.username, score: ev.total_score,
    }));
  
  return(
    <Container Fluid className="p-4">
     <Row ClassName="mb-4">
       <Col>
        <Card className="bg-info text-white p-3">
           <h2>Welcome, {user.username}!</h2>
             <p>Role:{user.role}</p>
         </Card>
      </Col>
   </Row>
<Row className="mb-4">
  <Col>
     <Card className="p-3">
       <h4>Supervised Students</h4.
         <Table striped bordered hover responsive>
         <Thead>
       <tr>
     <th>Username</th>
    <th>Placement Company</th>
  </tr>
</thead>
       <tbody>
             {students.map((stu) =>(
               <tr key={stu.id}>
                <td>{stu.username}</td>
                <td>{stu.placement?.Company_name II "N/A"}
                 </tr>
                ))}
                </tbody>
              </Table?
            </Card>
          </Col>
        </Row>
                     
<Row>
    <Col>
    <Card clsaaName="p-3">
    <h4>Evaluation Scores</h4>
{chartData.length> 0? (
  <ResponseiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
         <CartesianGrid strokeDasharray="33"/>
          <XAxis dataKey="student"/>
         <YAxis/>
        <Tooltip/>
      <Line type="monotone" dataKey="score" stroke="#8884d8" strokeWidth={3}/>
   </LineChart>
  </ResponsiveContainer>
 ):(
   <p>No evalutions data yet</p>
   )}

 
  
                     
                     
                     



    
        
  





