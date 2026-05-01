import API from "./axios";

export const getAllUsers = () => 
    API.get("/users/admin/users/");