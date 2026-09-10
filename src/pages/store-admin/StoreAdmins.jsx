import { useEffect, useState } from "react";
import { toast } from "sonner";

import CreateStoreAdminForm from "@/components/store-admin/CreateStoreAdminForm";
import storeAdminService from "@/services/store-admin/storeAdminService";

import LoadingSpinner from "@/components/common/LoadingSpinner/LoadingSpinner";
import DataTable from "@/components/common/DataTable/DataTable";

const StoreAdmins = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadAdmins = async () => {
    try {
      setLoading(true);
      const data = await storeAdminService.getAll();
      setAdmins(data);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to load Store Admins."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdmins();
  }, []);

  const handleSuccess = () => {
    loadAdmins();
  };

  const columns = [
    {
      header: "Name",
      accessor: "fullUserName",
    },
    {
      header: "Email",
      accessor: "email",
    },
    {
      header: "Phone",
      accessor: "phoneNo",
      cell: (row) => row.phoneNo || "-",
    },
    {
      header: "Store",
      accessor: "storeName",
      cell: (row) => row.storeName || "-",
    },
    {
      header: "Store Status",
      accessor: "storeStatus",
      cell: (row) => row.storeStatus || "-",
    },
    {
      header: "Created Date",
      accessor: "createdDate",
      cell: (row) =>
        row.createdDate
          ? new Date(row.createdDate).toLocaleDateString()
          : "-",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Store Admins</h1>
        <p className="text-muted-foreground">
          Create and manage store administrators.
        </p>
      </div>

      <div className="max-w-xl rounded-xl border bg-background p-6">
        <CreateStoreAdminForm onSuccess={handleSuccess} />
      </div>

      <div className="rounded-xl border bg-background p-6">
        <h2 className="mb-4 text-lg font-semibold">Store Admin List</h2>

        {loading ? (
          <LoadingSpinner text="Loading Store Admins..." />
        ) : (
          <DataTable
            columns={columns}
            data={admins}
            emptyTitle="No Store Admins"
            emptyDescription="Create a Store Admin to see them here."
          />
        )}
      </div>
    </div>
  );
};

export default StoreAdmins;