import { Menu } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";

const MobileSidebarTrigger = () => {
  const { toggleSidebar } = useSidebar();

  return (
    <div className="lg:hidden">
      <button
        onClick={toggleSidebar}
        className="lg:hidden rounded-md p-2 hover:bg-accent"
      >
        <Menu className="h-5 w-5" />
      </button>
    </div>
  );
};

export default MobileSidebarTrigger;
