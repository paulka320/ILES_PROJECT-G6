import { useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { getStudentLogs, getStudentPlacement, getStudentEvaluations } from "../api/student";