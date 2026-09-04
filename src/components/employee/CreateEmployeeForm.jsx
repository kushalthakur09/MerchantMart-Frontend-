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

const CreateEmployeeForm = ({ user, onSuccess }) => {
  const [store, setStore] = useState(null);
  const [branches, setBranches] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  const isStoreAdmin =
    user?.role === "ROLE_STORE_ADMIN";

  const isStoreManager =
    user?.role === "ROLE_STORE_MANAGER";

  const isBranchManager =
    user?.role === "ROLE_BRANCH_MANAGER";

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

  /*
   * Load data based on logged-in user's role
   */
  useEffect(() => {
    const loadData = async () => {
      try {
        /*
         * Branch Manager
         *
         * They already have their branchId.
         * No need to load store or branches.
         */
        if (isBranchManager) {
          if (!user?.branchId) {
            throw new Error(
              "Branch information is missing."
            );
          }

          form.setValue(
            "branchId",
            String(user.branchId)
          );

          return;
        }

        /*
         * Store Admin / Store Manager
         *
         * Existing store-level flow.
         */
        const storeResponse =
          await storeService.getStoreByAdmin();

        setStore(storeResponse);

        const branchResponse =
          await branchService.getBranchesByStore(
            storeResponse.id
          );

        setBranches(branchResponse);
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            error.message ||
            "Failed to load employee data."
        );
      } finally {
        setLoadingData(false);
      }
    };

    if (user) {
      loadData();
    }
  }, [user, isBranchManager, form]);

  const onInvalid = () => {
    toast.error(
      "Please fix the highlighted fields."
    );
  };

  const onSubmit = async (data) => {
    try {
      const request = {
        fullUserName: data.fullUserName,
        email: data.email,
        phoneNo: data.phoneNo,
        password: data.password,
        role: data.role,
      };

      let response;

      /*
       * Branch Manager → Branch Cashier
       */
      if (isBranchManager) {
        if (data.role !== "ROLE_BRANCH_CASHIER") {
          toast.error(
            "You can only create a Branch Cashier."
          );
          return;
        }

        if (!user?.branchId) {
          toast.error(
            "Your branch information is missing."
          );
          return;
        }

        response =
          await employeeService.createBranchEmployee(
            user.branchId,
            request
          );
      }

      /*
       * Store Admin / Store Manager → Store-level employees
       */
      else {
        if (!store) {
          toast.error(
            "Store information could not be loaded."
          );
          return;
        }

        if (data.role === "ROLE_STORE_MANAGER") {
          response =
            await employeeService.createStoreEmployee(
              store.id,
              request
            );
        }

        if (data.role === "ROLE_BRANCH_MANAGER") {
          if (!data.branchId) {
            toast.error(
              "Please select a branch."
            );
            return;
          }

          response =
            await employeeService.createStoreEmployee(
              store.id,
              {
                ...request,
                branchId: Number(data.branchId),
              }
            );
        }
      }

      form.reset();

      /*
       * Restore Branch Manager's branch after reset
       */
      if (isBranchManager && user?.branchId) {
        form.setValue(
          "branchId",
          String(user.branchId)
        );
      }

      toast.success(
        "Employee created successfully."
      );

      onSuccess?.(response);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to create employee."
      );
    }
  };

  /*
   * Branch selection is only relevant for
   * Store Admin / Store Manager creating
   * a Branch Manager.
   */
  useEffect(() => {
    if (
      selectedRole !==
      "ROLE_BRANCH_MANAGER"
    ) {
      if (!isBranchManager) {
        form.setValue("branchId", "");
      }
    }
  }, [selectedRole, form, isBranchManager]);

  if (loadingData) {
    return <div>Loading...</div>;
  }

  /*
   * Branch Manager
   *
   * No store lookup is required.
   */
  if (isBranchManager) {
    return (
      <form
        onSubmit={form.handleSubmit(
          onSubmit,
          onInvalid
        )}
        className="space-y-5"
      >
        <div className="space-y-2">
          <label htmlFor="fullUserName">
            Full Name
          </label>

          <Input
            id="fullUserName"
            placeholder="Enter employee name"
            {...form.register("fullUserName")}
          />

          {form.formState.errors.fullUserName && (
            <p className="text-sm text-destructive">
              {
                form.formState.errors
                  .fullUserName.message
              }
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="email">
            Email
          </label>

          <Input
            id="email"
            type="email"
            placeholder="Enter employee email"
            {...form.register("email")}
          />

          {form.formState.errors.email && (
            <p className="text-sm text-destructive">
              {
                form.formState.errors.email
                  .message
              }
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="phoneNo">
            Phone Number
          </label>

          <Input
            id="phoneNo"
            placeholder="10 digit phone number"
            {...form.register("phoneNo")}
          />

          {form.formState.errors.phoneNo && (
            <p className="text-sm text-destructive">
              {
                form.formState.errors.phoneNo
                  .message
              }
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="password">
            Password
          </label>

          <Input
            id="password"
            type="password"
            placeholder="Enter temporary password"
            {...form.register("password")}
          />

          {form.formState.errors.password && (
            <p className="text-sm text-destructive">
              {
                form.formState.errors.password
                  .message
              }
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="role">
            Role
          </label>

          <select
            id="role"
            {...form.register("role")}
            className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm"
          >
            <option value="">
              Select Role
            </option>

            <option value="ROLE_BRANCH_CASHIER">
              Branch Cashier
            </option>
          </select>

          {form.formState.errors.role && (
            <p className="text-sm text-destructive">
              {
                form.formState.errors.role
                  .message
              }
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full"
        >
          Create Employee
        </Button>
      </form>
    );
  }

  /*
   * Store Admin / Store Manager
   */
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
        Your store must be active before you
        can create employees.
      </p>
    );
  }

  const requiresBranch =
    selectedRole ===
    "ROLE_BRANCH_MANAGER";

  return (
    <form
      onSubmit={form.handleSubmit(
        onSubmit,
        onInvalid
      )}
      className="space-y-5"
    >
      <div className="space-y-2">
        <label htmlFor="fullUserName">
          Full Name
        </label>

        <Input
          id="fullUserName"
          placeholder="Enter employee name"
          {...form.register("fullUserName")}
        />

        {form.formState.errors.fullUserName && (
          <p className="text-sm text-destructive">
            {
              form.formState.errors.fullUserName
                .message
            }
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="email">
          Email
        </label>

        <Input
          id="email"
          type="email"
          placeholder="Enter employee email"
          {...form.register("email")}
        />

        {form.formState.errors.email && (
          <p className="text-sm text-destructive">
            {
              form.formState.errors.email
                .message
            }
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="phoneNo">
          Phone Number
        </label>

        <Input
          id="phoneNo"
          placeholder="10 digit phone number"
          {...form.register("phoneNo")}
        />

        {form.formState.errors.phoneNo && (
          <p className="text-sm text-destructive">
            {
              form.formState.errors.phoneNo
                .message
            }
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="password">
          Password
        </label>

        <Input
          id="password"
          type="password"
          placeholder="Enter temporary password"
          {...form.register("password")}
        />

        {form.formState.errors.password && (
          <p className="text-sm text-destructive">
            {
              form.formState.errors.password
                .message
            }
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="role">
          Role
        </label>

        <select
          id="role"
          {...form.register("role")}
          className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm"
        >
          <option value="">
            Select Role
          </option>

          {isStoreAdmin && (
            <>
              <option value="ROLE_STORE_MANAGER">
                Store Manager
              </option>

              <option value="ROLE_BRANCH_MANAGER">
                Branch Manager
              </option>
            </>
          )}

          {isStoreManager && (
            <option value="ROLE_BRANCH_MANAGER">
              Branch Manager
            </option>
          )}
        </select>

        {form.formState.errors.role && (
          <p className="text-sm text-destructive">
            {
              form.formState.errors.role
                .message
            }
          </p>
        )}
      </div>

      {requiresBranch && (
        <div className="space-y-2">
          <label htmlFor="branchId">
            Branch
          </label>

          <select
            id="branchId"
            {...form.register("branchId")}
            className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm"
          >
            <option value="">
              Select Branch
            </option>

            {branches.map((branch) => (
              <option
                key={branch.id}
                value={branch.id}
              >
                {branch.name}
              </option>
            ))}
          </select>

          {form.formState.errors.branchId && (
            <p className="text-sm text-destructive">
              {
                form.formState.errors.branchId
                  .message
              }
            </p>
          )}
        </div>
      )}

      <Button
        type="submit"
        className="w-full"
      >
        Create Employee
      </Button>
    </form>
  );
};

export default CreateEmployeeForm;