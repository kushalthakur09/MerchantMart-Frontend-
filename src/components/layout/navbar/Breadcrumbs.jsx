import { ChevronRight } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const breadcrumbLabels = {
  dashboard: "Dashboard",
  store: "Store",
  stores: "Stores",
  "store-admins": "Store Admins",
  categories: "Categories",
  products: "Products",
  inventory: "Inventory",
  customers: "Customers",
  orders: "Orders",
  refunds: "Refunds",
  branches: "Branches",
  employees: "Employees",
  reports: "Reports",
  analytics: "Analytics",
  settings: "Settings",
  "shift-reports": "Shift Reports",
};

const Breadcrumbs = () => {
  const location = useLocation();

  const segments = location.pathname.split("/").filter(Boolean);

  const breadcrumbs = segments.map((segment, index) => ({
    label:
      breadcrumbLabels[segment] ||
      segment.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase()),

    path: "/" + segments.slice(0, index + 1).join("/"),
  }));

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <Link to="/dashboard" className="hover:text-foreground transition-colors">
        Dashboard
      </Link>

      {breadcrumbs
        .filter((breadcrumb) => breadcrumb.path !== "/dashboard")
        .map((breadcrumb) => (
          <div key={breadcrumb.path} className="flex items-center gap-2">
            <ChevronRight className="h-4 w-4" />

            <span className="font-medium text-foreground">
              {breadcrumb.label}
            </span>
          </div>
        ))}
    </div>
  );
};

export default Breadcrumbs;
