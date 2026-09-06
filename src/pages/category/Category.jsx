import { useEffect, useState } from "react";
import { Pencil, Power } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import categoryService from "@/services/category/categoryService";
import useAuth from "@/hooks/useAuth";

import LoadingSpinner from "@/components/common/LoadingSpinner/LoadingSpinner";
import PageHeader from "@/components/common/PageHeader/PageHeader";
import SearchBar from "@/components/common/SearchBar/SearchBar";
import DataTable from "@/components/common/DataTable/DataTable";
import Pagination from "@/components/common/Pagination/Pagination";
import StatusDialog from "@/components/common/StatusDialog/StatusDialog";
import CategoryDialog from "@/components/category/CategoryDialog";

const Category = () => {
  const { user } = useAuth();

  const [search, setSearch] = useState("");

  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toggling, setToggling] = useState(false);

  const [openCategoryDialog, setOpenCategoryDialog] =
    useState(false);

  const [editingCategory, setEditingCategory] =
    useState(null);

  const [openStatusDialog, setOpenStatusDialog] =
    useState(false);

  const [selectedCategory, setSelectedCategory] =
    useState(null);

  const loadCategories = async () => {
    if (!user?.storeId) {
      return;
    }

    try {
      setLoading(true);

      const response = await categoryService.getByStore(
        user.storeId
      );

      setCategories(response);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to load categories."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, [user?.storeId]);

  const handleCreateCategory = () => {
    setEditingCategory(null);
    setOpenCategoryDialog(true);
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setOpenCategoryDialog(true);
  };

  const handleSaveCategory = async (category) => {
    try {
      setSaving(true);

      if (editingCategory) {
        await categoryService.update(
          editingCategory.id,
          {
            name: category.name,
            storeId: user.storeId,
          }
        );

        toast.success(
          "Category updated successfully."
        );
      } else {
        await categoryService.create({
          name: category.name,
          storeId: user.storeId,
        });

        toast.success(
          "Category created successfully."
        );
      }

      setOpenCategoryDialog(false);
      setEditingCategory(null);

      await loadCategories();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          `Failed to ${
            editingCategory
              ? "update"
              : "create"
          } category.`
      );
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!selectedCategory) {
      return;
    }

    try {
      setToggling(true);

      const isActive =
        selectedCategory.status === "ACTIVE";

      if (isActive) {
        await categoryService.deactivate(
          selectedCategory.id
        );
      } else {
        await categoryService.activate(
          selectedCategory.id
        );
      }

      toast.success(
        isActive
          ? "Category deactivated successfully."
          : "Category activated successfully."
      );

      setOpenStatusDialog(false);
      setSelectedCategory(null);

      await loadCategories();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          `Failed to ${
            selectedCategory.status === "ACTIVE"
              ? "deactivate"
              : "activate"
          } category.`
      );
    } finally {
      setToggling(false);
    }
  };

  const filteredCategories = categories.filter(
    (category) =>
      category.name
        ?.toLowerCase()
        .includes(search.toLowerCase())
  );

  const columns = [
    {
      header: "Category Name",
      accessor: "name",
    },
    {
      header: "Status",
      accessor: "status",

      cell: (row) => (
        <div className="rounded-full border px-3 py-1 text-xs font-medium w-fit">
          {row.status || "ACTIVE"}
        </div>
      ),
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
            onClick={() =>
              handleEditCategory(row)
            }
          >
            <Pencil size={16} />
          </Button>

          <Button
            variant={
              row.status === "ACTIVE"
                ? "destructive"
                : "outline"
            }
            size="icon"
            onClick={() => {
              setSelectedCategory(row);
              setOpenStatusDialog(true);
            }}
          >
            <Power size={16} />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Categories"
        description="Manage product categories."
        buttonLabel="Add Category"
        onButtonClick={handleCreateCategory}
      />

      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Search categories..."
      />

      {loading ? (
        <LoadingSpinner text="Loading categories..." />
      ) : (
        <DataTable
          columns={columns}
          data={filteredCategories}
          emptyTitle={
            search
              ? "No Categories Found"
              : "No Categories Yet"
          }
          emptyDescription={
            search
              ? "Try a different search term."
              : "Create your first category."
          }
        />
      )}

      {filteredCategories.length > 0 && (
        <Pagination
          currentPage={1}
          totalPages={1}
          onPrevious={() => {}}
          onNext={() => {}}
        />
      )}

      {/* Create / Edit Category */}

      <CategoryDialog
        open={openCategoryDialog}
        onOpenChange={(open) => {
          setOpenCategoryDialog(open);

          if (!open) {
            setEditingCategory(null);
          }
        }}
        title={
          editingCategory
            ? "Edit Category"
            : "Add Category"
        }
        loading={saving}
        initialData={editingCategory}
        onSubmit={handleSaveCategory}
      />

      {/* Activate / Deactivate Confirmation */}

      <StatusDialog
        open={openStatusDialog}
        onOpenChange={(open) => {
          if (!toggling) {
            setOpenStatusDialog(open);

            if (!open) {
              setSelectedCategory(null);
            }
          }
        }}
        action={
          selectedCategory?.status === "ACTIVE"
            ? "deactivate"
            : "activate"
        }
        title={
          selectedCategory?.status === "ACTIVE"
            ? "Deactivate Category"
            : "Activate Category"
        }
        description={
          selectedCategory
            ? selectedCategory.status === "ACTIVE"
              ? `Are you sure you want to deactivate "${selectedCategory.name}"?`
              : `Are you sure you want to activate "${selectedCategory.name}"?`
            : ""
        }
        onConfirm={handleToggleStatus}
        loading={toggling}
      />
    </div>
  );
};

export default Category;