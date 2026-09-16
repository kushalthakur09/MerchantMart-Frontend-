import { useEffect, useState } from "react";
import {
  ShoppingCart,
  IndianRupee,
  RotateCcw,
  BarChart3,
  PieChart as PieChartIcon,
} from "lucide-react";
import { toast } from "sonner";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

import useAuth from "@/hooks/useAuth";
import shiftReportService from "@/services/shift/shiftReportService";

import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/common/LoadingSpinner/LoadingSpinner";
import PageHeader from "@/components/common/PageHeader/PageHeader";
import DataTable from "@/components/common/DataTable/DataTable";

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

const BranchCashierDashboard = () => {
  const { user } = useAuth();

  const [shift, setShift] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shiftActionLoading, setShiftActionLoading] = useState(false);
  const [showEndShiftDialog, setShowEndShiftDialog] = useState(false);

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const data = await shiftReportService.getCurrent();
      setShift(data);
    } catch (error) {
      setShift(null);

      if (error.response?.status !== 404) {
        toast.error(
          error.response?.data?.message ||
            "Failed to load cashier dashboard."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadDashboard();
    }
  }, [user]);

  const handleStartShift = async () => {
    try {
      setShiftActionLoading(true);

      const data = await shiftReportService.startShift();

      setShift(data);

      toast.success("Shift started successfully.");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to start shift."
      );
    } finally {
      setShiftActionLoading(false);
    }
  };

  const handleEndShift = async () => {
    try {
      setShiftActionLoading(true);

      const data = await shiftReportService.endShift();

      setShift(data);
      setShowEndShiftDialog(false);

      toast.success("Shift ended successfully.");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to end shift."
      );
    } finally {
      setShiftActionLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading dashboard..." />;
  }

  const totalSales = Number(shift?.totalSales || 0);
  const totalRefunds = Number(shift?.totalRefunds || 0);
  const netSales = Number(shift?.netSale || 0);
  const totalOrders = shift?.totalOrders || 0;

  const recentOrders = shift?.recentOrders || [];

  const paymentData = (shift?.paymentSummaries || []).map((item) => ({
    name: item.paymentType || item.type || "Unknown",
    value: Number(
      item.amount || item.totalAmount || item.total || 0
    ),
  }));

  const productData = (shift?.topSellingProducts || []).map((product) => ({
    name: product.name,
    quantity: Number(
      product.quantitySold || product.quantity || 0
    ),
  }));

  const orderColumns = [
    {
      header: "Order ID",
      accessor: "id",
      cell: (row) => `#${row.id}`,
    },
    {
      header: "Customer",
      accessor: "customerId",
      cell: (row) =>
        row.customerId ? `Customer #${row.customerId}` : "-",
    },
    {
      header: "Payment",
      accessor: "paymentType",
      cell: (row) => row.paymentType || "-",
    },
    {
      header: "Total",
      accessor: "totalAmount",
      cell: (row) =>
        `₹${Number(row.totalAmount || 0).toFixed(2)}`,
    },
    {
      header: "Date",
      accessor: "createdDate",
      cell: (row) =>
        row.createdDate
          ? new Date(row.createdDate).toLocaleString()
          : "-",
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Cashier Dashboard"
        description="Monitor your current shift and sales."
      />

      {/* Cashier / Shift */}
      <div className="flex flex-col gap-4 rounded-xl border bg-background p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Cashier</p>

          <h2 className="text-lg font-semibold">
            {user?.fullUserName || "Cashier"}
          </h2>

          {shift ? (
            <div className="mt-1 space-y-1 text-sm text-muted-foreground">
              <p>
                Shift started{" "}
                {shift.shiftStart
                  ? new Date(shift.shiftStart).toLocaleString()
                  : "-"}
              </p>

              {shift.shiftEnd && (
                <p>
                  Shift ended{" "}
                  {new Date(shift.shiftEnd).toLocaleString()}
                </p>
              )}
            </div>
          ) : (
            <p className="mt-1 text-sm text-muted-foreground">
              No active shift
            </p>
          )}
        </div>

        {shift ? (
          !shift.shiftEnd ? (
            <Button
              variant="destructive"
              onClick={() => setShowEndShiftDialog(true)}
              disabled={shiftActionLoading}
            >
              End Shift
            </Button>
          ) : (
            <Button disabled>Shift Ended</Button>
          )
        ) : (
          <Button
            onClick={handleStartShift}
            disabled={shiftActionLoading}
          >
            {shiftActionLoading ? "Starting..." : "Start Shift"}
          </Button>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border bg-background p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Total Sales
            </p>
            <IndianRupee size={18} />
          </div>

          <p className="mt-2 text-2xl font-bold">
            ₹{totalSales.toFixed(2)}
          </p>
        </div>

        <div className="rounded-xl border bg-background p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Orders
            </p>
            <ShoppingCart size={18} />
          </div>

          <p className="mt-2 text-2xl font-bold">
            {totalOrders}
          </p>
        </div>

        <div className="rounded-xl border bg-background p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Refunds
            </p>
            <RotateCcw size={18} />
          </div>

          <p className="mt-2 text-2xl font-bold">
            ₹{totalRefunds.toFixed(2)}
          </p>
        </div>

        <div className="rounded-xl border bg-background p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Net Sales
            </p>
            <IndianRupee size={18} />
          </div>

          <p className="mt-2 text-2xl font-bold">
            ₹{netSales.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Payment Distribution */}
        <div className="rounded-xl border bg-background p-5">
          <div className="mb-4 flex items-center gap-2">
            <PieChartIcon size={18} />
            <div>
              <h2 className="font-semibold">
                Payment Distribution
              </h2>
              <p className="text-sm text-muted-foreground">
                Sales by payment method
              </p>
            </div>
          </div>

          {paymentData.length === 0 ? (
            <div className="flex h-[300px] items-center justify-center text-sm text-muted-foreground">
              No payment data yet.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={paymentData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {paymentData.map((_, index) => (
                    <Cell key={`cell-${index}`} />
                  ))}
                </Pie>

                <Tooltip
                  formatter={(value) =>
                    `₹${Number(value).toFixed(2)}`
                  }
                />

                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Top Selling Products */}
        <div className="rounded-xl border bg-background p-5">
          <div className="mb-4 flex items-center gap-2">
            <BarChart3 size={18} />

            <div>
              <h2 className="font-semibold">
                Top Selling Products
              </h2>
              <p className="text-sm text-muted-foreground">
                Products sold during this shift
              </p>
            </div>
          </div>

          {productData.length === 0 ? (
            <div className="flex h-[300px] items-center justify-center text-sm text-muted-foreground">
              No product sales yet.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={productData}>
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12 }}
                />

                <YAxis allowDecimals={false} />

                <Tooltip />

                <Bar
                  dataKey="quantity"
                  name="Quantity Sold"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">
            Recent Orders
          </h2>

          <p className="text-sm text-muted-foreground">
            Your latest orders from the current shift.
          </p>
        </div>

        <DataTable
          columns={orderColumns}
          data={recentOrders}
          emptyTitle="No Orders Yet"
          emptyDescription="Orders from your shift will appear here."
        />
      </div>

      {/* End Shift Confirmation */}
      <AlertDialog
        open={showEndShiftDialog}
        onOpenChange={setShowEndShiftDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              End Current Shift?
            </AlertDialogTitle>

            <AlertDialogDescription>
              Are you sure you want to end your current shift?
              You will not be able to place orders after the shift
              is ended.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={shiftActionLoading}>
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={handleEndShift}
              disabled={shiftActionLoading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {shiftActionLoading ? "Ending..." : "End Shift"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default BranchCashierDashboard;