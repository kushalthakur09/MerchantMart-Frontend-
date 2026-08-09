import usePermission from "@/hooks/usePermission";

const PermissionGate = ({ permission, children, fallback = null }) => {
  const { hasPermission } = usePermission();

  if (!hasPermission(permission)) {
    return fallback;
  }

  return children;
};

export default PermissionGate;