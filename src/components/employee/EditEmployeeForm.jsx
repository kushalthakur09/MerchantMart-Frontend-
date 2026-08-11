import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import employeeService from "@/services/employee/employeeService";
import branchService from "@/services/branch/branchService";

const EditEmployeeForm = ({
  employee,
  store,
  onSuccess,
  onCancel,
}) => {
  const [branches, setBranches] = useState([]);
  const [loadingBranches, setLoadingBranches] = useState(true);

  const [role, setRole] = useState(employee.role || "");
  const [branchId, setBranchId] = useState(
    employee.branch?.id ? String(employee.branch.id) : ""
  );

  useEffect(() => {
    const loadBranches = async () => {
      try {
        const response = await branchService.getBranchesByStore(
          store.id
        );

        setBranches(response);
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            "Failed to load branches."
        );
      } finally {
        setLoadingBranches(false);
      }
    };

    loadBranches();
  }, [store.id]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!role) {
      toast.error("Role is required.");
      return;
    }

    const requiresBranch =
      role === "ROLE_BRANCH_MANAGER" ||
      role === "ROLE_BRANCH_CASHIER";

    if (requiresBranch && !branchId) {
      toast.error("Branch is required for this role.");
      return;
    }

    try {
      const request = {
        role,
        branchId: requiresBranch
          ? Number(branchId)
          : null,
      };

      const response = await employeeService.updateEmployee(
        employee.id,
        request
      );

      toast.success("Employee updated successfully.");

      onSuccess?.(response);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to update employee."
      );
    }
  };

  if (loadingBranches) {
    return <div>Loading...</div>;
  }

  const requiresBranch =
    role === "ROLE_BRANCH_MANAGER" ||
    role === "ROLE_BRANCH_CASHIER";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Read-only employee information */}

      <div className="space-y-2">
        <label>Full Name</label>

        <div className="rounded-md border bg-muted/30 px-3 py-2 text-sm">
          {employee.fullUserName || "Not provided"}
        </div>
      </div>

      <div className="space-y-2">
        <label>Email</label>

        <div className="rounded-md border bg-muted/30 px-3 py-2 text-sm">
          {employee.email || "Not provided"}
        </div>
      </div>

      <div className="space-y-2">
        <label>Phone Number</label>

        <div className="rounded-md border bg-muted/30 px-3 py-2 text-sm">
          {employee.phoneNo || "Not provided"}
        </div>
      </div>

      {/* Editable organizational information */}

      <div className="space-y-2">
        <label htmlFor="edit-role">Role</label>

        <select
          id="edit-role"
          value={role}
          onChange={(event) => {
            const newRole = event.target.value;

            setRole(newRole);

            if (
              newRole !== "ROLE_BRANCH_MANAGER" &&
              newRole !== "ROLE_BRANCH_CASHIER"
            ) {
              setBranchId("");
            }
          }}
          className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm"
        >
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
      </div>

      {requiresBranch && (
        <div className="space-y-2">
          <label htmlFor="edit-branchId">Branch</label>

          <select
            id="edit-branchId"
            value={branchId}
            onChange={(event) =>
              setBranchId(event.target.value)
            }
            className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm"
          >
            <option value="">Select Branch</option>

            {branches.map((branch) => (
              <option key={branch.id} value={branch.id}>
                {branch.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
        >
          Cancel
        </Button>

        <Button type="submit">
          Update Employee
        </Button>
      </div>
    </form>
  );
};

export default EditEmployeeForm;