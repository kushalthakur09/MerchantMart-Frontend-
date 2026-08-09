import { z } from "zod";

export const storeAdminSchema = z.object({
  fullUserName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name cannot exceed 100 characters"),

  email: z.email("Please enter a valid email address"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password cannot exceed 100 characters"),

  phoneNo: z
    .string()
    .regex(/^[0-9]{10}$/, "Phone number must contain exactly 10 digits"),
});