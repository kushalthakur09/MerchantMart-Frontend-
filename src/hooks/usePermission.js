import useAuth from "@/hooks/useAuth";
import { ROLE_PERMISSIONS } from "@/config/permissions";

const usePermission = () => {
  const { user } = useAuth();

  const hasPermission = (permission) => {
    if (!user?.role) {
      return false;
    }

    return ROLE_PERMISSIONS[user.role]?.includes(permission) ?? false;
  };

  return {
    hasPermission,
  };
};

export default usePermission;