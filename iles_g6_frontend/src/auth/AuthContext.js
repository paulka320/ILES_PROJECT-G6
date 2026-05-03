import { createContext, useState } from "react";
import API from "../api/axios";


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);

    const login = async (username, password) => {

        const res = await API.post("users/login/", { username, password });

        localStorage.setItem("token", res.data.access);

        const userData = res.data.user;

        setUser(userData);

        return userData;

        
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