import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import useAuth from "@/hooks/useAuth";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const ProfileMenu = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const fullName = user?.fullUserName || "User";
  const role = user?.role?.replace("ROLE_", "").replaceAll("_", " ") || "";

  const initials = fullName
    .split(" ")
    .map((name) => name[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-3 rounded-lg p-2 hover:bg-accent">
        <Avatar>
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>

        <div className="hidden text-left md:block">
          <p className="text-sm font-medium">{fullName}</p>
          <p className="text-xs text-muted-foreground">{role}</p>
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem>Profile</DropdownMenuItem>

        <DropdownMenuItem>Settings</DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileMenu;
