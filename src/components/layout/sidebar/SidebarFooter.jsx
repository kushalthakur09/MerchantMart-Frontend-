import { ThemeToggle } from "@/components/ui/theme-toggle";


const SidebarFooter = () => {
  return (
    <div className="mt-auto border-t pt-4">
      <div className="flex justify-center items-center gap-1">
        <span>Change Mode :</span>
        <ThemeToggle />
      </div>
    </div>
  );
};

export default SidebarFooter;