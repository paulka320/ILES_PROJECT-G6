import API from "./axios";

export const login = async (formData) => {
    const res = await API.post("/users/login/",formData);

    localStorage.setItem("token",res.data.access);

    return res.data.user;
};

export const requestPasswordReset = async (email) => {
    const res = await API.post("/users/request-password-reset/", { email });
    return res.data;
};

export const resetPassword = async (email, token, newPassword) => {
    const res = await API.post("/users/reset-password/", {
        email,
        token,
        new_password: newPassword
    });
    return res.data;
};