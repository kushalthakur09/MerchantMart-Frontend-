import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { branchSchema } from "@/validation/branchSchema";
import branchService from "@/services/branch/branchService";
import storeService from "@/services/store/storeService";
import employeeService from "@/services/employee/employeeService";

const CreateBranchForm = ({ onSuccess }) => {
  const [store, setStore] = useState(null);
  const [managers, setManagers] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  const form = useForm({
    resolver: zodResolver(branchSchema),
    defaultValues: {
      name: "",
      address: "",
      phoneNo: "",
      email: "",
      workingDays: [],
      openTime: "",
      closeTime: "",
      managerId: "",
    },
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const storeResponse = await storeService.getStoreByAdmin();

        setStore(storeResponse);

        const managerResponse = await employeeService.getStoreBranchManagers(
          storeResponse.id,
        );

        const availableManagers = managerResponse.filter(
          (manager) => !manager.branchId && !manager.branch,
        );

        setManagers(availableManagers);
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            "Failed to load store or branch managers.",
        );
      } finally {
        setLoadingData(false);
      }
    };

    loadData();
  }, []);

  const onInvalid = () => {
    toast.error("Please fix the highlighted fields.");
  };
  const onSubmit = async (data) => {
    if (!store) {
      return;
    }

    try {
      const request = {
        name: data.name,
        address: data.address,
        phoneNo: data.phoneNo,
        email: data.email || null,
        workingDays: data.workingDays,
        openTime: data.openTime || null,
        closeTime: data.closeTime || null,
        storeId: store.id,
        manager: data.managerId
          ? {
              id: Number(data.managerId),
            }
          : null,
      };

      const response = await branchService.createBranch(request);

      form.reset();

      onSuccess?.(response);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create branch.");
    }
  };

  if (loadingData) {
    return <div>Loading...</div>;
  }

  if (!store) {
    return (
      <p className="text-sm text-destructive">
        Store information could not be loaded.
      </p>
    );
  }

  if (store.status !== "ACTIVE") {
    return (
      <p className="text-sm text-muted-foreground">
        Your store must be active before you can create a branch.
      </p>
    );
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit, onInvalid)}
      className="space-y-5"
    >
      <div className="space-y-2">
        <label htmlFor="name">Branch Name</label>

        <Input
          id="name"
          placeholder="Enter branch name"
          {...form.register("name")}
        />

        {form.formState.errors.name && (
          <p className="text-sm text-destructive">
            {form.formState.errors.name.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="address">Address</label>

        <Input
          id="address"
          placeholder="Enter branch address"
          {...form.register("address")}
        />

        {form.formState.errors.address && (
          <p className="text-sm text-destructive">
            {form.formState.errors.address.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="phoneNo">Phone Number</label>

        <Input
          id="phoneNo"
          placeholder="10 digit phone number"
          {...form.register("phoneNo")}
        />

        {form.formState.errors.phoneNo && (
          <p className="text-sm text-destructive">
            {form.formState.errors.phoneNo.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="email">Email</label>

        <Input
          id="email"
          type="email"
          placeholder="Enter branch email"
          {...form.register("email")}
        />

        {form.formState.errors.email && (
          <p className="text-sm text-destructive">
            {form.formState.errors.email.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="managerId">Branch Manager</label>

        <select
          id="managerId"
          {...form.register("managerId")}
          className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm"
        >
          <option value="">Select Branch Manager</option>

          {managers.map((manager) => (
            <option key={manager.id} value={manager.id}>
              {manager.fullUserName} ({manager.email})
            </option>
          ))}
        </select>

        {form.formState.errors.managerId && (
          <p className="text-sm text-destructive">
            {form.formState.errors.managerId.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="openTime">Opening Time</label>

        <Input id="openTime" type="time" {...form.register("openTime")} />
      </div>

      <div className="space-y-2">
        <label htmlFor="closeTime">Closing Time</label>

        <Input id="closeTime" type="time" {...form.register("closeTime")} />
      </div>

      <Button type="submit" className="w-full">
        Create Branch
      </Button>
    </form>
  );
};

export default CreateBranchForm;
