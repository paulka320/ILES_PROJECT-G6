import API from "./axios";

export const login = async (formData) => {
    const res = await API.post("/users/login/",formData);

    localStorage.setItem("token",res.data.access);

    return res.data.user;
};