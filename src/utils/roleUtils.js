import { ROLES } from "@/constants/roles";

export const isAdmin = (role) => role === ROLES.ADMIN;

export const isStoreAdmin = (role) => role === ROLES.STORE_ADMIN;

export const isStoreManager = (role) => role === ROLES.STORE_MANAGER;

export const isBranchManager = (role) => role === ROLES.BRANCH_MANAGER;

export const isCashier = (role) => role === ROLES.BRANCH_CASHIER;