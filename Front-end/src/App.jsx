import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { LoginPage } from "./pages/LoginPage"
import { DashboardPage } from "./pages/DashboardPage"
import { UsersPage } from "./pages/UsersPage"
import { RolesPage } from "./pages/RolesPage"
import { SettingsPage } from "./pages/SettingsPage"
import { ProtectedRoute } from "./components/ProtectedRoute"
import "./App.css"

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/users"
            element={
              <ProtectedRoute requiredRoles={["admin", "manager"]}>
                <UsersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/roles"
            element={
              <ProtectedRoute requiredRoles={["admin"]}>
                <RolesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/settings"
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
