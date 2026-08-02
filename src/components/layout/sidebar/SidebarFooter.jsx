import { LogOut } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const SidebarFooter = () => {
  return (
    <div className="mt-auto border-t pt-4">
      <div className="flex justify-center">
        <ThemeToggle />
      </div>

      <button className="mt-4 flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-accent">
        <LogOut size={20} />
        <span>Logout</span>
      </button>
    </div>
  );
};

export default SidebarFooter;
