import Breadcrumbs from "./Breadcrumbs";
import NotificationMenu from "./NotificationMenu";
import ProfileMenu from "./ProfileMenu";
import NavSearchBar from "./NavbarSearch";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Menu } from "lucide-react";
import MobileSidebarTrigger from "./MobileSidebarTrigger";

const Navbar = () => {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-background px-6">
      <div className="flex items-center gap-2">
        <MobileSidebarTrigger />
        <SidebarTrigger className="hidden lg:flex" />
        <Breadcrumbs />
      </div>

      <div className="flex items-center gap-4">
        <NavSearchBar />
        <NotificationMenu />
        <ProfileMenu />
      </div>
    </header>
  );
};

export default Navbar;
