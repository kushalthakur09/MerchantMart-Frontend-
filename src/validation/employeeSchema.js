import { z } from "zod";

export const employeeSchema = z
  .object({
    fullUserName: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name cannot exceed 100 characters"),

    email: z.email("Please enter a valid email address"),

    phoneNo: z
      .string()
      .regex(/^[0-9]{10}$/, "Phone number must contain exactly 10 digits"),

    password: z
      .string()
      .min(6, "Password must be at least 6 characters"),

    role: z.string().min(1, "Role is required"),

    branchId: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (
      (data.role === "ROLE_BRANCH_MANAGER" ||
        data.role === "ROLE_BRANCH_CASHIER") &&
      !data.branchId
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["branchId"],
        message: "Branch is required for this role",
      });
    }
  });