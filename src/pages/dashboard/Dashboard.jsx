import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { toast } from "sonner";
import {
  Store,
  GitBranch,
  Users,
  UserCog,
  ShieldCheck,
  Clock,
  Ban,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import storeService from "@/services/store/storeService";
import branchService from "@/services/branch/branchService";
import employeeService from "@/services/employee/employeeService";
import useAuth from "@/hooks/useAuth";

const Dashboard = () => {
  const { user } = useAuth();

  const isSuperAdmin = user?.role === "ROLE_ADMIN";

  const [store, setStore] = useState(null);
  const [stores, setStores] = useState([]);
  const [branches, setBranches] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        /*
         * Super Admin does not belong to a store.
         * Therefore we only load stores for Super Admin.
         */
        if (isSuperAdmin) {
          const response = await storeService.getAllStores();

          setStores(response);
          setStore(null);
          setBranches([]);
          setEmployees([]);

          return;
        }

        /*
         * Store Admin dashboard
         */
        const storeResponse =
          await storeService.getStoreByAdmin();

        setStore(storeResponse);

        const [branchResponse, employeeResponse] =
          await Promise.all([
            branchService.getBranchesByStore(
              storeResponse.id
            ),
            employeeService.getStoreEmployees(
              storeResponse.id
            ),
          ]);

        setBranches(branchResponse);
        setEmployees(employeeResponse);
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            "Failed to load dashboard."
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [isSuperAdmin]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "linear",
          }}
          className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent"
        />
      </div>
    );
  }

  if (isSuperAdmin) {
    return <SuperAdminDashboard stores={stores} />;
  }

  return (
    <StoreAdminDashboard
      store={store}
      branches={branches}
      employees={employees}
    />
  );
};

/* =========================================================
   SUPER ADMIN DASHBOARD
========================================================= */

