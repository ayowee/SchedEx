// frontend/src/pages/Dashboard.jsx
import React from "react";
import { useAuth } from "../context/AuthContext";

function Dashboard() {
    const { user } = useAuth();

    if (!user) {
        return <div>You must be logged in to view this page.</div>;
    }

    return <h1>Welcome to the Dashboard, {user.name}!</h1>;
}

export default Dashboard;