import { z } from "zod";

export const inventorySchema = z.object({
  productId: z.coerce
    .number()
    .positive("Product is required"),

  quantity: z.coerce
    .number()
    .int("Quantity must be a whole number")
    .positive("Quantity must be greater than zero"),
});