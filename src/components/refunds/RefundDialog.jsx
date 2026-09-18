import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

import refundService from "@/services/refunds/refundService";

const RefundDialog = ({
  open,
  onOpenChange,
  order,
  refund = null,
  onSuccess,
}) => {
  const [items, setItems] = useState([]);
  const [reason, setReason] = useState("");
  const [refundMethod, setRefundMethod] = useState("");
  const [loading, setLoading] = useState(false);

  const isEditMode = !!refund;

  useEffect(() => {
    if (!open) return;

    if (refund) {
      setItems(
        (refund.items || []).map((item) => ({
          orderItemId: item.orderItemId,
          productName: `Order Item #${item.orderItemId}`,
          purchasedQuantity: item.quantity,
          price:
            Number(item.amount || 0) / Number(item.quantity || 1),
          quantity: item.quantity,
        }))
      );

      setReason(refund.reason || "");
      setRefundMethod(refund.refundMethod || "");

      return;
    }

    if (!order) {
      setItems([]);
      setReason("");
      setRefundMethod("");
      return;
    }

    setItems(
      (order.items || []).map((item) => ({
        orderItemId: item.id,
        productName:
          item.product?.name || `Product #${item.product?.id || "-"}`,
        purchasedQuantity: item.quantity,
        price: Number(item.price || 0),
        quantity: 0,
      }))
    );

    setReason("");

    if (order.paymentType === "CASH") {
      setRefundMethod("UPI");
    } else {
      setRefundMethod("ORIGINAL_SOURCE");
    }
  }, [open, order, refund]);

  const updateQuantity = (orderItemId, value, maxQuantity) => {
    const quantity = Math.max(
      0,
      Math.min(Number(value) || 0, maxQuantity)
    );

    setItems((current) =>
      current.map((item) =>
        item.orderItemId === orderItemId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const selectedItems = useMemo(
    () => items.filter((item) => item.quantity > 0),
    [items]
  );

  const totalRefund = useMemo(
    () =>
      selectedItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      ),
    [selectedItems]
  );

  const handleSubmit = async () => {
    if (isEditMode) {
      if (refund.status !== "REJECTED") {
        toast.error("Only rejected refunds can be edited.");
        return;
      }
    } else {
      if (!order) return;

      if (order.status !== "COMPLETED") {
        toast.error("Only completed orders can be refunded.");
        return;
      }
    }

    if (selectedItems.length === 0) {
      toast.error("Select at least one item to refund.");
      return;
    }

    if (!reason.trim()) {
      toast.error("Please enter a refund reason.");
      return;
    }

    if (!refundMethod) {
      toast.error("Please select a refund method.");
      return;
    }

    const paymentType = order?.paymentType;

    if (
      paymentType === "CASH" &&
      refundMethod === "ORIGINAL_SOURCE"
    ) {
      toast.error("Cash orders must be refunded through UPI or Card.");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        orderId: isEditMode ? refund.orderId : order.id,
        reason: reason.trim(),
        refundMethod,
        items: selectedItems.map((item) => ({
          orderItemId: item.orderItemId,
          quantity: item.quantity,
        })),
      };

      if (isEditMode) {
        await refundService.update(refund.id, payload);
        toast.success("Refund updated and resubmitted successfully.");
      } else {
        await refundService.create(payload);
        toast.success("Refund request created successfully.");
      }

      onOpenChange(false);

      if (onSuccess) {
        await onSuccess();
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          (isEditMode
            ? "Failed to update refund."
            : "Failed to create refund request.")
      );
    } finally {
      setLoading(false);
    }
  };

  if (!order && !refund) return null;

  const paymentType = order?.paymentType || "-";
  const orderId = order?.id || refund?.orderId;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100%-2rem)] max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditMode
              ? `Edit Refund #${refund.id}`
              : `Refund Order #${order.id}`}
          </DialogTitle>

          <DialogDescription>
            {isEditMode
              ? "Update the rejected refund and resubmit it for Branch Manager approval."
              : "Select the items and quantities you want to refund. The refund request will require Branch Manager approval."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          <div className="rounded-lg border p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">
                  Order ID
                </p>
                <p className="mt-1 font-semibold">
                  #{orderId}
                </p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">
                  Status
                </p>
                <p className="mt-1 font-semibold">
                  {isEditMode ? refund.status : order.status}
                </p>
              </div>

              {!isEditMode && (
                <>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Order Total
                    </p>
                    <p className="mt-1 font-semibold">
                      ₹{Number(order.totalAmount || 0).toFixed(2)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">
                      Original Payment
                    </p>
                    <p className="mt-1 font-semibold">
                      {paymentType}
                    </p>
                  </div>
                </>
              )}

              {isEditMode && (
                <div>
                  <p className="text-xs text-muted-foreground">
                    Previous Rejection
                  </p>
                  <p className="mt-1 text-sm break-words">
                    {refund.rejectionReason || "-"}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold">
              Refund Items
            </h3>

            {items.map((item) => (
              <div
                key={item.orderItemId}
                className="rounded-lg border p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-medium break-words">
                      {item.productName}
                    </p>

                    <p className="mt-1 text-sm text-muted-foreground">
                      ₹{item.price.toFixed(2)} ×{" "}
                      {item.purchasedQuantity}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="text-xs text-muted-foreground">
                      Amount
                    </p>

                    <p className="font-semibold">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium">
                      Refund Quantity
                    </p>

                    <p className="text-xs text-muted-foreground">
                      Max: {item.purchasedQuantity}
                    </p>
                  </div>

                  <input
                    type="number"
                    min="0"
                    max={item.purchasedQuantity}
                    value={item.quantity}
                    onChange={(e) =>
                      updateQuantity(
                        item.orderItemId,
                        e.target.value,
                        item.purchasedQuantity
                      )
                    }
                    className="h-10 w-20 rounded-md border bg-background px-2 text-center outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>
            ))}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Refund Reason
            </label>

            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter reason for refund..."
              rows={3}
              disabled={loading}
              className="w-full resize-none rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Refund Method
            </label>

            <select
              value={refundMethod}
              onChange={(e) => setRefundMethod(e.target.value)}
              disabled={loading}
              className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Select refund method</option>

              {paymentType !== "CASH" && (
                <option value="ORIGINAL_SOURCE">
                  Original Payment Source
                </option>
              )}

              <option value="UPI">UPI</option>
              <option value="CARD">Card</option>
            </select>

            <p className="mt-1 text-xs text-muted-foreground">
              Cash payments must be refunded through UPI or Card.
            </p>
          </div>

          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <p className="text-sm text-muted-foreground">
                Selected Items
              </p>

              <p className="font-medium">
                {selectedItems.length} item
                {selectedItems.length !== 1 ? "s" : ""}
              </p>
            </div>

            <div className="text-right">
              <p className="text-sm text-muted-foreground">
                Refund Amount
              </p>

              <p className="text-xl font-bold">
                ₹{totalRefund.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>

          <Button onClick={handleSubmit} disabled={loading}>
            {loading
              ? isEditMode
                ? "Resubmitting..."
                : "Submitting..."
              : isEditMode
                ? "Resubmit Refund"
                : "Submit Refund Request"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RefundDialog;