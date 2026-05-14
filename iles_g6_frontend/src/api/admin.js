import API from "./axios";

export const getAllUsers = () => 
    API.get("users/admin/users/");

export const deleteUser = (id) =>
    API.delete(`users/admin/users/${id}/`);

export const updateUserRole = (id, role) =>
    API.patch(`users/admin/users/${id}/`, { role });

export const getAllPlacements = () => {
    console.log("API CALL:GET PLACEMENTS");
    return API.get("internships/admin/placements/");
};

export const assignSupervisor = (placementId, supervisorId) =>
    API.post(`internships/admin/placements/${placementId}/assign_academic_supervisor/`, {
        supervisor_id:supervisorId,
    });

export const assignAcademicSupervisor = (placementId,academicId) =>
    API.post(`internships/admin/placements/${placementId}/assign_academic_supervisor/`,{
        academic_id:academicId,
    });

export const createPlacement = (placementData) =>
    API.post("internships/admin/placements/create_placement/",placementData);


export const getAllLogs = () =>
    API.get("logs/weeklylogs/");

export const deleteLog = (id) =>
    API.delete(`logs/weeklylogs/${id}/`);

export const approveLog = (id) =>
    API.post(`logs/weeklylogs/${id}/admin_approve/`);

export const rejectLog = (id) =>
    API.post(`logs/weeklylogs/${id}/admin_reject/`);


export const getAllEvaluations = () =>
    API.get("evaluations/admin/evaluations/");

export const getAdminStats = () =>
    API.get("users/admin/stats/");