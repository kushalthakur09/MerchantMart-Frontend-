import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import ProductForm from "./ProductForm";

const ProductDialog = ({
  open,
  onOpenChange,
  title,
  initialData,
  onSubmit,
  loading,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <ProductForm
          key={initialData?.id ?? "create"}
          defaultValues={{
            name: initialData?.name || "",
            sku: initialData?.sku || "",
            description:
              initialData?.description || "",
            mrp: initialData?.mrp ?? "",
            sellingPrice:
              initialData?.sellingPrice ?? "",
            brand: initialData?.brand || "",
            image: initialData?.image || "",
            categoryId:
              initialData?.categoryId
                ? String(initialData.categoryId)
                : "",
          }}
          onSubmit={onSubmit}
          loading={loading}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ProductDialog;