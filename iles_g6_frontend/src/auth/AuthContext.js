import { createContext, useState } from "react";
import API from "../api/axios";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const login = async (username, password) => {
        const res = await API. post("users/login/", { username, password });

        localStorage.setItem("token", res.data.access);

        setUser({
            id:res.data.id,
            username:res.data.username,
            role:res.data.role
        });
    };
    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};