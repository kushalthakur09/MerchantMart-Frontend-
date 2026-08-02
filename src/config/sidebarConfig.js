import { LayoutDashboard, Package, ShoppingCart, Users } from "lucide-react";

import { ROUTES } from "./routes";

export const sidebarConfig = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    to: ROUTES.DASHBOARD,
  },
  {
    label: "Products",
    icon: Package,
    to: ROUTES.PRODUCTS,
  },
  {
    label: "Orders",
    icon: ShoppingCart,
    to: ROUTES.ORDERS,
  },
  {
    label: "Customers",
    icon: Users,
    to: ROUTES.CUSTOMERS,
  },
];
