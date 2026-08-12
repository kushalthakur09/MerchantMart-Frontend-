import { z } from "zod";

export const productSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Product name is required")
      .max(
        150,
        "Product name cannot exceed 150 characters"
      ),

    sku: z
      .string()
      .trim()
      .min(1, "SKU is required")
      .max(
        50,
        "SKU cannot exceed 50 characters"
      ),

    description: z
      .string()
      .trim()
      .max(
        500,
        "Description cannot exceed 500 characters"
      )
      .optional()
      .or(z.literal("")),

    mrp: z.coerce
      .number()
      .positive("MRP must be greater than zero"),

    sellingPrice: z.coerce
      .number()
      .positive(
        "Selling price must be greater than zero"
      ),

    brand: z
      .string()
      .trim()
      .max(
        100,
        "Brand cannot exceed 100 characters"
      )
      .optional()
      .or(z.literal("")),

    image: z
      .string()
      .trim()
      .max(
        500,
        "Image URL cannot exceed 500 characters"
      )
      .optional()
      .or(z.literal("")),

    categoryId: z.coerce
      .number()
      .positive("Category is required"),
  })
  .refine(
    (data) => data.sellingPrice <= data.mrp,
    {
      message:
        "Selling price cannot be greater than MRP.",
      path: ["sellingPrice"],
    }
  );