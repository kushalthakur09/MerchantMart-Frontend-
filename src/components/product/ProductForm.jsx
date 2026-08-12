import { useEffect, useState } from "react";
import useAuth from "@/hooks/useAuth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import categoryService from "@/services/category/categoryService";
import { productSchema } from "@/validation/productSchema";

const ProductForm = ({
  defaultValues = {
    name: "",
    sku: "",
    description: "",
    mrp: "",
    sellingPrice: "",
    brand: "",
    image: "",
    categoryId: "",
  },
  onSubmit,
  loading = false,
}) => {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const form = useForm({
    resolver: zodResolver(productSchema),
    defaultValues,
  });

  useEffect(() => {
  const loadCategories = async () => {
    if (!user?.storeId) {
      setLoadingCategories(false);
      return;
    }

    try {
      const response =
        await categoryService.getByStore(
          user.storeId
        );

      setCategories(response);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to load categories."
      );
    } finally {
      setLoadingCategories(false);
    }
  };

  loadCategories();
}, [user?.storeId]);

  const onInvalid = () => {
    toast.error("Please fix the highlighted fields.");
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit, onInvalid)}
      className="space-y-5"
    >
      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="product-name">Product Name</label>

          <Input
            id="product-name"
            placeholder="Enter product name"
            {...form.register("name")}
            disabled={loading}
          />

          {form.formState.errors.name && (
            <p className="text-sm text-destructive">
              {form.formState.errors.name.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="product-sku">SKU</label>

          <Input
            id="product-sku"
            placeholder="Enter SKU"
            {...form.register("sku")}
            disabled={loading}
          />

          {form.formState.errors.sku && (
            <p className="text-sm text-destructive">
              {form.formState.errors.sku.message}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="product-description">Description</label>

        <Input
          id="product-description"
          placeholder="Enter product description"
          {...form.register("description")}
          disabled={loading}
        />

        {form.formState.errors.description && (
          <p className="text-sm text-destructive">
            {form.formState.errors.description.message}
          </p>
        )}
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="product-mrp">MRP</label>

          <Input
            id="product-mrp"
            type="number"
            step="0.01"
            placeholder="Enter MRP"
            {...form.register("mrp")}
            disabled={loading}
          />

          {form.formState.errors.mrp && (
            <p className="text-sm text-destructive">
              {form.formState.errors.mrp.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="product-selling-price">Selling Price</label>

          <Input
            id="product-selling-price"
            type="number"
            step="0.01"
            placeholder="Enter selling price"
            {...form.register("sellingPrice")}
            disabled={loading}
          />

          {form.formState.errors.sellingPrice && (
            <p className="text-sm text-destructive">
              {form.formState.errors.sellingPrice.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="product-brand">Brand</label>

          <Input
            id="product-brand"
            placeholder="Enter brand"
            {...form.register("brand")}
            disabled={loading}
          />

          {form.formState.errors.brand && (
            <p className="text-sm text-destructive">
              {form.formState.errors.brand.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="product-category">Category</label>

          <select
            id="product-category"
            {...form.register("categoryId")}
            disabled={loading || loadingCategories}
            className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm"
          >
            <option value="">
              {loadingCategories ? "Loading categories..." : "Select Category"}
            </option>

            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          {form.formState.errors.categoryId && (
            <p className="text-sm text-destructive">
              {form.formState.errors.categoryId.message}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="product-image">Image URL</label>

        <Input
          id="product-image"
          placeholder="Enter image URL"
          {...form.register("image")}
          disabled={loading}
        />

        {form.formState.errors.image && (
          <p className="text-sm text-destructive">
            {form.formState.errors.image.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={loading || loadingCategories}
      >
        {loading ? "Saving..." : "Save Product"}
      </Button>
    </form>
  );
};

export default ProductForm;
