import { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import useAuth from "@/hooks/useAuth";

import branchService from "@/services/branch/branchService";
import productService from "@/services/product/productService";
import inventoryService from "@/services/inventory/inventoryService";

import LoadingSpinner from "@/components/common/LoadingSpinner/LoadingSpinner";
import PageHeader from "@/components/common/PageHeader/PageHeader";
import SearchBar from "@/components/common/SearchBar/SearchBar";
import DataTable from "@/components/common/DataTable/DataTable";
import Pagination from "@/components/common/Pagination/Pagination";
import DeleteDialog from "@/components/common/DeleteDialog/DeleteDialog";
import InventoryDialog from "@/components/inventory/InventoryDialog";

const Inventory = () => {
  const { user } = useAuth();

  const [branches, setBranches] = useState([]);
  const [products, setProducts] = useState([]);
  const [inventory, setInventory] = useState([]);

  const [selectedBranchId, setSelectedBranchId] =
    useState("");

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [openDialog, setOpenDialog] =
    useState(false);

  const [editingInventory, setEditingInventory] =
    useState(null);

  const [openDeleteDialog, setOpenDeleteDialog] =
    useState(false);

  const [selectedInventory, setSelectedInventory] =
    useState(null);

  const loadBranches = async () => {
    if (!user?.storeId) return;

    try {
      const response =
        await branchService.getBranchesByStore(
          user.storeId
        );

      setBranches(response);

      if (response.length > 0) {
        setSelectedBranchId(
          String(response[0].id)
        );
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to load branches."
      );
    }
  };

  const loadProducts = async () => {
    if (!user?.storeId) return;

    try {
      const response =
        await productService.getByStore(
          user.storeId
        );

      setProducts(response);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to load products."
      );
    }
  };

  const loadInventory = async () => {
    if (!selectedBranchId) {
      setInventory([]);
      return;
    }

    try {
      setLoading(true);

      const response =
        await inventoryService.getByBranch(
          selectedBranchId
        );

      setInventory(response);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to load inventory."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);

      await Promise.all([
        loadBranches(),
        loadProducts(),
      ]);

      setLoading(false);
    };

    loadInitialData();
  }, [user?.storeId]);

  useEffect(() => {
    if (selectedBranchId) {
      loadInventory();
    }
  }, [selectedBranchId]);

  const handleCreate = () => {
    setEditingInventory(null);
    setOpenDialog(true);
  };

  const handleEdit = (row) => {
    setEditingInventory(row);
    setOpenDialog(true);
  };

  const handleSave = async (data) => {
    try {
      setSaving(true);

      if (editingInventory) {
        await inventoryService.update(
          editingInventory.id,
          {
            quantity: Number(data.quantity),
          }
        );

        toast.success(
          "Inventory updated successfully."
        );
      } else {
        await inventoryService.create({
          branchId: Number(selectedBranchId),
          productId: Number(data.productId),
          quantity: Number(data.quantity),
        });

        toast.success(
          "Inventory added successfully."
        );
      }

      setOpenDialog(false);
      setEditingInventory(null);

      await loadInventory();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          `Failed to ${
            editingInventory
              ? "update"
              : "add"
          } inventory.`
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedInventory) return;

    try {
      await inventoryService.remove(
        selectedInventory.id
      );

      toast.success(
        "Inventory deleted successfully."
      );

      setOpenDeleteDialog(false);
      setSelectedInventory(null);

      await loadInventory();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to delete inventory."
      );
    }
  };

  const filteredInventory = inventory.filter(
    (item) => {
      const keyword = search.toLowerCase();

      return (
        item.product?.name
          ?.toLowerCase()
          .includes(keyword) ||
        item.product?.sku
          ?.toLowerCase()
          .includes(keyword)
      );
    }
  );

  const columns = [
    {
      header: "Product",
      accessor: "product",
      cell: (row) =>
        row.product?.name || "-",
    },
    {
      header: "SKU",
      accessor: "sku",
      cell: (row) =>
        row.product?.sku || "-",
    },
    {
      header: "Category",
      accessor: "category",
      cell: (row) =>
        row.product?.category?.name || "-",
    },
    {
      header: "Quantity",
      accessor: "quantity",
    },
    {
      header: "Last Updated",
      accessor: "lastUpdated",
      cell: (row) =>
        row.lastUpdated
          ? new Date(
              row.lastUpdated
            ).toLocaleString()
          : "-",
    },
    {
      header: "Actions",
      accessor: "actions",
      className: "text-right",

      cell: (row) => (
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleEdit(row)}
          >
            <Pencil size={16} />
          </Button>

          <Button
            variant="destructive"
            size="icon"
            onClick={() => {
              setSelectedInventory(row);
              setOpenDeleteDialog(true);
            }}
          >
            <Trash2 size={16} />
          </Button>
        </div>
      ),
    },
  ];

  if (loading && branches.length === 0) {
    return (
      <LoadingSpinner text="Loading inventory..." />
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Inventory"
        description="Manage stock across your branches."
        buttonLabel="Add Inventory"
        onButtonClick={handleCreate}
      />

      <div className="flex flex-col gap-4 md:flex-row">
        <select
          value={selectedBranchId}
          onChange={(e) =>
            setSelectedBranchId(e.target.value)
          }
          className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm md:max-w-xs"
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

        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search inventory..."
        />
      </div>

      {loading ? (
        <LoadingSpinner text="Loading inventory..." />
      ) : (
        <DataTable
          columns={columns}
          data={filteredInventory}
          emptyTitle={
            search
              ? "No Inventory Found"
              : "No Inventory Yet"
          }
          emptyDescription={
            search
              ? "Try a different search term."
              : "Add stock to this branch."
          }
        />
      )}

      {filteredInventory.length > 0 && (
        <Pagination
          currentPage={1}
          totalPages={1}
          onPrevious={() => {}}
          onNext={() => {}}
        />
      )}

      <InventoryDialog
        open={openDialog}
        onOpenChange={(open) => {
          setOpenDialog(open);

          if (!open) {
            setEditingInventory(null);
          }
        }}
        title={
          editingInventory
            ? "Edit Inventory"
            : "Add Inventory"
        }
        initialData={editingInventory}
        products={products}
        loading={saving}
        onSubmit={handleSave}
      />

      <DeleteDialog
        open={openDeleteDialog}
        onOpenChange={(open) => {
          setOpenDeleteDialog(open);

          if (!open) {
            setSelectedInventory(null);
          }
        }}
        title="Delete Inventory"
        description={
          selectedInventory
            ? `Are you sure you want to delete inventory for "${selectedInventory.product?.name}"? This action cannot be undone.`
            : "Are you sure you want to delete this inventory?"
        }
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default Inventory;