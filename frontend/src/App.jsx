// src/App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserDash from "./pages/UserDash";
import UserManagement from "./pages/UserManagement";
import ActiveUsers from "./pages/ActiveUsers";
import Ureports from "./pages/Ureports";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/UserDash" element={<UserDash />} />
        <Route path="/UserManagement" element={<UserManagement />} />
        <Route path="/ActiveUsers" element={<ActiveUsers />} />
        <Route path="/Ureports" element={<Ureports />} />
      </Routes>
    </Router>
  );
}

export default App;