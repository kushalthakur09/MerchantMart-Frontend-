import { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import CreateEmployeeForm from "@/components/employee/CreateEmployeeForm";
import employeeService from "@/services/employee/employeeService";
import storeService from "@/services/store/storeService";
import EditEmployeeForm from "@/components/employee/EditEmployeeForm";

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [store, setStore] = useState(null);
  const [showCreate, setShowCreate] = useState(false);

  const [editingEmployee, setEditingEmployee] = useState(null);
  const [deletingEmployee, setDeletingEmployee] = useState(null);

  const [loading, setLoading] = useState(true);

  const fetchEmployees = async () => {
    try {
      const storeResponse =
        await storeService.getStoreByAdmin();

      setStore(storeResponse);

      const employeeResponse =
        await employeeService.getStoreEmployees(
          storeResponse.id
        );

      setEmployees(employeeResponse);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to load employees."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleCreated = (employee) => {
    setEmployees((current) => [...current, employee]);
    setShowCreate(false);
  };

  const handleDelete = async () => {
    if (!deletingEmployee) return;

    try {
      await employeeService.deleteEmployee(
        deletingEmployee.id
      );

      setEmployees((current) =>
        current.filter(
          (employee) =>
            employee.id !== deletingEmployee.id
        )
      );

      toast.success("Employee deleted successfully.");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to delete employee."
      );
    } finally {
      setDeletingEmployee(null);
    }
  };

  const handleUpdated = (updatedEmployee) => {
    setEmployees((current) =>
      current.map((employee) =>
        employee.id === updatedEmployee.id
          ? updatedEmployee
          : employee
      )
    );

    setEditingEmployee(null);

    toast.success("Employee updated successfully.");
  };

  if (loading) {
    return <div>Loading employees...</div>;
  }

  if (!store) {
    return <div>Store not found.</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">
            Employees
          </h1>

          <p className="text-muted-foreground">
            Manage employees for {store.brand}.
          </p>
        </div>

        {store.status === "ACTIVE" && (
          <Button
            onClick={() =>
              setShowCreate((value) => !value)
            }
          >
            {showCreate ? "Cancel" : "Create Employee"}
          </Button>
        )}
      </div>

      {/* Create */}

      {showCreate && (
        <div className="max-w-2xl rounded-xl border bg-background p-6">
          <h2 className="mb-6 text-lg font-semibold">
            Create Employee
          </h2>

          <CreateEmployeeForm
            onSuccess={handleCreated}
          />
        </div>
      )}

      {/* Edit */}

      {editingEmployee && (
        <div className="max-w-2xl rounded-xl border bg-background p-6">
          <h2 className="mb-6 text-lg font-semibold">
            Edit Employee
          </h2>

          <EditEmployeeForm
            employee={editingEmployee}
            store={store}
            onSuccess={handleUpdated}
            onCancel={() => setEditingEmployee(null)}
          />
        </div>
      )}

      {/* Employees */}

      {employees.length === 0 ? (
        <div className="rounded-xl border bg-background p-10 text-center">
          <h2 className="text-lg font-semibold">
            No employees yet
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            Create your first employee to start
            managing your store.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {employees.map((employee) => (
            <div
              key={employee.id}
              className="rounded-xl border bg-background p-6"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-semibold">
                    {employee.fullUserName}
                  </h2>

                  <p className="mt-1 text-sm text-muted-foreground">
                    {employee.email}
                  </p>
                </div>

                <span className="rounded-full border px-3 py-1 text-xs font-medium">
                  {employee.role
                    ?.replace("ROLE_", "")
                    .replaceAll("_", " ")}
                </span>
              </div>

              <div className="mt-5 space-y-2 text-sm">
                <p>
                  <span className="font-medium">
                    Phone:
                  </span>{" "}
                  {employee.phoneNo || "Not provided"}
                </p>

                <p>
                  <span className="font-medium">
                    Branch:
                  </span>{" "}
                  {employee.branch?.name ||
                    "Store level"}
                </p>
              </div>

              <div className="mt-6 flex justify-end gap-2 border-t pt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setEditingEmployee(employee)
                  }
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </Button>

                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() =>
                    setDeletingEmployee(employee)
                  }
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation */}

      <AlertDialog
        open={!!deletingEmployee}
        onOpenChange={(open) => {
          if (!open) {
            setDeletingEmployee(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete Employee?
            </AlertDialogTitle>

            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <strong>
                {deletingEmployee?.fullUserName}
              </strong>
              ? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Employees;