import { useEffect, useMemo, useState } from "react";
import { Eye } from "lucide-react";
import { toast } from "sonner";

import useAuth from "@/hooks/useAuth";
import shiftReportService from "@/services/shift/shiftReportService";

import LoadingSpinner from "@/components/common/LoadingSpinner/LoadingSpinner";
import PageHeader from "@/components/common/PageHeader/PageHeader";
import SearchBar from "@/components/common/SearchBar/SearchBar";
import DataTable from "@/components/common/DataTable/DataTable";

import { ROLES } from "@/constants/roles";

const ShiftReports = () => {
  const { user } = useAuth();

  const [reports, setReports] = useState([]);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);

  const [selectedReport, setSelectedReport] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const loadReports = async () => {
    try {
      setLoading(true);

      let data = [];

      if (user?.role === ROLES.ADMIN) {
        data = await shiftReportService.getAll();
      } else if (
        user?.role === ROLES.STORE_ADMIN ||
        user?.role === ROLES.STORE_MANAGER
      ) {
        if (!user?.storeId) {
          toast.error("No store is assigned to this user.");
          return;
        }

        /*
         * There is currently no store-level shift-report
         * endpoint, so we load all reports and filter by store.
         */
        data = await shiftReportService.getAll();

        data = data.filter(
          (report) =>
            report.branch?.storeId === user.storeId ||
            report.branch?.store?.id === user.storeId
        );
      } else if (user?.role === ROLES.BRANCH_MANAGER) {
        if (!user?.branchId) {
          toast.error("No branch is assigned to this user.");
          return;
        }

        data = await shiftReportService.getByBranch(
          user.branchId
        );
      } else if (user?.role === ROLES.BRANCH_CASHIER) {
        data = [];
      }

      setReports(data || []);
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to load shift reports."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadReports();
    }
  }, [user]);

  const filteredReports = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return reports;
    }

    return reports.filter((report) => {
      const id = String(report.id || "").toLowerCase();

      const cashier =
        report.cashier?.fullUserName?.toLowerCase() || "";

      const branch =
        report.branch?.name?.toLowerCase() || "";

      const status = report.shiftEnd
        ? "closed"
        : "active";

      return (
        id.includes(keyword) ||
        cashier.includes(keyword) ||
        branch.includes(keyword) ||
        status.includes(keyword)
      );
    });
  }, [reports, search]);

  const handleView = async (id) => {
    try {
      setDetailsLoading(true);

      const report = await shiftReportService.getById(id);

      setSelectedReport(report);
      setDetailsOpen(true);
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to load shift report."
      );
    } finally {
      setDetailsLoading(false);
    }
  };

  const columns = [
    {
      header: "Shift ID",
      accessor: "id",
      cell: (row) => `#${row.id}`,
    },
    {
      header: "Cashier",
      accessor: "cashier",
      cell: (row) =>
        row.cashier?.fullUserName || "-",
    },
    {
      header: "Branch",
      accessor: "branch",
      cell: (row) =>
        row.branch?.name || "-",
    },
    {
      header: "Start",
      accessor: "shiftStart",
      cell: (row) =>
        row.shiftStart
          ? new Date(row.shiftStart).toLocaleString()
          : "-",
    },
    {
      header: "End",
      accessor: "shiftEnd",
      cell: (row) =>
        row.shiftEnd
          ? new Date(row.shiftEnd).toLocaleString()
          : "Active",
    },
    {
      header: "Orders",
      accessor: "totalOrders",
      cell: (row) => row.totalOrders ?? 0,
    },
    {
      header: "Sales",
      accessor: "totalSales",
      cell: (row) =>
        `₹${Number(row.totalSales || 0).toFixed(2)}`,
    },
    {
      header: "Refunds",
      accessor: "totalRefunds",
      cell: (row) =>
        `₹${Number(row.totalRefunds || 0).toFixed(2)}`,
    },
    {
      header: "Net Sale",
      accessor: "netSale",
      cell: (row) =>
        `₹${Number(row.netSale || 0).toFixed(2)}`,
    },
    {
      header: "Status",
      accessor: "status",
      cell: (row) =>
        row.shiftEnd ? (
          <span className="text-sm font-medium text-muted-foreground">
            Closed
          </span>
        ) : (
          <span className="text-sm font-medium text-green-600">
            Active
          </span>
        ),
    },
    {
      header: "Actions",
      accessor: "actions",
      cell: (row) => (
        <button
          type="button"
          onClick={() => handleView(row.id)}
          disabled={detailsLoading}
          className="inline-flex h-9 w-9 items-center justify-center rounded-md border hover:bg-muted disabled:opacity-50"
          title="View shift report"
        >
          <Eye className="h-4 w-4" />
        </button>
      ),
    },
  ];

  if (loading) {
    return (
      <LoadingSpinner text="Loading shift reports..." />
    );
  }

  if (user?.role === ROLES.BRANCH_CASHIER) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Shift Reports"
          description="Shift reports are available from the POS."
        />

        <div className="rounded-lg border p-6">
          <p className="text-sm text-muted-foreground">
            Cashiers can manage and view their current shift
            from the POS.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Shift Reports"
        description="View and monitor cashier shift reports."
      />

      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Search by shift ID, cashier, branch or status..."
      />

      <DataTable
        columns={columns}
        data={filteredReports}
        emptyTitle={
          search
            ? "No Shift Reports Found"
            : "No Shift Reports Yet"
        }
        emptyDescription={
          search
            ? "Try a different search term."
            : "There are no shift reports available."
        }
      />

      {selectedReport && (
        <ShiftReportDetailsDialog
          open={detailsOpen}
          onOpenChange={(open) => {
            setDetailsOpen(open);

            if (!open) {
              setSelectedReport(null);
            }
          }}
          report={selectedReport}
        />
      )}
    </div>
  );
};

