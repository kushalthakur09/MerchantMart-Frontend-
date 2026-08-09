import {
  LayoutDashboard,
  FolderTree,
  Package,
  ShoppingCart,
  Users,
  GitBranch,
  UserCog,
  Warehouse,
  Receipt,
  RotateCcw,
  Clock,
  BarChart3,
   UserPlus,
} from "lucide-react";

import { ROUTES } from "./routes";
import { ROLES } from "@/constants/roles";

export const sidebarConfig = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    to: ROUTES.DASHBOARD,
    roles: Object.values(ROLES),
  },
  {
  label: "Store Admins",
  icon: UserPlus,
  to: ROUTES.STORE_ADMINS,
  roles: [ROLES.ADMIN],
},
  {
    label: "Analytics",
    icon: BarChart3,
    to: ROUTES.ANALYTICS,
    roles: [
      ROLES.ADMIN,
      ROLES.STORE_ADMIN,
      ROLES.STORE_MANAGER,
      ROLES.BRANCH_MANAGER,
    ],
  },
  {
    label: "Branches",
    icon: GitBranch,
    to: ROUTES.BRANCHES,
    roles: [ROLES.STORE_ADMIN],
  },
  {
    label: "Employees",
    icon: UserCog,
    to: ROUTES.EMPLOYEES,
    roles: [ROLES.STORE_ADMIN],
  },
  {
    label: "Categories",
    icon: FolderTree,
    to: ROUTES.CATEGORIES,
    roles: [ROLES.STORE_ADMIN],
  },
  {
    label: "Products",
    icon: Package,
    to: ROUTES.PRODUCTS,
    roles: [ROLES.STORE_ADMIN],
  },
  {
    label: "Inventory",
    icon: Warehouse,
    to: ROUTES.INVENTORY,
    roles: [ROLES.STORE_ADMIN, ROLES.BRANCH_MANAGER],
  },
  {
    label: "Orders",
    icon: ShoppingCart,
    to: ROUTES.ORDERS,
    roles: [
      ROLES.STORE_ADMIN,
      ROLES.STORE_MANAGER,
      ROLES.BRANCH_MANAGER,
      ROLES.BRANCH_CASHIER,
    ],
  },
  {
    label: "Refunds",
    icon: RotateCcw,
    to: ROUTES.REFUNDS,
    roles: [
      ROLES.STORE_ADMIN,
      ROLES.STORE_MANAGER,
      ROLES.BRANCH_MANAGER,
      ROLES.BRANCH_CASHIER,
    ],
  },
  {
    label: "Customers",
    icon: Users,
    to: ROUTES.CUSTOMERS,
    roles: Object.values(ROLES),
  },
  {
    label: "Shift Reports",
    icon: Clock,
    to: ROUTES.SHIFT_REPORTS,
    roles: [
      ROLES.ADMIN,
      ROLES.STORE_ADMIN,
      ROLES.STORE_MANAGER,
      ROLES.BRANCH_MANAGER,
      ROLES.BRANCH_CASHIER,
    ],
  },
];
