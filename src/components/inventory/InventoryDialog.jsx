import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import InventoryForm from "./InventoryForm";

const InventoryDialog = ({
  open,
  onOpenChange,
  title,
  initialData,
  products,
  loading,
  onSubmit,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <InventoryForm
          defaultValues={{
            productId: initialData?.productId
              ? String(initialData.productId)
              : "",
            quantity: initialData?.quantity ?? "",
          }}
          products={products}
          loading={loading}
          onSubmit={onSubmit}
        />
      </DialogContent>
    </Dialog>
  );
};

export default InventoryDialog;