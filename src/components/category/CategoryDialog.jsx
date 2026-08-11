import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import CategoryForm from "./CategoryForm";

const CategoryDialog = ({
  open,
  onOpenChange,
  title,
  initialData,
  onSubmit,
  loading,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <CategoryForm
          key={initialData?.id ?? "create"}
          defaultValues={{
            name: initialData?.name || "",
          }}
          onSubmit={onSubmit}
          loading={loading}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CategoryDialog;