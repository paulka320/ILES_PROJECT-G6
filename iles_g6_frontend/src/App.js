import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import { AuthProvider } from "./auth/AuthContext";

// Import pages/components
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AdminPlacements from "./pages/Adminplacements";

// Import protected route component (restricts access)
import StudentDashboard from "./pages/StudentDashboard";
import SupervisorDashboard from "./pages/SupervisorDashboard";
import AcademicDashboard from "./pages/AcademicDashboard";
import Notifications from "./pages/Notifications";

import ProtectedRoute from "./components/ProtectedRoute";
import 'bootstrap/dist/css/bootstrap.min.css';
function App() {
  return (
    // Provides authentication context to the entire app
    <AuthProvider>

      {/* Enables routing in the application */}
      <BrowserRouter>

        {/* Defines all application routes */}
        <Routes>

          {/* Public route (accessible without login) */}
          <Route path="/" element={<Login />} />

          {/* Protected route (requires authentication) */}
          <Route
            path="/dashboard."
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element = {
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/placements"
            element = {
              <ProtectedRoute>
                <AdminPlacements />
              </ProtectedRoute>
            }
          />

        <Route
          path="/student"
          element={
            <ProtectedRoute>
              <StudentDashboard />
            </ProtectedRoute>
          }
          />

        <Route
            path="/supervisor"
            element={
              <ProtectedRoute>
                <SupervisorDashboard />
              </ProtectedRoute>
            }
            />
          
          <Route
            path="/academic"
            element={
              <ProtectedRoute>
                <AcademicDashboard />
              </ProtectedRoute>
            }
            />
          
          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <Notifications />
              </ProtectedRoute>
            }
            />


        </Routes>

      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
