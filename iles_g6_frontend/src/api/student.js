import API from "./axios";

export const getStudentPlacement = () =>{
    return API.get("/internships/internshipplacement/");
};

export const getStudentLogs = () => {
    return API.get("/logs/weeklylogs/");
};

export const getStudentEvaluations = () => {
    return API.get("/evaluations/evaluations/");
};