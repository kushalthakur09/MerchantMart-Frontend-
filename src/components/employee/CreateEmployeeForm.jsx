import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { employeeSchema } from "@/validation/employeeSchema";
import employeeService from "@/services/employee/employeeService";
import storeService from "@/services/store/storeService";
import branchService from "@/services/branch/branchService";

const CreateEmployeeForm = ({ onSuccess }) => {
  const [store, setStore] = useState(null);
  const [branches, setBranches] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  const form = useForm({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      fullUserName: "",
      email: "",
      phoneNo: "",
      password: "",
      role: "",
      branchId: "",
    },
  });

  const selectedRole = form.watch("role");

  useEffect(() => {
    const loadData = async () => {
      try {
        const storeResponse = await storeService.getStoreByAdmin();

        setStore(storeResponse);

        const branchResponse =
          await branchService.getBranchesByStore(storeResponse.id);

        setBranches(branchResponse);
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            "Failed to load employee data."
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
      toast.error("Store information could not be loaded.");
      return;
    }

    try {
      const request = {
        fullUserName: data.fullUserName,
        email: data.email,
        phoneNo: data.phoneNo,
        password: data.password,
        role: data.role,
      };

      let response;

      if (data.role === "ROLE_STORE_MANAGER") {
        response = await employeeService.createStoreEmployee(
          store.id,
          request
        );
      }

      if (data.role === "ROLE_BRANCH_MANAGER") {
        response = await employeeService.createStoreEmployee(
          store.id,
          {
            ...request,
            branchId: Number(data.branchId),
          }
        );
      }

      if (data.role === "ROLE_BRANCH_CASHIER") {
        response = await employeeService.createBranchEmployee(
          data.branchId,
          request
        );
      }

      form.reset();

      toast.success("Employee created successfully.");

      onSuccess?.(response);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to create employee."
      );
    }
  };

  useEffect(() => {
    if (
      selectedRole !== "ROLE_BRANCH_MANAGER" &&
      selectedRole !== "ROLE_BRANCH_CASHIER"
    ) {
      form.setValue("branchId", "");
    }
  }, [selectedRole, form]);

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
        Your store must be active before you can create employees.
      </p>
    );
  }

  const requiresBranch =
    selectedRole === "ROLE_BRANCH_MANAGER" ||
    selectedRole === "ROLE_BRANCH_CASHIER";

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit, onInvalid)}
      className="space-y-5"
    >
      <div className="space-y-2">
        <label htmlFor="fullUserName">Full Name</label>

        <Input
          id="fullUserName"
          placeholder="Enter employee name"
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
          placeholder="Enter employee email"
          {...form.register("email")}
        />

        {form.formState.errors.email && (
          <p className="text-sm text-destructive">
            {form.formState.errors.email.message}
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
        <label htmlFor="password">Password</label>

        <Input
          id="password"
          type="password"
          placeholder="Enter temporary password"
          {...form.register("password")}
        />

        {form.formState.errors.password && (
          <p className="text-sm text-destructive">
            {form.formState.errors.password.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="role">Role</label>

        <select
          id="role"
          {...form.register("role")}
          className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm"
        >
          <option value="">Select Role</option>

          <option value="ROLE_STORE_MANAGER">
            Store Manager
          </option>

          <option value="ROLE_BRANCH_MANAGER">
            Branch Manager
          </option>

          <option value="ROLE_BRANCH_CASHIER">
            Branch Cashier
          </option>
        </select>

        {form.formState.errors.role && (
          <p className="text-sm text-destructive">
            {form.formState.errors.role.message}
          </p>
        )}
      </div>

      {requiresBranch && (
        <div className="space-y-2">
          <label htmlFor="branchId">Branch</label>

          <select
            id="branchId"
            {...form.register("branchId")}
            className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm"
          >
            <option value="">Select Branch</option>

            {branches.map((branch) => (
              <option key={branch.id} value={branch.id}>
                {branch.name}
              </option>
            ))}
          </select>

          {form.formState.errors.branchId && (
            <p className="text-sm text-destructive">
              {form.formState.errors.branchId.message}
            </p>
          )}
        </div>
      )}

      <Button type="submit" className="w-full">
        Create Employee
      </Button>
    </form>
  );
};

export default CreateEmployeeForm;