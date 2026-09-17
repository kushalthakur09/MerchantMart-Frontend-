import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const formatDate = (value) => {
  if (!value) return "-";

  return new Date(value).toLocaleString();
};

const formatMethod = (value) => {
  if (!value) return "-";

  return value.replaceAll("_", " ");
};

const RefundViewDialog = ({
  open,
  onOpenChange,
  refund,
}) => {
  if (!refund) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100%-2rem)] max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Refund #{refund.id}
          </DialogTitle>

          <DialogDescription>
            Refund request details and approval information.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">

          {/* Basic Information */}
          <div className="rounded-lg border p-4">
            <h3 className="mb-4 text-sm font-semibold">
              Refund Information
            </h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs text-muted-foreground">
                  Refund ID
                </p>
                <p className="mt-1 font-medium">
                  #{refund.id}
                </p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">
                  Order ID
                </p>
                <p className="mt-1 font-medium">
                  #{refund.orderId}
                </p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">
                  Amount
                </p>
                <p className="mt-1 font-semibold">
                  ₹{Number(refund.amount || 0).toFixed(2)}
                </p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">
                  Status
                </p>
                <p className="mt-1 font-medium">
                  {refund.status || "-"}
                </p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">
                  Refund Method
                </p>
                <p className="mt-1 font-medium">
                  {formatMethod(refund.refundMethod)}
                </p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">
                  Cashier
                </p>
                <p className="mt-1 font-medium">
                  {refund.cashierName || "-"}
                </p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">
                  Requested At
                </p>
                <p className="mt-1 font-medium">
                  {formatDate(refund.requestedAt)}
                </p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">
                  Created At
                </p>
                <p className="mt-1 font-medium">
                  {formatDate(refund.createdDate)}
                </p>
              </div>
            </div>
          </div>

          {/* Reason */}
          <div className="rounded-lg border p-4">
            <h3 className="mb-2 text-sm font-semibold">
              Refund Reason
            </h3>

            <p className="text-sm text-muted-foreground break-words">
              {refund.reason || "-"}
            </p>
          </div>

          {/* Items */}
          <div className="rounded-lg border p-4">
            <h3 className="mb-4 text-sm font-semibold">
              Refund Items
            </h3>

            {refund.items?.length > 0 ? (
              <div className="space-y-3">
                {refund.items.map((item) => (
                  <div
                    key={item.id || item.orderItemId}
                    className="flex items-center justify-between gap-4 rounded-md border p-3"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium">
                        Order Item #{item.orderItemId}
                      </p>

                      <p className="text-xs text-muted-foreground">
                        Quantity: {item.quantity}
                      </p>
                    </div>

                    <p className="shrink-0 font-medium">
                      ₹{Number(item.amount || 0).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No refund items found.
              </p>
            )}
          </div>

          {/* Approval Information */}
          {(refund.status === "APPROVED" ||
            refund.status === "REJECTED" ||
            refund.approvedBy ||
            refund.rejectionReason) && (
            <div className="rounded-lg border p-4">
              <h3 className="mb-4 text-sm font-semibold">
                Approval Information
              </h3>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-muted-foreground">
                    Approved / Rejected By
                  </p>

                  <p className="mt-1 font-medium">
                    {refund.approvedBy?.fullUserName || "-"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">
                    Approved At
                  </p>

                  <p className="mt-1 font-medium">
                    {formatDate(refund.approvedAt)}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">
                    Rejected At
                  </p>

                  <p className="mt-1 font-medium">
                    {formatDate(refund.rejectedAt)}
                  </p>
                </div>

                <div className="sm:col-span-2">
                  <p className="text-xs text-muted-foreground">
                    Rejection Reason
                  </p>

                  <p className="mt-1 text-sm break-words">
                    {refund.rejectionReason || "-"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RefundViewDialog;