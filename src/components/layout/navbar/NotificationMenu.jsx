import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotificationMenu = () => {
  return (
    <Button variant="ghost" size="icon" className="relative rounded-full">
      <Bell className="h-5 w-5" />

      <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
    </Button>
  );
};

export default NotificationMenu;