const SuperAdminDashboard = ({ stores }) => {
  const totalStores = stores.length;

  const activeStores = stores.filter(
    (store) => store.status === "ACTIVE"
  ).length;

  const pendingStores = stores.filter(
    (store) => store.status === "PENDING"
  ).length;

  const inactiveStores = stores.filter(
    (store) => store.status === "INACTIVE"
  ).length;

  const blockedStores = stores.filter(
    (store) => store.status === "BLOCKED"
  ).length;

  const stats = [
    {
      title: "Total Stores",
      value: totalStores,
      icon: Store,
      description: "All registered stores",
    },
    {
      title: "Active Stores",
      value: activeStores,
      icon: ShieldCheck,
      description: "Currently active",
    },
    {
      title: "Pending Stores",
      value: pendingStores,
      icon: Clock,
      description: "Awaiting activation",
    },
    {
      title: "Blocked Stores",
      value: blockedStores,
      icon: Ban,
      description: "Currently blocked",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}

      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl font-semibold tracking-tight">
          Dashboard
        </h1>

        <p className="mt-1 text-muted-foreground">
          Welcome back. Here's an overview of your stores.
        </p>
      </motion.div>

      {/* Stats */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;

          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.4,
                delay: index * 0.08,
              }}
              whileHover={{
                y: -4,
                transition: { duration: 0.2 },
              }}
            >
              <Card className="h-full transition-shadow hover:shadow-md">
                <CardContent className="flex items-center justify-between p-6">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {stat.title}
                    </p>

                    <p className="mt-2 text-2xl font-semibold">
                      {stat.value}
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      {stat.description}
                    </p>
                  </div>

                  <div className="rounded-xl bg-accent p-3">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Stores */}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.4,
          delay: 0.35,
        }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Stores</CardTitle>
          </CardHeader>

          <CardContent>
            {stores.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No stores have been created yet.
              </p>
            ) : (
              <div className="space-y-3">
                {stores.map((store, index) => (
                  <motion.div
                    key={store.id}
                    initial={{
                      opacity: 0,
                      x: -10,
                    }}
                    animate={{
                      opacity: 1,
                      x: 0,
                    }}
                    transition={{
                      duration: 0.3,
                      delay: index * 0.05,
                    }}
                    className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-accent/50"
                  >
                    <div>
                      <p className="font-medium">
                        {store.brand}
                      </p>

                      <p className="text-sm text-muted-foreground">
                        {store.storeType}
                      </p>
                    </div>

                    <StoreStatus status={store.status} />
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

/* =========================================================
   STORE ADMIN DASHBOARD
========================================================= */

const StoreAdminDashboard = ({
  store,
  branches,
  employees,
}) => {
  const storeManagers = employees.filter(
    (employee) =>
      employee.role === "ROLE_STORE_MANAGER"
  ).length;

  const branchManagers = employees.filter(
    (employee) =>
      employee.role === "ROLE_BRANCH_MANAGER"
  ).length;

  const branchCashiers = employees.filter(
    (employee) =>
      employee.role === "ROLE_BRANCH_CASHIER"
  ).length;

  const stats = [
    {
      title: "Store Status",
      value: store?.status || "N/A",
      icon: Store,
      description: "Current store status",
    },
    {
      title: "Branches",
      value: branches.length,
      icon: GitBranch,
      description: "Total branches",
    },
    {
      title: "Employees",
      value: employees.length,
      icon: Users,
      description: "Total store employees",
    },
    {
      title: "Store Managers",
      value: storeManagers,
      icon: UserCog,
      description: "Store managers",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}

      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl font-semibold tracking-tight">
          Dashboard
        </h1>

        <p className="mt-1 text-muted-foreground">
          Welcome back. Here's what's happening with your
          store.
        </p>
      </motion.div>

      {/* Stats */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;

          return (
            <motion.div
              key={stat.title}
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.4,
                delay: index * 0.08,
              }}
              whileHover={{
                y: -4,
                transition: {
                  duration: 0.2,
                },
              }}
            >
              <Card className="h-full transition-shadow hover:shadow-md">
                <CardContent className="flex items-center justify-between p-6">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {stat.title}
                    </p>

                    <p className="mt-2 text-2xl font-semibold">
                      {stat.value}
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      {stat.description}
                    </p>
                  </div>

                  <div className="rounded-xl bg-accent p-3">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Store Information */}

      <motion.div
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.4,
          delay: 0.35,
        }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Store Information</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <InfoItem
                label="Store Name"
                value={store?.brand || "N/A"}
              />

              <InfoItem
                label="Store Type"
                value={store?.storeType || "N/A"}
              />

              <InfoItem
                label="Status"
                value={store?.status || "N/A"}
                status
              />

              <InfoItem
                label="Description"
                value={
                  store?.description ||
                  "No description"
                }
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Employee Overview */}

      <motion.div
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.4,
          delay: 0.45,
        }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Employee Overview</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="grid gap-4 sm:grid-cols-3">
              <RoleCard
                icon={UserCog}
                title="Store Managers"
                value={storeManagers}
              />

              <RoleCard
                icon={ShieldCheck}
                title="Branch Managers"
                value={branchManagers}
              />

              <RoleCard
                icon={Users}
                title="Branch Cashiers"
                value={branchCashiers}
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Branch Overview */}

      <motion.div
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.4,
          delay: 0.55,
        }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Branches</CardTitle>
          </CardHeader>

          <CardContent>
            {branches.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No branches have been created yet.
              </p>
            ) : (
              <div className="space-y-3">
                {branches.map((branch, index) => (
                  <motion.div
                    key={branch.id}
                    initial={{
                      opacity: 0,
                      x: -10,
                    }}
                    animate={{
                      opacity: 1,
                      x: 0,
                    }}
                    transition={{
                      duration: 0.3,
                      delay: index * 0.05,
                    }}
                    className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-accent/50"
                  >
                    <div>
                      <p className="font-medium">
                        {branch.name}
                      </p>

                      <p className="text-sm text-muted-foreground">
                        {branch.address}
                      </p>
                    </div>

                    {branch.manager ? (
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {branch.manager.fullUserName}
                        </p>

                        <p className="text-xs text-muted-foreground">
                          Branch Manager
                        </p>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">
                        No manager assigned
                      </span>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

/* =========================================================
   SHARED COMPONENTS
========================================================= */

const StoreStatus = ({ status }) => {
  const statusStyles = {
    ACTIVE:
      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",

    PENDING:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",

    INACTIVE:
      "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",

    BLOCKED:
      "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-medium ${
        statusStyles[status] ||
        "bg-muted text-muted-foreground"
      }`}
    >
      {status || "UNKNOWN"}
    </span>
  );
};

const InfoItem = ({
  label,
  value,
  status = false,
}) => {
  return (
    <div>
      <p className="text-sm text-muted-foreground">
        {label}
      </p>

      {status ? (
        <StoreStatus status={value} />
      ) : (
        <p className="mt-1 font-medium">
          {value}
        </p>
      )}
    </div>
  );
};

const RoleCard = ({
  icon: Icon,
  title,
  value,
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="flex items-center gap-4 rounded-xl border p-5"
    >
      <div className="rounded-lg bg-accent p-3">
        <Icon className="h-5 w-5 text-primary" />
      </div>

      <div>
        <p className="text-sm text-muted-foreground">
          {title}
        </p>

        <p className="text-2xl font-semibold">
          {value}
        </p>
      </div>
    </motion.div>
  );
};

export default Dashboard;