import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const OrderReceiptDialog = ({ open, onOpenChange, order }) => {
  if (!order) return null;

  const totalAmount = Number(order.totalAmount || 0);

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      {/* PRINT-ONLY RECEIPT */}
      <div id="print-receipt" className="hidden">
        <div className="print-receipt-content">
          <div className="text-center border-b pb-4">
            <h1 className="text-2xl font-bold">MerchantMart</h1>
            <p>{order.branch?.name || "Branch"}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 py-4 text-sm">
            <div>
              <p className="text-xs text-gray-500">Order ID</p>
              <p className="font-medium">#{order.id}</p>
            </div>

            <div>
              <p className="text-xs text-gray-500">Date</p>
              <p className="font-medium">
                {order.createdDate
                  ? new Date(order.createdDate).toLocaleString()
                  : "-"}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500">Cashier</p>
              <p className="font-medium">
                {order.cashier?.fullUserName || "-"}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500">Customer</p>
              <p className="font-medium">
                {order.customerId ? `Customer #${order.customerId}` : "-"}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500">Payment</p>
              <p className="font-medium">{order.paymentType || "-"}</p>
            </div>

            <div>
              <p className="text-xs text-gray-500">Status</p>
              <p className="font-medium">{order.status || "-"}</p>
            </div>
          </div>

          <div className="border-t pt-4">
            <h2 className="mb-3 font-semibold">Items</h2>

            <div className="border">
              <div className="grid grid-cols-[1fr_auto_auto] gap-3 border-b p-3 text-xs font-semibold">
                <span>Product</span>
                <span>Qty</span>
                <span>Amount</span>
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
                      <p className="font-medium">
                        {item.product?.name || `Product #${item.productId}`}
                      </p>

                      <p className="text-xs text-gray-500">
                        ₹{price.toFixed(2)} each
                      </p>
                    </div>

                    <span>{quantity}</span>

                    <span className="text-right font-medium">
                      ₹{amount.toFixed(2)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 border-t pt-4">
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>₹{totalAmount.toFixed(2)}</span>
            </div>
          </div>

          <div className="mt-6 border-t pt-4 text-center text-xs text-gray-500">
            Thank you for shopping with MerchantMart
          </div>
        </div>
      </div>

      {/* NORMAL RECEIPT DIALOG */}
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-[calc(100%-2rem)] max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-center">Order Receipt</DialogTitle>

            <DialogDescription className="text-center">
              Order #{order.id}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5">
            <div className="border-b pb-4 text-center">
              <h2 className="text-xl font-bold">MerchantMart</h2>

              <p className="text-sm text-muted-foreground">
                {order.branch?.name || "Branch"}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">Order ID</p>
                <p className="font-medium">#{order.id}</p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">Date</p>
                <p className="font-medium">
                  {order.createdDate
                    ? new Date(order.createdDate).toLocaleString()
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
                <p className="text-xs text-muted-foreground">Customer</p>
                <p className="font-medium">
                  {order.customerId ? `Customer #${order.customerId}` : "-"}
                </p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">Payment</p>
                <p className="font-medium">{order.paymentType || "-"}</p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">Status</p>
                <p className="font-medium">{order.status || "-"}</p>
              </div>
            </div>

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
                      <div className="min-w-0">
                        <p className="break-words text-sm font-medium">
                          {item.product?.name || `Product #${item.productId}`}
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

            <div className="border-t pt-4">
              <div className="flex items-center justify-between text-lg font-bold">
                <span>Total</span>
                <span>₹{totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>

            <Button onClick={handlePrint}>Print</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <style>{`
  @media print {
    @page {
      size: A4;
      margin: 15mm;
    }

    body * {
      visibility: hidden !important;
    }

    #print-receipt,
    #print-receipt * {
      visibility: visible !important;
    }

    #print-receipt {
      display: block !important;
      position: absolute !important;
      left: 0 !important;
      top: 0 !important;
      width: 100% !important;
      height: auto !important;
      margin: 0 !important;
      padding: 0 !important;
      background: white !important;
    }

    .print-receipt-content {
      display: block !important;
      width: 100% !important;
      max-width: 700px !important;
      margin: 0 auto !important;
      color: black !important;
      background: white !important;
      font-family: Arial, sans-serif !important;
    }

    .print-receipt-content * {
      color: black !important;
    }
  }
`}</style>
    </>
  );
};

export default OrderReceiptDialog;
