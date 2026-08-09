import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import AppLayout from "@/layouts/AppLayout";
import AuthLayout from "@/layouts/AuthLayout";
import ProtectedRoute from "@/routes/ProtectedRoute";

import Login from "@/components/auth/Login";
import Dashboard from "@/pages/dashboard/Dashboard";
import NotFound from "@/pages/NotFound";
import Category from "@/pages/category/Category";
import RoleProtectedRoute from "@/routes/RoleProtectedRoute";
import Analytics from "@/pages/analytics/Analytics";
import StoreAdmins from "@/pages/store-admin/StoreAdmins";

import { ROLES } from "@/constants/roles";

export default function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin-login" element={<Login isAdminLogin />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route
              element={
                <RoleProtectedRoute
                  allowedRoles={[
                    ROLES.ADMIN,
                    ROLES.STORE_ADMIN,
                    ROLES.STORE_MANAGER,
                    ROLES.BRANCH_MANAGER,
                  ]}
                />
              }
            >
              <Route path="/analytics" element={<Analytics />} />

              <Route path="/categories" element={<Category />} />
            </Route>

            <Route
              element={<RoleProtectedRoute allowedRoles={[ROLES.ADMIN]} />}
            >
              <Route path="/store-admins" element={<StoreAdmins />} />
            </Route>
          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
