import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import refundService from "@/services/refunds/refundService";

const RefundDialog = ({ open, onOpenChange, order, onSuccess }) => {
  const [items, setItems] = useState([]);
  const [reason, setReason] = useState("");
  const [refundMethod, setRefundMethod] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
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

    /*
     * Default refund method:
     *
     * UPI / CARD → ORIGINAL_SOURCE
     * CASH       → UPI
     *
     * Cash orders cannot use ORIGINAL_SOURCE because there is
     * no digital payment source to refund.
     */
    if (order.paymentType === "CASH") {
      setRefundMethod("UPI");
    } else {
      setRefundMethod("ORIGINAL_SOURCE");
    }
  }, [order]);

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
    if (!order) return;

    if (order.status !== "COMPLETED") {
      toast.error("Only completed orders can be refunded.");
      return;
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

    if (
      order.paymentType === "CASH" &&
      refundMethod === "ORIGINAL_SOURCE"
    ) {
      toast.error("Cash orders must be refunded through UPI or Card.");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        orderId: order.id,
        reason: reason.trim(),
        refundMethod,
        items: selectedItems.map((item) => ({
          orderItemId: item.orderItemId,
          quantity: item.quantity,
        })),
      };

      await refundService.create(payload);

      toast.success("Refund request created successfully.");

      onOpenChange(false);

      if (onSuccess) {
        await onSuccess();
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to create refund request."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!order) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100%-2rem)] max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Refund Order #{order.id}</DialogTitle>

          <DialogDescription>
            Select the items and quantities you want to refund.
            The refund request will require Branch Manager approval.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          {/* Order Summary */}
          <div className="rounded-lg border p-4">
            <div className="grid grid-cols-2 gap-4">
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
                  {order.paymentType || "-"}
                </p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">
                  Status
                </p>

                <p className="mt-1 font-semibold">
                  {order.status || "-"}
                </p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">
                  Customer
                </p>

                <p className="mt-1 font-semibold truncate">
                  {order.customerId
                    ? `Customer #${order.customerId}`
                    : "-"}
                </p>
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">
              Order Items
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

          {/* Refund Reason */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Refund Reason
            </label>

            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter reason for refund..."
              rows={3}
              className="w-full resize-none rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Refund Method */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Refund Method
            </label>

            <select
              value={refundMethod}
              onChange={(e) => setRefundMethod(e.target.value)}
              className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Select refund method</option>

              {order.paymentType !== "CASH" && (
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

          {/* Total */}
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
            {loading ? "Submitting..." : "Submit Refund Request"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RefundDialog;