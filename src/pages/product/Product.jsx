import { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import productService from "@/services/product/productService";
import useAuth from "@/hooks/useAuth";

import LoadingSpinner from "@/components/common/LoadingSpinner/LoadingSpinner";
import PageHeader from "@/components/common/PageHeader/PageHeader";
import SearchBar from "@/components/common/SearchBar/SearchBar";
import DataTable from "@/components/common/DataTable/DataTable";
import Pagination from "@/components/common/Pagination/Pagination";
import DeleteDialog from "@/components/common/DeleteDialog/DeleteDialog";
import ProductDialog from "@/components/product/ProductDialog";

const Product = () => {
  const { user } = useAuth();

  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [openProductDialog, setOpenProductDialog] =
    useState(false);

  const [editingProduct, setEditingProduct] =
    useState(null);

  const [openDeleteDialog, setOpenDeleteDialog] =
    useState(false);

  const [selectedProduct, setSelectedProduct] =
    useState(null);

  const loadProducts = async () => {
    if (!user?.storeId) return;

    try {
      setLoading(true);

      const response = await productService.getByStore(
        user.storeId
      );

      setProducts(response);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to load products."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [user?.storeId]);

  const handleCreateProduct = () => {
    setEditingProduct(null);
    setOpenProductDialog(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setOpenProductDialog(true);
  };

  const handleSaveProduct = async (data) => {
    try {
      setSaving(true);

      const request = {
        name: data.name,
        sku: data.sku,
        description: data.description || null,
        mrp: data.mrp,
        sellingPrice: data.sellingPrice,
        brand: data.brand || null,
        image: data.image || null,
        categoryId: Number(data.categoryId),
        storeId: user.storeId,
      };

      if (editingProduct) {
        await productService.update(
          editingProduct.id,
          request
        );

        toast.success(
          "Product updated successfully."
        );
      } else {
        await productService.create(request);

        toast.success(
          "Product created successfully."
        );
      }

      setOpenProductDialog(false);
      setEditingProduct(null);

      await loadProducts();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          `Failed to ${
            editingProduct ? "update" : "create"
          } product.`
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProduct = async () => {
    if (!selectedProduct) return;

    try {
      await productService.remove(
        selectedProduct.id
      );

      toast.success(
        "Product deleted successfully."
      );

      setOpenDeleteDialog(false);
      setSelectedProduct(null);

      await loadProducts();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to delete product."
      );
    }
  };

  const filteredProducts = products.filter((product) => {
    const keyword = search.toLowerCase();

    return (
      product.name?.toLowerCase().includes(keyword) ||
      product.sku?.toLowerCase().includes(keyword) ||
      product.brand?.toLowerCase().includes(keyword)
    );
  });

  const columns = [
    {
      header: "Product",
      accessor: "name",
    },
    {
      header: "SKU",
      accessor: "sku",
    },
    {
      header: "Brand",
      accessor: "brand",
    },
    {
      header: "Category",
      accessor: "category",
      cell: (row) =>
        row.category?.name || "Uncategorized",
    },
    {
      header: "MRP",
      accessor: "mrp",
      cell: (row) => `₹${row.mrp}`,
    },
    {
      header: "Selling Price",
      accessor: "sellingPrice",
      cell: (row) => `₹${row.sellingPrice}`,
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
              handleEditProduct(row)
            }
          >
            <Pencil size={16} />
          </Button>

          <Button
            variant="destructive"
            size="icon"
            onClick={() => {
              setSelectedProduct(row);
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
        title="Products"
        description="Manage products for your store."
        buttonLabel="Add Product"
        onButtonClick={handleCreateProduct}
      />

      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Search products..."
      />

      {loading ? (
        <LoadingSpinner text="Loading products..." />
      ) : (
        <DataTable
          columns={columns}
          data={filteredProducts}
          emptyTitle={
            search
              ? "No Products Found"
              : "No Products Yet"
          }
          emptyDescription={
            search
              ? "Try a different search term."
              : "Create your first product."
          }
        />
      )}

      {filteredProducts.length > 0 && (
        <Pagination
          currentPage={1}
          totalPages={1}
          onPrevious={() => {}}
          onNext={() => {}}
        />
      )}

      <ProductDialog
        open={openProductDialog}
        onOpenChange={(open) => {
          setOpenProductDialog(open);

          if (!open) {
            setEditingProduct(null);
          }
        }}
        title={
          editingProduct
            ? "Edit Product"
            : "Add Product"
        }
        initialData={editingProduct}
        loading={saving}
        onSubmit={handleSaveProduct}
      />

      <DeleteDialog
        open={openDeleteDialog}
        onOpenChange={(open) => {
          setOpenDeleteDialog(open);

          if (!open) {
            setSelectedProduct(null);
          }
        }}
        title="Delete Product"
        description={
          selectedProduct
            ? `Are you sure you want to delete "${selectedProduct.name}"? This action cannot be undone.`
            : "Are you sure you want to delete this product?"
        }
        onConfirm={handleDeleteProduct}
      />
    </div>
  );
};

export default Product;