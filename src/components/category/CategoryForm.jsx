import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { categorySchema } from "@/validation/categorySchema";

const CategoryForm = ({
  defaultValues = {
    name: "",
  },
  onSubmit,
  loading = false,
}) => {
  const form = useForm({
    resolver: zodResolver(categorySchema),
    defaultValues,
  });

  const onInvalid = () => {
    toast.error("Please fix the highlighted fields.");
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit, onInvalid)}
      className="space-y-5"
    >
      <div className="space-y-2">
        <label htmlFor="category-name">
          Category Name
        </label>

        <Input
          id="category-name"
          placeholder="Enter category name"
          {...form.register("name")}
          disabled={loading}
        />

        {form.formState.errors.name && (
          <p className="text-sm text-destructive">
            {form.formState.errors.name.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={loading}
      >
        {loading ? "Saving..." : "Save"}
      </Button>
    </form>
  );
};

export default CategoryForm;