const ShiftReportDetailsDialog = ({
  open,
  onOpenChange,
  report,
}) => {
  if (!report) return null;

  return (
    <div
      className={
        open
          ? "fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          : "hidden"
      }
    >
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg bg-background p-6 shadow-lg">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-semibold">
              Shift #{report.id}
            </h2>

            <p className="text-sm text-muted-foreground">
              Shift report details
            </p>
          </div>

          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="rounded-md border px-3 py-1 text-sm hover:bg-muted"
          >
            Close
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Info
            label="Cashier"
            value={
              report.cashier?.fullUserName || "-"
            }
          />

          <Info
            label="Branch"
            value={report.branch?.name || "-"}
          />

          <Info
            label="Shift Start"
            value={
              report.shiftStart
                ? new Date(
                    report.shiftStart
                  ).toLocaleString()
                : "-"
            }
          />

          <Info
            label="Shift End"
            value={
              report.shiftEnd
                ? new Date(
                    report.shiftEnd
                  ).toLocaleString()
                : "Active"
            }
          />

          <Info
            label="Total Orders"
            value={report.totalOrders ?? 0}
          />

          <Info
            label="Total Sales"
            value={`₹${Number(
              report.totalSales || 0
            ).toFixed(2)}`}
          />

          <Info
            label="Total Refunds"
            value={`₹${Number(
              report.totalRefunds || 0
            ).toFixed(2)}`}
          />

          <Info
            label="Net Sale"
            value={`₹${Number(
              report.netSale || 0
            ).toFixed(2)}`}
          />
        </div>

        {report.paymentSummaries?.length > 0 && (
          <section className="mt-8">
            <h3 className="mb-3 font-semibold">
              Payment Summary
            </h3>

            <div className="overflow-x-auto rounded-md border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="px-4 py-3 text-left">
                      Payment
                    </th>
                    <th className="px-4 py-3 text-left">
                      Transactions
                    </th>
                    <th className="px-4 py-3 text-left">
                      Amount
                    </th>
                    <th className="px-4 py-3 text-left">
                      Percentage
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {report.paymentSummaries.map(
                    (payment, index) => (
                      <tr
                        key={`${payment.paymentType}-${index}`}
                        className="border-b last:border-0"
                      >
                        <td className="px-4 py-3">
                          {payment.paymentType}
                        </td>

                        <td className="px-4 py-3">
                          {payment.transactionCount}
                        </td>

                        <td className="px-4 py-3">
                          ₹
                          {Number(
                            payment.totalAmount || 0
                          ).toFixed(2)}
                        </td>

                        <td className="px-4 py-3">
                          {Number(
                            payment.percentage || 0
                          ).toFixed(2)}
                          %
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {report.topSellingProducts?.length > 0 && (
          <section className="mt-8">
            <h3 className="mb-3 font-semibold">
              Top Selling Products
            </h3>

            <div className="space-y-2">
              {report.topSellingProducts.map(
                (product) => (
                  <div
                    key={product.id}
                    className="flex justify-between rounded-md border p-3"
                  >
                    <span>
                      {product.name}
                    </span>

                    <span className="text-muted-foreground">
                      SKU: {product.sku || "-"}
                    </span>
                  </div>
                )
              )}
            </div>
          </section>
        )}

        {report.recentOrders?.length > 0 && (
          <section className="mt-8">
            <h3 className="mb-3 font-semibold">
              Recent Orders
            </h3>

            <div className="space-y-2">
              {report.recentOrders.map(
                (order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between rounded-md border p-3"
                  >
                    <span>
                      Order #{order.id}
                    </span>

                    <span>
                      ₹
                      {Number(
                        order.totalAmount || 0
                      ).toFixed(2)}
                    </span>
                  </div>
                )
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

const Info = ({ label, value }) => (
  <div className="rounded-md border p-4">
    <p className="text-xs text-muted-foreground">
      {label}
    </p>

    <p className="mt-1 font-medium">
      {value}
    </p>
  </div>
);

export default ShiftReports;