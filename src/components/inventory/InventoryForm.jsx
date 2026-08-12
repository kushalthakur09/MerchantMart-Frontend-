import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { inventorySchema } from "@/validation/inventorySchema";

const InventoryForm = ({
  defaultValues = {
    productId: "",
    quantity: "",
  },
  products = [],
  loading = false,
  onSubmit,
}) => {
  const form = useForm({
    resolver: zodResolver(inventorySchema),
    defaultValues,
  });

  const onInvalid = () => {
    toast.error(
      "Please fix the highlighted fields."
    );
  };

  return (
    <form
      onSubmit={form.handleSubmit(
        onSubmit,
        onInvalid
      )}
      className="space-y-5"
    >
      <div className="space-y-2">
        <label htmlFor="inventory-product">
          Product
        </label>

        <select
          id="inventory-product"
          {...form.register("productId")}
          disabled={loading}
          className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm"
        >
          <option value="">
            Select Product
          </option>

          {products.map((product) => (
            <option
              key={product.id}
              value={product.id}
            >
              {product.name} ({product.sku})
            </option>
          ))}
        </select>

        {form.formState.errors.productId && (
          <p className="text-sm text-destructive">
            {
              form.formState.errors.productId
                .message
            }
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="inventory-quantity">
          Quantity
        </label>

        <Input
          id="inventory-quantity"
          type="number"
          min="1"
          step="1"
          placeholder="Enter quantity"
          {...form.register("quantity")}
          disabled={loading}
        />

        {form.formState.errors.quantity && (
          <p className="text-sm text-destructive">
            {
              form.formState.errors.quantity
                .message
            }
          </p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={loading}
      >
        {loading ? "Saving..." : "Save Inventory"}
      </Button>
    </form>
  );
};

export default InventoryForm;