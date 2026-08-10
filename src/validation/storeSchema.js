import { z } from "zod";

export const storeSchema = z.object({
  brand: z
    .string()
    .min(2, "Brand name must be at least 2 characters")
    .max(100, "Brand name cannot exceed 100 characters"),

  storeType: z
    .string()
    .min(2, "Store type is required")
    .max(100, "Store type cannot exceed 100 characters"),

  description: z
    .string()
    .max(255, "Description cannot exceed 255 characters")
    .optional(),

  contact: z.object({
    address: z.string().optional(),
    email: z.email("Please enter a valid email address").optional(),
    phone: z.string().optional(),
  }),
});