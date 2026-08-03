import { useEffect } from "react";
import { useSetRecoilState } from "recoil";

import { authState } from "@/recoil/atoms/authAtom";

const AuthInitializer = ({ children }) => {
  const setAuth = useSetRecoilState(authState);

 useEffect(() => {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");

  if (token && user) {
    setAuth({
      isAuthenticated: true,
      token,
      user: JSON.parse(user),
      loading: false,
    });
  } else {
    setAuth((prev) => ({
      ...prev,
      loading: false,
    }));
  }
}, [setAuth]);

  return children;
};

export default AuthInitializer;
