import { Link } from "react-router-dom";

const SidebarLogo = () => {
  return (
    <Link to="/dashboard" className="flex items-center gap-2 px-2 py-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
        M
      </div>

      <div className="flex flex-col">
        <span className="font-semibold">[M]</span>
        <span className="text-xs text-muted-foreground">POS System</span>
      </div>
    </Link>
  );
};

export default SidebarLogo;
