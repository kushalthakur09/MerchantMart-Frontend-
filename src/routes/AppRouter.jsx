import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import AppLayout from "@/layouts/AppLayout";
import AuthLayout from "@/layouts/AuthLayout";
import ProtectedRoute from "@/routes/ProtectedRoute";
import RoleProtectedRoute from "@/routes/RoleProtectedRoute";

import Login from "@/components/auth/Login";

import Dashboard from "@/pages/dashboard/Dashboard";
import NotFound from "@/pages/NotFound";
import Category from "@/pages/category/Category";
import Product from "@/pages/product/Product";
import Inventory from "@/pages/inventory/Inventory";
import Analytics from "@/pages/analytics/Analytics";
import StoreAdmins from "@/pages/store-admin/StoreAdmins";
import Store from "@/pages/store/Store";
import Stores from "@/pages/store/Stores";
import Branches from "@/pages/branch/Branches";
import Employees from "@/pages/employee/Employees";
import Profile from "@/pages/profile/Profile";

import { ROLES } from "@/constants/roles";
import { ROUTES } from "@/config/routes";

export default function AppRouter() {
  return (
    <Router>
      <Routes>
        {/* Auth */}
        <Route element={<AuthLayout />}>
          <Route path={ROUTES.LOGIN} element={<Login />} />

          <Route path="/admin-login" element={<Login isAdminLogin />} />

          <Route path="/" element={<Navigate to={ROUTES.LOGIN} replace />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />

            <Route path="/profile" element={<Profile />} />

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
              <Route path={ROUTES.ANALYTICS} element={<Analytics />} />

              <Route path={ROUTES.CATEGORIES} element={<Category />} />

              <Route path={ROUTES.PRODUCTS} element={<Product />} />

            </Route>

            {/* Admin */}
            <Route
              element={<RoleProtectedRoute allowedRoles={[ROLES.ADMIN]} />}
            >
              <Route path={ROUTES.STORE_ADMINS} element={<StoreAdmins />} />

              <Route path={ROUTES.STORES} element={<Stores />} />
            </Route>

            {/* Store Admin */}
            <Route
              element={
                <RoleProtectedRoute allowedRoles={[ROLES.STORE_ADMIN]} />
              }
            >
              <Route path={ROUTES.STORE} element={<Store />} />
            </Route>

            {/* Branch Manager */}
            <Route element={<RoleProtectedRoute allowedRoles={[ROLES.BRANCH_MANAGER]} />}>
              <Route path={ROUTES.INVENTORY} element={<Inventory />} />
            </Route>

            {/* Branches */}
            <Route
              element={
                <RoleProtectedRoute
                  allowedRoles={[
                    ROLES.STORE_ADMIN,
                    ROLES.STORE_MANAGER,
                    ROLES.BRANCH_MANAGER,
                  ]}
                />
              }
            >
              <Route path={ROUTES.BRANCHES} element={<Branches />} />
            </Route>

            {/* Employees */}
            <Route
              element={
                <RoleProtectedRoute
                  allowedRoles={[
                    ROLES.STORE_ADMIN,
                    ROLES.STORE_MANAGER,
                    ROLES.BRANCH_MANAGER,
                  ]}
                />
              }
            >
              <Route path={ROUTES.EMPLOYEES} element={<Employees />} />
            </Route>
          </Route>
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
