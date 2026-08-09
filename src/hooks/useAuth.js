import { useRecoilState } from "recoil";

import { authState, defaultAuthState } from "@/recoil/atoms/authAtom";
import authService from "@/services/auth/authService";

const useAuth = () => {
  const [auth, setAuth] = useRecoilState(authState);

  const setAuthenticatedUser = (response) => {
    setAuth({
      isAuthenticated: true,
      token: response.token,
      user: response.user,
      loading: false,
    });

    localStorage.setItem("token", response.token);
    localStorage.setItem("user", JSON.stringify(response.user));

    return response;
  };

  const login = async (loginRequest) => {
    const response = await authService.login(loginRequest);
    return setAuthenticatedUser(response);
  };

  const adminLogin = async (loginRequest) => {
    const response = await authService.adminLogin(loginRequest);
    return setAuthenticatedUser(response);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setAuth(defaultAuthState);
  };

  return {
    ...auth,
    login,
    adminLogin,
    logout,
  };
};

export default useAuth;