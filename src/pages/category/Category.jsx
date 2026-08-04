import { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";

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
  const [search, setSearch] = useState("");

  const [openCategoryDialog, setOpenCategoryDialog] = useState(false);

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const { user } = useAuth();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const loadCategories = async () => {
    try {
      setLoading(true);

      const response = await categoryService.getByStore(user?.storeId);

      setCategories(response);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.storeId) {
      loadCategories();
    }
  }, [user]);

  const columns = [
    {
      header: "Category Name",
      accessor: "name",
    },
    {
      header: "Description",
      accessor: "description",
    },
    {
      header: "Status",
      accessor: "status",
    },
    {
      header: "Actions",
      accessor: "actions",
      className: "text-right",
      cell: (row) => (
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="icon">
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

  const handleCreateCategory = async (category) => {
    try {
      setSaving(true);
      console.log({
        ...category,
        storeId: user.storeId,
      });

      await categoryService.create({
        ...category,
        storeId: user.storeId,
      });

      setOpenCategoryDialog(false);

      await loadCategories();
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCategory = async () => {
    try {
      await categoryService.remove(selectedCategory.id);

      setOpenDeleteDialog(false);
      setSelectedCategory(null);

      await loadCategories();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Categories"
        description="Manage product categories."
        buttonLabel="Add Category"
        onButtonClick={() => setOpenCategoryDialog(true)}
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
          data={categories}
          emptyTitle="No Categories Found"
          emptyDescription="Create your first category."
        />
      )}

      {categories.length > 0 && (
        <Pagination
          currentPage={1}
          totalPages={1}
          onPrevious={() => {}}
          onNext={() => {}}
        />
      )}

      <CategoryDialog
        open={openCategoryDialog}
        onOpenChange={setOpenCategoryDialog}
        title="Add Category"
        loading={saving}
        onSubmit={handleCreateCategory}
      />

      <DeleteDialog
        open={openDeleteDialog}
        onOpenChange={setOpenDeleteDialog}
        title="Delete Category"
        description={`Are you sure you want to delete "${selectedCategory?.name}"?`}
        onConfirm={handleDeleteCategory}
      />
    </div>
  );
};

export default Category;
