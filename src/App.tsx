import { Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "./pages/auth/LoginPage";
import { DashboardPage } from "./pages/dashboard/DashboardPage";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { OrderPage } from "./pages/order/OrderPage";
import { ManagePage } from "./pages/manage/ManagePage";
import { ReportsPage } from "./pages/reports/ReportsPage";
import { UserSettingsPage } from "./pages/settings/UserSettingsPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
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
        path="/orders"
        element={
          <ProtectedRoute>
            <OrderPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/manage"
        element={
          <ProtectedRoute requiredRole="MANAGER">
            <ManagePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reports"
        element={
          <ProtectedRoute requiredRole="MANAGER">
            <ReportsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute requiredRole="MANAGER">
            <UserSettingsPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
