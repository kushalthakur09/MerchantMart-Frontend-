import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { categorySchema } from "@/validation/categorySchema";

const CategoryForm = ({
  defaultValues = {
    name: "",
    description: "",
    status: "ACTIVE",
  },
  onSubmit,
  loading = false,
}) => {
  const form = useForm({
    resolver: zodResolver(categorySchema),
    defaultValues,
  });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-2">
        <label>Category Name</label>

        <Input placeholder="Enter category name" {...form.register("name")} />

        {form.formState.errors.name && (
          <p className="text-sm text-destructive">
            {form.formState.errors.name.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label>Description</label>

        <Input
          placeholder="Enter description"
          {...form.register("description")}
        />

        {form.formState.errors.description && (
          <p className="text-sm text-destructive">
            {form.formState.errors.description.message}
          </p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Saving..." : "Save"}
      </Button>
    </form>
  );
};

export default CategoryForm;
