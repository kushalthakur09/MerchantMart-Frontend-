import { NavLink } from "react-router-dom";

const SidebarItem = ({ icon: Icon, label, to }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
          isActive
            ? "bg-primary text-primary-foreground"
            : "hover:bg-accent hover:text-accent-foreground"
        }`
      }
    >
      <Icon size={20} />

      <span>{label}</span>
    </NavLink>
  );
};

export default SidebarItem;
