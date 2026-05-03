import API from "./axios";

export const getAllUsers = () => 
    API.get("users/admin/users/");

export const deleteUser = (id) =>
    API.delete(`users/admin/users/${id}/`);

export const updateUserRole = (id, role) =>
    API.patch(`users/admin/users/${id}/`, { role });

export const getAllPlacements = () => {
    console.log("API CALL:GET PLACEMENTS");
    API.get("internships/admin/placements/");
};
export const getAllLogs = () =>
    API.get("/logs/weeklylogs/");

export const deleteLog = (id) =>
    API.delete(`/logs/weeklylogs/${id}/`);

export const approveLog = (id) =>
    API.post(`/logs/weeklylogs/${id}/admin_approve/`);

export const rejectLog = (id) =>
    API.post(`/logs/weeklylogs/${id}/admin_reject/`);


export const getAllEvaluations = () =>
    API.get("/evaluations/evaluations/");

export const getAdminStats = () =>
    API.get("/users/admin/stats/");