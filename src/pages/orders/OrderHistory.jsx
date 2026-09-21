import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Eye, X } from "lucide-react";

import useAuth from "@/hooks/useAuth";
import orderService from "@/services/order/orderService";

import OrderDetailsDialog from "@/components/orders/OrderDetailsDialog";

import LoadingSpinner from "@/components/common/LoadingSpinner/LoadingSpinner";
import PageHeader from "@/components/common/PageHeader/PageHeader";
import SearchBar from "@/components/common/SearchBar/SearchBar";
import DataTable from "@/components/common/DataTable/DataTable";

import { ROLES } from "@/constants/roles";

const ITEMS_PER_PAGE = 10;

const OrderHistory = () => {
  const { user } = useAuth();

  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");

  const [paymentFilter, setPaymentFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [cashierFilter, setCashierFilter] = useState("ALL");
  const [customerFilter, setCustomerFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderDetailsOpen, setOrderDetailsOpen] = useState(false);
  const [orderLoading, setOrderLoading] = useState(false);

  const loadOrders = async () => {
    try {
      setLoading(true);

      let data = [];

      if (user?.role === ROLES.ADMIN) {
        data = await orderService.getAll();
      } else if (
        user?.role === ROLES.STORE_ADMIN ||
        user?.role === ROLES.STORE_MANAGER
      ) {
        if (!user?.storeId) {
          toast.error("No store is assigned to this user.");
          return;
        }

        data = await orderService.getByStore(user.storeId);
      } else if (user?.role === ROLES.BRANCH_MANAGER) {
        if (!user?.branchId) {
          toast.error("No branch is assigned to this user.");
          return;
        }

        data = await orderService.getByBranch(user.branchId);
      }

      setOrders(data || []);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadOrders();
    }
  }, [user]);

  const cashiers = useMemo(() => {
    const uniqueCashiers = new Map();

    orders.forEach((order) => {
      if (order.cashier?.id) {
        uniqueCashiers.set(
          order.cashier.id,
          order.cashier.fullUserName || `Cashier #${order.cashier.id}`,
        );
      }
    });

    return Array.from(uniqueCashiers.entries());
  }, [orders]);

  const filteredOrders = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    const customerKeyword = customerFilter.trim().toLowerCase();

    return orders.filter((order) => {
      const orderId = String(order.id || "").toLowerCase();
      const customerName = order.customerId
        ? `customer #${order.customerId}`.toLowerCase()
        : "";
      const cashierName = (order.cashier?.fullUserName || "").toLowerCase();
      const paymentType = String(order.paymentType || "").toLowerCase();
      const status = String(order.status || "").toLowerCase();

      const matchesSearch =
        !keyword ||
        orderId.includes(keyword) ||
        customerName.includes(keyword) ||
        cashierName.includes(keyword) ||
        paymentType.includes(keyword) ||
        status.includes(keyword);

      const matchesPayment =
        paymentFilter === "ALL" || order.paymentType === paymentFilter;

      const matchesStatus =
        statusFilter === "ALL" || order.status === statusFilter;

      const matchesCashier =
        cashierFilter === "ALL" ||
        String(order.cashier?.id) === String(cashierFilter);

      const matchesCustomer =
        !customerKeyword ||
        String(order.customerId || "")
          .toLowerCase()
          .includes(customerKeyword) ||
        customerName.includes(customerKeyword);

      const orderDate = order.createdDate
        ? new Date(order.createdDate).toISOString().split("T")[0]
        : "";

      const matchesDate = !dateFilter || orderDate === dateFilter;

      return (
        matchesSearch &&
        matchesPayment &&
        matchesStatus &&
        matchesCashier &&
        matchesCustomer &&
        matchesDate
      );
    });
  }, [
    orders,
    search,
    paymentFilter,
    statusFilter,
    cashierFilter,
    customerFilter,
    dateFilter,
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredOrders.length / ITEMS_PER_PAGE),
  );

  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

    return filteredOrders.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredOrders, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [
    search,
    paymentFilter,
    statusFilter,
    cashierFilter,
    customerFilter,
    dateFilter,
  ]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const clearFilters = () => {
    setSearch("");
    setPaymentFilter("ALL");
    setStatusFilter("ALL");
    setCashierFilter("ALL");
    setCustomerFilter("");
    setDateFilter("");
    setCurrentPage(1);
  };

  const hasFilters =
    search ||
    paymentFilter !== "ALL" ||
    statusFilter !== "ALL" ||
    cashierFilter !== "ALL" ||
    customerFilter ||
    dateFilter;

  const handleViewOrder = async (orderId) => {
    try {
      setOrderLoading(true);

      const order = await orderService.getById(orderId);

      setSelectedOrder(order);
      setOrderDetailsOpen(true);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to load order details.",
      );
    } finally {
      setOrderLoading(false);
    }
  };

  const columns = [
    {
      header: "Order ID",
      accessorKey: "id",
      cell: (order) => `#${order.id}`,
    },
    {
      header: "Customer",
      accessorKey: "customerId",
      cell: (order) =>
        order.customerId ? `Customer #${order.customerId}` : "-",
    },
    {
      header: "Cashier",
      accessorKey: "cashier",
      cell: (order) => order.cashier?.fullUserName || "-",
    },
    {
      header: "Payment",
      accessorKey: "paymentType",
      cell: (order) => order.paymentType || "-",
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (order) => order.status || "-",
    },
    {
      header: "Total",
      accessorKey: "totalAmount",
      cell: (order) => `₹${Number(order.totalAmount || 0).toFixed(2)}`,
    },
    {
      header: "Date",
      accessorKey: "createdDate",
      cell: (order) =>
        order.createdDate ? new Date(order.createdDate).toLocaleString() : "-",
    },
    {
      header: "Actions",
      cell: (order) => (
        <button
          type="button"
          onClick={() => handleViewOrder(order.id)}
          disabled={orderLoading}
          className="inline-flex h-9 w-9 items-center justify-center rounded-md border hover:bg-muted disabled:opacity-50"
          title="View order"
        >
          <Eye className="h-4 w-4" />
        </button>
      ),
    },
  ];

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Orders" description="View order history." />

      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Search by order ID, customer, cashier, payment or status..."
      />

      {/* Filters */}
      <div className="rounded-lg border bg-card p-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
          {/* Customer */}
          <input
            type="text"
            value={customerFilter}
            onChange={(e) => setCustomerFilter(e.target.value)}
            placeholder="Customer ID"
            className="h-10 rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          />

          {/* Payment */}
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="h-10 rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="ALL">All Payments</option>
            <option value="CASH">Cash</option>
            <option value="CARD">Card</option>
            <option value="UPI">UPI</option>
          </select>

          {/* Status */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="ALL">All Statuses</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="REFUNDED">Refunded</option>
          </select>

          {/* Cashier */}
          <select
            value={cashierFilter}
            onChange={(e) => setCashierFilter(e.target.value)}
            className="h-10 rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="ALL">All Cashiers</option>

            {cashiers.map(([id, name]) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </select>

          {/* Date */}
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="h-10 rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        {hasFilters && (
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-muted"
            >
              <X className="h-4 w-4" />
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Result count */}
      <div className="text-sm text-muted-foreground">
        Showing {paginatedOrders.length} of {filteredOrders.length} orders
      </div>

      <DataTable columns={columns} data={paginatedOrders} />

      {/* Pagination */}
      {filteredOrders.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </p>

          <div className="flex gap-2">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              className="rounded-md border px-3 py-2 text-sm hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>

            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() =>
                setCurrentPage((page) => Math.min(totalPages, page + 1))
              }
              className="rounded-md border px-3 py-2 text-sm hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      <OrderDetailsDialog
        open={orderDetailsOpen}
        onOpenChange={(open) => {
          setOrderDetailsOpen(open);

          if (!open) {
            setSelectedOrder(null);
          }
        }}
        order={selectedOrder}
      />
    </div>
  );
};

export default OrderHistory;
