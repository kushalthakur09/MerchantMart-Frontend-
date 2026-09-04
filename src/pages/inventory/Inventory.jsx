import { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import useAuth from "@/hooks/useAuth";

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

  const [products, setProducts] = useState([]);
  const [inventory, setInventory] = useState([]);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [openDialog, setOpenDialog] = useState(false);
  const [editingInventory, setEditingInventory] = useState(null);

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedInventory, setSelectedInventory] = useState(null);

  const branchId = user?.branchId;
  const storeId = user?.storeId;

  const loadProducts = async () => {
    if (!storeId) return;

    try {
      const response = await productService.getByStore(storeId);
      setProducts(response);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to load products."
      );
    }
  };

  const loadInventory = async () => {
    if (!branchId) {
      setInventory([]);
      return;
    }

    try {
      setLoading(true);

      const response = await inventoryService.getByBranch(branchId);

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
        loadProducts(),
        loadInventory(),
      ]);

      setLoading(false);
    };

    if (branchId) {
      loadInitialData();
    }
  }, [branchId, storeId]);

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
          branchId: Number(branchId),
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
            editingInventory ? "update" : "add"
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

  const filteredInventory = inventory.filter((item) => {
    const keyword = search.toLowerCase();

    return (
      item.product?.name
        ?.toLowerCase()
        .includes(keyword) ||
      item.product?.sku
        ?.toLowerCase()
        .includes(keyword)
    );
  });

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
      cell: (row) => (
        <span
          className={
            row.quantity <= 10
              ? "font-semibold text-destructive"
              : "font-medium"
          }
        >
          {row.quantity}
        </span>
      ),
    },
    {
      header: "Status",
      accessor: "status",
      cell: (row) => {
        if (row.quantity === 0) {
          return (
            <span className="text-sm font-medium text-destructive">
              Out of Stock
            </span>
          );
        }

        if (row.quantity <= 10) {
          return (
            <span className="text-sm font-medium text-orange-600">
              Low Stock
            </span>
          );
        }

        return (
          <span className="text-sm font-medium text-green-600">
            In Stock
          </span>
        );
      },
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

  if (loading) {
    return (
      <LoadingSpinner text="Loading inventory..." />
    );
  }

  if (!branchId) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-semibold">
          Inventory
        </h1>

        <p className="mt-2 text-muted-foreground">
          No branch is assigned to your account.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Inventory"
        description="Manage stock for your branch."
        buttonLabel="Add Inventory"
        onButtonClick={handleCreate}
      />

      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Search inventory..."
      />

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