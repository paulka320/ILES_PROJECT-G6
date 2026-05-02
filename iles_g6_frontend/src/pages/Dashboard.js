import { useContext } from "react";
import { AuthContext } from "../auth/AuthContext";

import StudentDashboard from "./StudentDashboard";
import SupervisorDashboard from "./SupervisorDashboard";
import AcademicDashboard from "./AcademicDashboard";
import AdminDashboard from "./AdminDashboard";

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  if (!user) return <p>Loading...</p>;

  switch (user.role) {
    case "student":
      return <StudentDashboard/>;
    case "supervisor":
