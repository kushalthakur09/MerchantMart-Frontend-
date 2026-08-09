import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { storeAdminSchema } from "@/validation/employeeSchema";
import employeeService from "@/services/employee/employeeService";

const CreateStoreAdminForm = ({ onSuccess }) => {
  const form = useForm({
    resolver: zodResolver(storeAdminSchema),
    defaultValues: {
      fullUserName: "",
      email: "",
      password: "",
      phoneNo: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      const response = await employeeService.createStoreAdmin(data);

      form.reset();
      onSuccess?.(response);
    } catch (error) {
      console.error(error.response?.data || error.message);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-2">
        <label htmlFor="fullUserName">Full Name</label>

        <Input
          id="fullUserName"
          placeholder="Enter full name"
          {...form.register("fullUserName")}
        />

        {form.formState.errors.fullUserName && (
          <p className="text-sm text-destructive">
            {form.formState.errors.fullUserName.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="email">Email</label>

        <Input
          id="email"
          type="email"
          placeholder="Enter email"
          {...form.register("email")}
        />

        {form.formState.errors.email && (
          <p className="text-sm text-destructive">
            {form.formState.errors.email.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="password">Password</label>

        <Input
          id="password"
          type="password"
          placeholder="Enter password"
          {...form.register("password")}
        />

        {form.formState.errors.password && (
          <p className="text-sm text-destructive">
            {form.formState.errors.password.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="phoneNo">Phone Number</label>

        <Input
          id="phoneNo"
          placeholder="Enter phone number"
          {...form.register("phoneNo")}
        />

        {form.formState.errors.phoneNo && (
          <p className="text-sm text-destructive">
            {form.formState.errors.phoneNo.message}
          </p>
        )}
      </div>

      <Button type="submit" className="w-full">
        Create Store Admin
      </Button>
    </form>
  );
};

export default CreateStoreAdminForm;