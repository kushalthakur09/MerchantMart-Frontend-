import { sidebarConfig } from "@/config/sidebarConfig";
import SidebarItem from "./SidebarItem";

const SidebarNav = () => {
  return (
    <nav className="flex flex-col gap-1">
      {sidebarConfig.map((item) => (
        <SidebarItem
          key={item.to}
          {...item}
        />
      ))}
    </nav>
  );
};

export default SidebarNav;