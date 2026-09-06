import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const StatusDialog = ({
  open,
  onOpenChange,
  action = "deactivate",
  title,
  description,
  onConfirm,
  loading = false,
}) => {
  const isDeactivate = action === "deactivate";

  const defaultTitle = isDeactivate
    ? "Deactivate Item"
    : "Activate Item";

  const defaultDescription = isDeactivate
    ? "Are you sure you want to deactivate this item?"
    : "Are you sure you want to activate this item?";

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {title || defaultTitle}
          </AlertDialogTitle>

          <AlertDialogDescription>
            {description || defaultDescription}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={onConfirm}
            disabled={loading}
            className={
              isDeactivate
                ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                : ""
            }
          >
            {loading
              ? isDeactivate
                ? "Deactivating..."
                : "Activating..."
              : isDeactivate
                ? "Deactivate"
                : "Activate"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default StatusDialog;