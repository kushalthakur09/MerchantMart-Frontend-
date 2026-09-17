import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Eye, RotateCcw } from "lucide-react";

import useAuth from "@/hooks/useAuth";
import orderService from "@/services/order/orderService";

import RefundDialog from "@/components/refunds/RefundDialog";

import LoadingSpinner from "@/components/common/LoadingSpinner/LoadingSpinner";
import PageHeader from "@/components/common/PageHeader/PageHeader";
import SearchBar from "@/components/common/SearchBar/SearchBar";
import DataTable from "@/components/common/DataTable/DataTable";
import Pagination from "@/components/common/Pagination/Pagination";

import { ROLES } from "@/constants/roles";

const OrderHistory = () => {
  const { user } = useAuth();

  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [refundOpen, setRefundOpen] = useState(false);
  const [orderLoading, setOrderLoading] = useState(false);

  const loadOrders = async () => {
    try {
      setLoading(true);

      let data = [];

      if (user?.role === ROLES.ADMIN) {
        // Super Admin
        data = await orderService.getAll();
      } else if (
        user?.role === ROLES.STORE_ADMIN ||
        user?.role === ROLES.STORE_MANAGER
      ) {
        if (!user?.storeId) {
          toast.error("No store is assigned to the current user.");
          return;
        }

        data = await orderService.getByStore(user.storeId);
      } else if (user?.role === ROLES.BRANCH_MANAGER) {
        if (!user?.branchId) {
          toast.error("No branch is assigned to the current user.");
          return;
        }

        data = await orderService.getByBranch(user.branchId);
      }

      setOrders(data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadOrders();
    }
  }, [user]);

  const filteredOrders = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return orders;
    }

    return orders.filter((order) => {
      const orderId = String(order.id || "");

      const customerName = order.customerId
        ? `Customer #${order.customerId}`
        : "";

      const cashierName = order.cashier?.fullUserName || "";

      const paymentType = order.paymentType || "";

      const status = order.status || "";

      return (
        orderId.toLowerCase().includes(keyword) ||
        customerName.toLowerCase().includes(keyword) ||
        cashierName.toLowerCase().includes(keyword) ||
        paymentType.toLowerCase().includes(keyword) ||
        status.toLowerCase().includes(keyword)
      );
    });
  }, [orders, search]);

  const handleViewOrder = async (orderId) => {
    try {
      setOrderLoading(true);

      const order = await orderService.getById(orderId);

      setSelectedOrder(order);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to load order details.",
      );
    } finally {
      setOrderLoading(false);
    }
  };

  const handleRefund = async (orderId) => {
    try {
      setOrderLoading(true);

      const order = await orderService.getById(orderId);

      setSelectedOrder(order);
      setRefundOpen(true);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to load order details.",
      );
    } finally {
      setOrderLoading(false);
    }
  };

  const columns = [
    {
      header: "Order ID",
      accessor: "id",
      cell: (row) => `#${row.id}`,
    },
    {
      header: "Customer",
      accessor: "customerId",
      cell: (row) => (row.customerId ? `Customer #${row.customerId}` : "-"),
    },
    {
      header: "Cashier",
      accessor: "cashier",
      cell: (row) => row.cashier?.fullUserName || "-",
    },
    {
      header: "Payment",
      accessor: "paymentType",
      cell: (row) => row.paymentType || "-",
    },
    {
      header: "Status",
      accessor: "status",
      cell: (row) => row.status || "-",
    },
    {
      header: "Total",
      accessor: "totalAmount",
      cell: (row) => `₹${Number(row.totalAmount || 0).toFixed(2)}`,
    },
    {
      header: "Date",
      accessor: "createdDate",
      cell: (row) =>
        row.createdDate ? new Date(row.createdDate).toLocaleString() : "-",
    },
    {
      header: "Actions",
      accessor: "actions",
      className: "text-right",
      cell: (row) => (
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            size="icon"
            title="View Order"
            onClick={() => handleViewOrder(row.id)}
            disabled={orderLoading}
          >
            <Eye size={16} />
          </Button>

          {user?.role === ROLES.BRANCH_CASHIER &&
            row.status === "COMPLETED" && (
              <Button
                variant="outline"
                size="icon"
                title="Refund Order"
                onClick={() => handleRefund(row.id)}
                disabled={orderLoading}
              >
                <RotateCcw size={16} />
              </Button>
            )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Orders" description="View order history." />

      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Search orders..."
      />

      {loading ? (
        <LoadingSpinner text="Loading orders..." />
      ) : (
        <DataTable
          columns={columns}
          data={filteredOrders}
          emptyTitle={search ? "No Orders Found" : "No Orders Yet"}
          emptyDescription={
            search ? "Try a different search term." : "Orders will appear here."
          }
        />
      )}

      {filteredOrders.length > 0 && (
        <Pagination
          currentPage={1}
          totalPages={1}
          onPrevious={() => {}}
          onNext={() => {}}
        />
      )}
      {selectedOrder && (
        <RefundDialog
          open={refundOpen}
          onOpenChange={setRefundOpen}
          order={selectedOrder}
          onSuccess={loadOrders}
        />
      )}
    </div>
  );
};

export default OrderHistory;
