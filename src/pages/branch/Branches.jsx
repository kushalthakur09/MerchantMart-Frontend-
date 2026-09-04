import { useEffect, useState } from "react";
import { Pencil, Power, MapPin, Phone, UserRound } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import CreateBranchForm from "@/components/branch/CreateBranchForm";
import EditBranchForm from "@/components/branch/EditBranchForm";
import DeleteDialog from "@/components/common/DeleteDialog/DeleteDialog";

import branchService from "@/services/branch/branchService";
import storeService from "@/services/store/storeService";
import useAuth from "@/hooks/useAuth";
import { ROLES } from "@/constants/roles";

const Branches = () => {
  const { user } = useAuth();

  const [branches, setBranches] = useState([]);
  const [branchToEdit, setBranchToEdit] = useState(null);

  const [store, setStore] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [loading, setLoading] = useState(true);
  const [branchToToggle, setBranchToToggle] = useState(null);
  const [toggling, setToggling] = useState(false);

  const isStoreAdmin = user?.role === ROLES.STORE_ADMIN;
  const isStoreManager = user?.role === ROLES.STORE_MANAGER;
  const isBranchManager = user?.role === ROLES.BRANCH_MANAGER;

  const fetchData = async () => {
    try {
      let storeId;
      let storeData;

      if (isBranchManager) {
        storeId = user?.storeId;

        if (!storeId || !user?.branchId) {
          throw new Error("Branch information is missing.");
        }

        const branchResponse = await branchService.getBranchById(user.branchId);

        setBranches([branchResponse]);

        storeData = {
          id: storeId,
          brand: "Your Branch",
          status: "ACTIVE",
        };

        setStore(storeData);
        return;
      }

      storeData = await storeService.getStoreByAdmin();

      setStore(storeData);

      storeId = storeData.id;

      const branchResponse = await branchService.getBranchesByStore(storeId);
      setBranches(branchResponse);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to load branches.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const handleCreated = (branch) => {
    setBranches((current) => [...current, branch]);
    setShowCreate(false);
    toast.success("Branch created successfully.");
  };

  const handleUpdated = (updatedBranch) => {
    setBranches((current) =>
      current.map((branch) =>
        branch.id === updatedBranch.id ? updatedBranch : branch,
      ),
    );

    setBranchToEdit(null);

    toast.success("Branch updated successfully.");
  };

  const handleToggleStatus = async () => {
    if (!branchToToggle) return;

    try {
      setToggling(true);

      const isActive = branchToToggle.status === "ACTIVE";

      if (isActive) {
        await branchService.deactivateBranch(branchToToggle.id);
      } else {
        await branchService.activateBranch(branchToToggle.id);
      }

      setBranches((current) =>
        current.map((branch) =>
          branch.id === branchToToggle.id
            ? {
                ...branch,
                status: isActive ? "INACTIVE" : "ACTIVE",
              }
            : branch,
        ),
      );

      setBranchToToggle(null);

      toast.success(
        isActive
          ? "Branch deactivated successfully."
          : "Branch activated successfully.",
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          `Failed to ${branchToToggle.status === "ACTIVE" ? "deactivate" : "activate"} branch.`,
      );
    } finally {
      setToggling(false);
    }
  };

  if (loading) {
    return <div>Loading branches...</div>;
  }

  if (!store) {
    return <div>Store not found.</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Branches</h1>

          <p className="text-muted-foreground">
            {isBranchManager
              ? "View your branch information."
              : `Manage branches for ${store.brand}.`}
          </p>
        </div>

        {isStoreAdmin && store.status === "ACTIVE" && (
          <Button
            onClick={() => {
              setShowCreate((value) => !value);
              setBranchToEdit(null);
            }}
          >
            {showCreate ? "Cancel" : "Create Branch"}
          </Button>
        )}
      </div>

      {/* Create Branch */}
      {showCreate && isStoreAdmin && (
        <div className="max-w-2xl rounded-xl border bg-background p-6">
          <h2 className="mb-6 text-lg font-semibold">Create Branch</h2>

          <CreateBranchForm onSuccess={handleCreated} />
        </div>
      )}

      {/* Edit Branch */}
      {branchToEdit && isStoreAdmin && (
        <div className="max-w-2xl rounded-xl border bg-background p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold">Edit Branch</h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Update information for {branchToEdit.name}.
            </p>
          </div>

          <EditBranchForm
            branch={branchToEdit}
            onCancel={() => setBranchToEdit(null)}
            onSuccess={handleUpdated}
          />
        </div>
      )}

      {/* Empty State */}
      {branches.length === 0 ? (
        <div className="rounded-xl border bg-background p-10 text-center">
          <h2 className="text-lg font-semibold">No branches yet</h2>

          <p className="mt-2 text-sm text-muted-foreground">
            {isStoreAdmin
              ? "Create your first branch to start managing your store locations."
              : "No branches are available."}
          </p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {branches.map((branch) => (
            <div
              key={branch.id}
              className="rounded-xl border bg-background p-6"
            >
              {/* Branch Header */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold">{branch.name}</h2>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Branch #{branch.id}
                  </p>
                </div>

                <div className="rounded-full border px-3 py-1 text-xs font-medium">
                  {branch.status || "ACTIVE"}
                </div>
              </div>

              {/* Branch Details */}
              <div className="mt-6 space-y-4">
                <div className="flex gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />

                  <span className="text-sm">
                    {branch.address || "Address not available"}
                  </span>
                </div>

                <div className="flex gap-3">
                  <Phone className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />

                  <span className="text-sm">
                    {branch.phoneNo || "Phone number not available"}
                  </span>
                </div>

                <div className="flex gap-3">
                  <UserRound className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />

                  <span className="text-sm">
                    {branch.manager?.fullUserName || "Manager not assigned"}
                  </span>
                </div>
              </div>

              {/* Actions */}
              {isStoreAdmin && (
                <div className="mt-6 flex justify-end gap-2 border-t pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setBranchToEdit(branch);
                      setShowCreate(false);
                    }}
                  >
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                  </Button>

                  <Button
                    variant={
                      branch.status === "ACTIVE" ? "destructive" : "outline"
                    }
                    size="sm"
                    onClick={() => setBranchToToggle(branch)}
                  >
                    <Power className="mr-2 h-4 w-4" />
                    {branch.status === "ACTIVE" ? "Deactivate" : "Activate"}
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation */}
      <DeleteDialog
        open={!!branchToToggle}
        onOpenChange={(open) => {
          if (!open && !toggling) {
            setBranchToToggle(null);
          }
        }}
        title={
          branchToToggle?.status === "ACTIVE"
            ? "Deactivate Branch"
            : "Activate Branch"
        }
        description={
          branchToToggle
            ? branchToToggle.status === "ACTIVE"
              ? `Are you sure you want to deactivate "${branchToToggle.name}"? This branch will no longer be active.`
              : `Are you sure you want to activate "${branchToToggle.name}"?`
            : ""
        }
        onConfirm={handleToggleStatus}
        loading={toggling}
      />
    </div>
  );
};

export default Branches;
