import API from "./axios";

export const getAllUsers = () => 
    API.get("/users/admin/users/");

export const deleteUser = (id) =>
    API.delete(`/users/admin/users/${id}/`);