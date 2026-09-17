import { useState } from "react";
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

const RefundRejectDialog = ({
  open,
  onOpenChange,
  refund,
  onConfirm,
  loading = false,
}) => {
  const [reason, setReason] = useState("");

  const handleOpenChange = (value) => {
    if (!value) {
      setReason("");
    }

    onOpenChange(value);
  };

  const handleConfirm = () => {
    const trimmedReason = reason.trim();

    if (!trimmedReason) return;

    onConfirm(trimmedReason);
  };

  if (!refund) return null;

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Reject Refund?
          </AlertDialogTitle>

          <AlertDialogDescription>
            Provide a reason for rejecting refund #{refund.id}.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="py-2">
          <label className="mb-2 block text-sm font-medium">
            Rejection Reason
          </label>

          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Enter reason for rejection..."
            rows={4}
            disabled={loading}
            className="w-full resize-none rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={handleConfirm}
            disabled={loading || !reason.trim()}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {loading ? "Rejecting..." : "Reject Refund"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default RefundRejectDialog;