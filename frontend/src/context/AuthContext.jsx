// frontend/src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const login = async (email, password) => {
        try {
            const response = await axios.post("/api/auth/login", { email, password });
            setUser(response.data.user);
        } catch (error) {
            console.error(error.response.data.message);
        }
    };

    const logout = async () => {
        await axios.get("/api/auth/logout");
        setUser(null);
    };

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await axios.get("/api/auth/current-user");
                setUser(response.data.user);
            // eslint-disable-next-line no-unused-vars
            } catch (error) {
                setUser(null);
            }
        };
        checkAuth();
    }, []);

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);