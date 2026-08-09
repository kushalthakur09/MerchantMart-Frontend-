import { sidebarConfig } from "@/config/sidebarConfig";
import SidebarItem from "./SidebarItem";
import useAuth from "@/hooks/useAuth";

const SidebarNav = () => {
  const { user } = useAuth();

  const visibleItems = sidebarConfig.filter((item) =>
    item.roles.includes(user?.role)
  );

  return (
    <nav className="flex flex-col gap-1">
      {visibleItems.map((item) => (
        <SidebarItem
          key={item.to}
          {...item}
        />
      ))}
    </nav>
  );
};

export default SidebarNav;