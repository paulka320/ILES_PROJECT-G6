import { createContext, useState } from "react";
import API from "../api/axios";


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);

    const login = async (credentials) => {
        const payload = {
            username: credentials.username,
            password: credentials.password,
        };

        console.log("Login attempt payload:", payload);

        try {
            const res = await API.post("/users/login/", payload);
            console.log("Login response:", res.data);
            localStorage.setItem("token", res.data.access);
            const userData = res.data.user;
            setUser(userData);
            return userData;
        } catch (err) {
            throw err;
        }

        
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