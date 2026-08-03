import { useRecoilState } from "recoil";

import { authState, defaultAuthState } from "@/recoil/atoms/authAtom";
import authService from "@/services/auth/authService";

const useAuth = () => {
  const [auth, setAuth] = useRecoilState(authState);

  const login = async (loginRequest) => {
    try {
      const response = await authService.login(loginRequest);

      setAuth({
        isAuthenticated: true,
        token: response.token,
        user: response.user,
        loading: false,
      });

      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));
      //   console.log(response.user);
      //   console.log(response.token);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setAuth(defaultAuthState);
  };

  return {
    ...auth,
    login,
    logout,
  };
};

export default useAuth;
