import { useState, useEffect } from "react";
import { AuthContext } from  "../auth/AuthContext";
import {useNavigate} from "react-router-dom";

const Login = () => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const [form, setForm] = useState ({
        username: "",
        password: "",
    });
}