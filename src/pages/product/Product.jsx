import { useEffect, useState } from "react";
import { Pencil, Power } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import productService from "@/services/product/productService";
import useAuth from "@/hooks/useAuth";

import LoadingSpinner from "@/components/common/LoadingSpinner/LoadingSpinner";
import PageHeader from "@/components/common/PageHeader/PageHeader";
import SearchBar from "@/components/common/SearchBar/SearchBar";
import DataTable from "@/components/common/DataTable/DataTable";
import Pagination from "@/components/common/Pagination/Pagination";
import StatusDialog from "@/components/common/StatusDialog/StatusDialog";
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

  const [openStatusDialog, setOpenStatusDialog] =
    useState(false);

  const [selectedProduct, setSelectedProduct] =
    useState(null);

  const [toggling, setToggling] = useState(false);

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

  const handleToggleStatus = async () => {
    if (!selectedProduct) return;

    try {
      setToggling(true);

      const isActive =
        selectedProduct.status === "ACTIVE";

      if (isActive) {
        await productService.deactivate(
          selectedProduct.id
        );
      } else {
        await productService.activate(
          selectedProduct.id
        );
      }

      setProducts((current) =>
        current.map((product) =>
          product.id === selectedProduct.id
            ? {
                ...product,
                status: isActive
                  ? "INACTIVE"
                  : "ACTIVE",
              }
            : product
        )
      );

      setOpenStatusDialog(false);
      setSelectedProduct(null);

      toast.success(
        isActive
          ? "Product deactivated successfully."
          : "Product activated successfully."
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          `Failed to ${
            selectedProduct.status === "ACTIVE"
              ? "deactivate"
              : "activate"
          } product.`
      );
    } finally {
      setToggling(false);
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
      header: "Status",
      accessor: "status",
      cell: (row) => row.status || "ACTIVE",
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
            variant={
              row.status === "ACTIVE"
                ? "destructive"
                : "outline"
            }
            size="icon"
            onClick={() => {
              setSelectedProduct(row);
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

      <StatusDialog
        open={openStatusDialog}
        onOpenChange={(open) => {
          if (!toggling) {
            setOpenStatusDialog(open);

            if (!open) {
              setSelectedProduct(null);
            }
          }
        }}
        action={
          selectedProduct?.status === "ACTIVE"
            ? "deactivate"
            : "activate"
        }
        title={
          selectedProduct?.status === "ACTIVE"
            ? "Deactivate Product"
            : "Activate Product"
        }
        description={
          selectedProduct
            ? selectedProduct.status === "ACTIVE"
              ? `Are you sure you want to deactivate "${selectedProduct.name}"? This product will no longer be active.`
              : `Are you sure you want to activate "${selectedProduct.name}"?`
            : ""
        }
        onConfirm={handleToggleStatus}
        loading={toggling}
      />
    </div>
  );
};

export default Product;