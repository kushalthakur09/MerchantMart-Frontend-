import { PackageOpen } from "lucide-react";

const EmptyState = ({
  title = "No Data Found",
  description = "There is nothing to display.",
  icon: Icon = PackageOpen,
}) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
      <Icon size={48} className="mb-4 text-muted-foreground" />

      <h3 className="text-lg font-semibold">{title}</h3>

      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        {description}
      </p>
    </div>
  );
};

export default EmptyState;
    