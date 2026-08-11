import { useEffect, useState } from "react";
import { Pencil, Trash2, MapPin, Phone, UserRound } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import CreateBranchForm from "@/components/branch/CreateBranchForm";
import branchService from "@/services/branch/branchService";
import storeService from "@/services/store/storeService";

const Branches = () => {
  const [branches, setBranches] = useState([]);
  const [store, setStore] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const storeResponse = await storeService.getStoreByAdmin();
      setStore(storeResponse);

      const branchResponse =
        await branchService.getBranchesByStore(storeResponse.id);

      setBranches(branchResponse);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to load branches."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreated = (branch) => {
    setBranches((current) => [...current, branch]);
    setShowCreate(false);
    toast.success("Branch created successfully.");
  };

  const handleDelete = async (branch) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${branch.name}"?`
    );

    if (!confirmed) return;

    try {
      await branchService.deleteBranch(branch.id);

      setBranches((current) =>
        current.filter((item) => item.id !== branch.id)
      );

      toast.success("Branch deleted successfully.");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to delete branch."
      );
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Branches</h1>
          <p className="text-muted-foreground">
            Manage branches for {store.brand}.
          </p>
        </div>

        {store.status === "ACTIVE" && (
          <Button onClick={() => setShowCreate((value) => !value)}>
            {showCreate ? "Cancel" : "Create Branch"}
          </Button>
        )}
      </div>

      {/* Create */}
      {showCreate && (
        <div className="max-w-2xl rounded-xl border bg-background p-6">
          <h2 className="mb-6 text-lg font-semibold">
            Create Branch
          </h2>

          <CreateBranchForm onSuccess={handleCreated} />
        </div>
      )}

      {/* Empty */}
      {branches.length === 0 ? (
        <div className="rounded-xl border bg-background p-10 text-center">
          <h2 className="text-lg font-semibold">
            No branches yet
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            Create your first branch to start managing your
            store locations.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {branches.map((branch) => (
            <div
              key={branch.id}
              className="rounded-xl border bg-background p-6"
            >
              {/* Branch header */}
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-semibold">
                    {branch.name}
                  </h2>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Branch #{branch.id}
                  </p>
                </div>

                <div className="rounded-full border px-3 py-1 text-xs font-medium">
                  ACTIVE
                </div>
              </div>

              {/* Details */}
              <div className="mt-6 space-y-4">
                <div className="flex gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />

                  <span className="text-sm">
                    {branch.address}
                  </span>
                </div>

                <div className="flex gap-3">
                  <Phone className="h-5 w-5 shrink-0 text-muted-foreground" />

                  <span className="text-sm">
                    {branch.phoneNo}
                  </span>
                </div>

                <div className="flex gap-3">
                  <UserRound className="h-5 w-5 shrink-0 text-muted-foreground" />

                  <span className="text-sm">
                    {branch.manager?.fullUserName ||
                      "Manager not assigned"}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 flex justify-end gap-2 border-t pt-4">
                <Button variant="outline" size="sm">
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </Button>

                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(branch)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Branches;