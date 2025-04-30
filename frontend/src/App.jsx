// src/App.js\\
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';

// Ayomal

// Upendra

// Hima
import UserDash from "./pages/UserManagement/UserDash";
import UserManagement from "./pages/UserManagement/UserManagementPage";
import ActiveUsers from "./pages/UserManagement/ActiveUsers";
import Ureports from "./pages/UserManagement/Ureports";

// Sithum
import PresentationManagementPage from "./pages/PresentationManagement/PresentationManagementPage";
import AdminDashboard from './pages/PresentationManagement/AdminDashboard';
import Calendar from './pages/PresentationManagement/Calendar';
import AdminLayout from './layouts/AdminLayout';
import HomePage from './pages/Home/HomePage';

// Auth Pages
import LoginPage from './pages/Auth/LoginPage';
import SignupPage from './pages/Auth/SignupPage';

// Examiner Availability Management
import AvailabilityView from './pages/AvailabilityManagement/AvailabilityView';

function App() {
  return (
    <HelmetProvider>
      <Router>
        <Routes>
          {/* Combined Routes */}
          <Route path="/" element={<HomePage />} />
          
          {/* Auth Routes */}
          <Route path="/user/login" element={<LoginPage />} />
          <Route path="/user/signup" element={<SignupPage />} />

          {/* User Management - Modernized, best-practice routes */}
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/admin/users/active" element={<ActiveUsers />} />
          <Route path="/admin/users/dashboard" element={<UserDash />} />
          <Route path="/admin/users/reports" element={<Ureports />} />

          {/* Sithum */}
          <Route path="/admin" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
          <Route path="/admin/presentations" element={<AdminLayout><PresentationManagementPage /></AdminLayout>} />
          <Route path="/admin/schedular" element={<AdminLayout><Calendar /></AdminLayout>} />
          <Route path="/admin/availability" element={<AvailabilityView />} />
        </Routes>
      </Router>
    </HelmetProvider>
  );
}

export default App;