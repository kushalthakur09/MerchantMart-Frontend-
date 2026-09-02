import useAuth from "@/hooks/useAuth";

import SuperAdminDashboard from "./SuperAdminDashboard";
import StoreAdminDashboard from "./StoreAdminDashboard";
import StoreManagerDashboard from "./StoreManagerDashboard";
import BranchManagerDashboard from "./BranchManagerDashboard";
import BranchCashierDashboard from "./BranchCashierDashboard";

const Dashboard = () => {
  const { user } = useAuth();

  switch (user?.role) {
    case "ROLE_ADMIN":
      return <SuperAdminDashboard />;

    case "ROLE_STORE_ADMIN":
      return <StoreAdminDashboard />;

    case "ROLE_STORE_MANAGER":
      return <StoreManagerDashboard />;

    case "ROLE_BRANCH_MANAGER":
      return <BranchManagerDashboard />;

    case "ROLE_BRANCH_CASHIER":
      return <BranchCashierDashboard />;

    default:
      return (
        <div className="p-6">
          <h1 className="text-xl font-semibold">
            Dashboard
          </h1>

          <p className="mt-2 text-muted-foreground">
            Unable to determine your dashboard.
          </p>
        </div>
      );
  }
};

export default Dashboard;