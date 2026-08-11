import { z } from "zod";

export const branchSchema = z.object({
  name: z
    .string()
    .min(2, "Branch name must be at least 2 characters")
    .max(100, "Branch name cannot exceed 100 characters"),

  address: z
    .string()
    .min(2, "Address is required")
    .max(255, "Address cannot exceed 255 characters"),

  phoneNo: z
    .string()
    .regex(/^[0-9]{10}$/, "Phone number must contain exactly 10 digits"),

  email: z
    .email("Please enter a valid email address")
    .optional()
    .or(z.literal("")),

  workingDays: z.array(z.string()).optional(),

  openTime: z.string().optional(),

  closeTime: z.string().optional(),

  managerId: z.string().optional(),
});