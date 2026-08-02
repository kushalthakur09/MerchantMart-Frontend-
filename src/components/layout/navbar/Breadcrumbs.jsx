import { ChevronRight } from "lucide-react";

const Breadcrumbs = () => {
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <span>Dashboard</span>
      <ChevronRight className="h-4 w-4" />
      <span className="font-medium text-foreground">Home</span>
    </div>
  );
};

export default Breadcrumbs;