import { atom } from "recoil";

export const defaultAuthState = {
  isAuthenticated: false,
  token: null,
  user: null,
  loading: true,
};

export const authState = atom({
  key: "authState",
  default: defaultAuthState,
});
