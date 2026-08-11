import { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import categoryService from "@/services/category/categoryService";
import useAuth from "@/hooks/useAuth";

import LoadingSpinner from "@/components/common/LoadingSpinner/LoadingSpinner";
import PageHeader from "@/components/common/PageHeader/PageHeader";
import SearchBar from "@/components/common/SearchBar/SearchBar";
import DataTable from "@/components/common/DataTable/DataTable";
import Pagination from "@/components/common/Pagination/Pagination";
import DeleteDialog from "@/components/common/DeleteDialog/DeleteDialog";
import CategoryDialog from "@/components/category/CategoryDialog";

const Category = () => {
  const { user } = useAuth();

  const [search, setSearch] = useState("");

  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [openCategoryDialog, setOpenCategoryDialog] =
    useState(false);

  const [editingCategory, setEditingCategory] =
    useState(null);

  const [openDeleteDialog, setOpenDeleteDialog] =
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

  const handleDeleteCategory = async () => {
    if (!selectedCategory) {
      return;
    }

    try {
      await categoryService.remove(
        selectedCategory.id
      );

      toast.success(
        "Category deleted successfully."
      );

      setOpenDeleteDialog(false);
      setSelectedCategory(null);

      await loadCategories();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to delete category."
      );
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
            variant="destructive"
            size="icon"
            onClick={() => {
              setSelectedCategory(row);
              setOpenDeleteDialog(true);
            }}
          >
            <Trash2 size={16} />
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

      {/* Delete Confirmation */}

      <DeleteDialog
        open={openDeleteDialog}
        onOpenChange={(open) => {
          setOpenDeleteDialog(open);

          if (!open) {
            setSelectedCategory(null);
          }
        }}
        title="Delete Category"
        description={
          selectedCategory
            ? `Are you sure you want to delete "${selectedCategory.name}"? This action cannot be undone.`
            : "Are you sure you want to delete this category?"
        }
        onConfirm={handleDeleteCategory}
      />
    </div>
  );
};

export default Category;