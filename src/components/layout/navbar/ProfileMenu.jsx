import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useNavigate } from "react-router-dom";
import {
  ChevronDown,
  LogOut,
  Settings,
  User,
} from "lucide-react";

import useAuth from "@/hooks/useAuth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const ProfileMenu = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const fullName = user?.fullUserName || "User";

  const role =
    user?.role
      ?.replace("ROLE_", "")
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase()) || "";

  const initials = fullName
    .split(" ")
    .filter(Boolean)
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
      <DropdownMenuTrigger
        className="
          flex items-center gap-2 rounded-lg px-2 py-1.5
          transition-colors
          hover:bg-accent
          focus-visible:outline-none
          focus-visible:ring-2
          focus-visible:ring-ring
        "
      >
        <Avatar className="h-9 w-9">
          <AvatarFallback className="bg-primary text-primary-foreground">
            {initials}
          </AvatarFallback>
        </Avatar>

        <div className="hidden text-left sm:block">
          <p className="max-w-32 truncate text-sm font-medium">
            {fullName}
          </p>

          <p className="text-xs text-muted-foreground">
            {role}
          </p>
        </div>

        <ChevronDown className="hidden h-4 w-4 text-muted-foreground sm:block" />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-60"
      >
        {/* User information */}
        <div className="flex items-center gap-3 px-3 py-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-primary text-primary-foreground">
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0">
            <p className="truncate text-sm font-medium">
              {fullName}
            </p>

            <p className="truncate text-xs text-muted-foreground">
              {role}
            </p>

            <p className="mt-0.5 truncate text-xs text-muted-foreground">
              {user?.email}
            </p>
          </div>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={() => navigate("/profile")}>
          <User className="mr-2 h-4 w-4" />
          Profile
        </DropdownMenuItem>

        <DropdownMenuItem>
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleLogout}
          className="text-destructive focus:text-destructive"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileMenu;