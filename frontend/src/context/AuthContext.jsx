import { createContext, useContext, useState } from "react";
import { login as apiLogin } from "../api"; // tu función de login

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null);
    const [email, setEmail] = useState("demo@dexter.com");
    const [password, setPassword] = useState("demo123");

    const login = async (email, password) => {
        const jwt = await apiLogin(email, password);
        setToken(jwt);
        return jwt;
    };

    const logout = () => setToken(null);

    return (
        <AuthContext.Provider value={{ token, login, logout, email, setEmail, password, setPassword }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);