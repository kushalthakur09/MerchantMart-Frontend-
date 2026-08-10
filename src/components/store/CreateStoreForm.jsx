import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { storeSchema } from "@/validation/storeSchema";
import storeService from "@/services/store/storeService";

const CreateStoreForm = ({ onSuccess }) => {
  const form = useForm({
    resolver: zodResolver(storeSchema),
    defaultValues: {
      brand: "",
      storeType: "",
      description: "",
      contact: {
        address: "",
        email: "",
        phone: "",
      },
    },
  });

  const onSubmit = async (data) => {
    try {
      const response = await storeService.createStore(data);

      form.reset();
      onSuccess?.(response);
    } catch (error) {
      console.error(error.response?.data || error.message);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-2">
        <label htmlFor="brand">Store Name</label>
        <Input
          id="brand"
          placeholder="Enter Store name"
          {...form.register("brand")}
        />

        {form.formState.errors.brand && (
          <p className="text-sm text-destructive">
            {form.formState.errors.brand.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="storeType">Store Type</label>
        <Input
          id="storeType"
          placeholder="e.g. Grocery, Electronics"
          {...form.register("storeType")}
        />

        {form.formState.errors.storeType && (
          <p className="text-sm text-destructive">
            {form.formState.errors.storeType.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="description">Description</label>
        <Input
          id="description"
          placeholder="Enter store description"
          {...form.register("description")}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="address">Address</label>
        <Input
          id="address"
          placeholder="Enter store address"
          {...form.register("contact.address")}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="phone">Store Phone</label>
        <Input
          id="phone"
          placeholder="Enter store phone"
          {...form.register("contact.phone")}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="contactEmail">Store Email</label>
        <Input
          id="contactEmail"
          type="email"
          placeholder="Enter store email"
          {...form.register("contact.email")}
        />
      </div>

      <Button type="submit" className="w-full">
        Create Store
      </Button>
    </form>
  );
};

export default CreateStoreForm;
