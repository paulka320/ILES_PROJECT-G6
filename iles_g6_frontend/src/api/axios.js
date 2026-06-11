import axios from "axios";

const API = axios.create({
    baseURL: process.env.REACT_APP_API_URL || "http://127.0.0.1:8000/api",
});

API.interceptors.request.use((req) => {
    // Don't add Authorization header for login requests
    if (!req.url.includes('/login/')) {
        const token = localStorage.getItem("token");
        if (token) {
            req.headers.Authorization = `Bearer ${token}`;
        }
    }
    return req;
});

export default API;