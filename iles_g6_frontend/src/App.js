
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

// Import authentication provider (wraps the app for global auth state)
import { AuthProvider } from "./auth/AuthContext";

// Import pages/components
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

// Import protected route component (restricts access)
import ProtectedRoute from "./components/ProtectedRoute";

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
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

        </Routes>

      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
