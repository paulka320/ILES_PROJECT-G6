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
    const handleSubmit = async (e) => {
        e.preventDefault();
        await login (form.username, form.password);
        navigate("/dashboard");
    };
    return (
        <div>
            <h2>Login</h2>

            <form onSubmit= {handleSubmit}>
                <input 
                    placeholder = "Username"
                    onChange = {(e) => setForm({...form, username: e.target.value })}
                />
                <input
                    type = "password"
                    placeholder = "Password" 
                    onChange = { (e) => setForm({...form, password: e.target.value})}  
                />
                <button type = "submit">Login</button>
            </form>
        </div>
    );
};

export default Login;
