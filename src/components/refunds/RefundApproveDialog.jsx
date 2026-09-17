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

const RefundApproveDialog = ({
  open,
  onOpenChange,
  refund,
  onConfirm,
  loading = false,
}) => {
  if (!refund) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Approve Refund?
          </AlertDialogTitle>

          <AlertDialogDescription>
            Are you sure you want to approve refund #
            {refund.id} for ₹
            {Number(refund.amount || 0).toFixed(2)}?
            This action will restore the refunded items to
            inventory.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "Approving..." : "Approve Refund"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default RefundApproveDialog;