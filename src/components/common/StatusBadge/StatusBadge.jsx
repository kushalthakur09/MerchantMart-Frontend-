import { Badge } from "@/components/ui/badge";

const StatusBadge = ({ status }) => {
  const variants = {
    ACTIVE: "default",
    INACTIVE: "secondary",
    PENDING: "outline",
    DELETED: "destructive",
  };

  return <Badge variant={variants[status] || "secondary"}>{status}</Badge>;
};

export default StatusBadge;
