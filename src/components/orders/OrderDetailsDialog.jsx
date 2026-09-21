import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const OrderDetailsDialog = ({ open, onOpenChange, order }) => {
  if (!order) return null;

  const totalAmount = Number(order.totalAmount || 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100%-2rem)] max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Order #{order.id}</DialogTitle>

          <DialogDescription>
            Order details and purchased items.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Information */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs text-muted-foreground">Order ID</p>
              <p className="font-medium">#{order.id}</p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Status</p>
              <p className="font-medium">{order.status || "-"}</p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Customer</p>
              <p className="font-medium">
                {order.customerId
                  ? `Customer #${order.customerId}`
                  : "-"}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Cashier</p>
              <p className="font-medium">
                {order.cashier?.fullUserName || "-"}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Payment</p>
              <p className="font-medium">
                {order.paymentType || "-"}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Date</p>
              <p className="font-medium">
                {order.createdDate
                  ? new Date(order.createdDate).toLocaleString()
                  : "-"}
              </p>
            </div>
          </div>

          {/* Items */}
          <div>
            <h3 className="mb-3 text-sm font-semibold">Items</h3>

            <div className="rounded-lg border">
              <div className="grid grid-cols-[1fr_auto_auto] gap-3 border-b p-3 text-xs font-semibold text-muted-foreground">
                <span>Product</span>
                <span>Qty</span>
                <span className="text-right">Amount</span>
              </div>

              {order.items?.map((item) => {
                const quantity = Number(item.quantity || 0);
                const price = Number(item.price || 0);
                const amount = quantity * price;

                return (
                  <div
                    key={item.id}
                    className="grid grid-cols-[1fr_auto_auto] gap-3 border-b p-3 last:border-b-0"
                  >
                    <div>
                      <p className="text-sm font-medium">
                        {item.product?.name ||
                          `Product #${item.productId}`}
                      </p>

                      <p className="text-xs text-muted-foreground">
                        ₹{price.toFixed(2)} each
                      </p>
                    </div>

                    <span className="text-sm">{quantity}</span>

                    <span className="text-right text-sm font-medium">
                      ₹{amount.toFixed(2)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Total */}
          <div className="border-t pt-4">
            <div className="flex items-center justify-between text-lg font-bold">
              <span>Total</span>
              <span>₹{totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailsDialog;