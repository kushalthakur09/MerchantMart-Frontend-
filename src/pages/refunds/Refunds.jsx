import { useEffect, useMemo, useState } from "react";
import { Check, Edit, Eye, X } from "lucide-react";
import { toast } from "sonner";

import useAuth from "@/hooks/useAuth";
import refundService from "@/services/refunds/refundService";
import orderService from "@/services/order/orderService";

import { ROLES } from "@/constants/roles";

import PageHeader from "@/components/common/PageHeader/PageHeader";
import SearchBar from "@/components/common/SearchBar/SearchBar";
import DataTable from "@/components/common/DataTable/DataTable";
import LoadingSpinner from "@/components/common/LoadingSpinner/LoadingSpinner";
import Pagination from "@/components/common/Pagination/Pagination";
import { Button } from "@/components/ui/button";

import RefundDialog from "@/components/refunds/RefundDialog";
import RefundApproveDialog from "@/components/refunds/RefundApproveDialog";
import RefundRejectDialog from "@/components/refunds/RefundRejectDialog";
import RefundViewDialog from "@/components/refunds/RefundViewDialog";

const Refunds = () => {
  const { user } = useAuth();

  const [refunds, setRefunds] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [selectedRefund, setSelectedRefund] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const [approveOpen, setApproveOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);

  const [actionLoading, setActionLoading] = useState(false);

  const isBranchManager = user?.role === ROLES.BRANCH_MANAGER;
  const isCashier = user?.role === ROLES.BRANCH_CASHIER;

  const loadRefunds = async () => {
    try {
      setLoading(true);

      let data = [];

      if (user?.role === ROLES.ADMIN) {
        data = await refundService.getAll();
      } else if (
        user?.role === ROLES.STORE_ADMIN ||
        user?.role === ROLES.STORE_MANAGER
      ) {
        data = await refundService.getAll();
      } else if (user?.role === ROLES.BRANCH_MANAGER) {
        if (!user?.branchId) {
          toast.error("No branch is assigned to the current user.");
          return;
        }

        data = await refundService.getByBranch(user.branchId);
      } else if (user?.role === ROLES.BRANCH_CASHIER) {
        if (!user?.id) {
          toast.error("Unable to identify current cashier.");
          return;
        }

        data = await refundService.getByCashier(user.id);
      }

      setRefunds(data || []);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to load refunds."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadRefunds();
    }
  }, [user]);

  const filteredRefunds = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return refunds;
    }

    return refunds.filter((refund) => {
      const refundId = String(refund.id || "");
      const orderId = String(refund.orderId || "");
      const cashierName = refund.cashierName || "";
      const reason = refund.reason || "";
      const status = refund.status || "";
      const refundMethod = refund.refundMethod || "";

      return (
        refundId.includes(keyword) ||
        orderId.includes(keyword) ||
        cashierName.toLowerCase().includes(keyword) ||
        reason.toLowerCase().includes(keyword) ||
        status.toLowerCase().includes(keyword) ||
        refundMethod.toLowerCase().includes(keyword)
      );
    });
  }, [refunds, search]);

  const handleViewRefund = (refund) => {
    setSelectedRefund(refund);
    setViewOpen(true);
  };

  const handleEditRefund = async (refund) => {
    try {
      setActionLoading(true);

      const order = await orderService.getById(refund.orderId);

      setSelectedRefund(refund);
      setSelectedOrder(order);
      setEditOpen(true);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to load the original order."
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!selectedRefund) return;

    try {
      setActionLoading(true);

      await refundService.approve(selectedRefund.id);

      toast.success("Refund approved successfully.");

      setApproveOpen(false);
      setSelectedRefund(null);

      await loadRefunds();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to approve refund."
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (reason) => {
    if (!selectedRefund) return;

    try {
      setActionLoading(true);

      await refundService.reject(selectedRefund.id, reason);

      toast.success("Refund rejected successfully.");

      setRejectOpen(false);
      setSelectedRefund(null);

      await loadRefunds();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to reject refund."
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditSuccess = async () => {
    setEditOpen(false);
    setSelectedRefund(null);
    setSelectedOrder(null);

    await loadRefunds();
  };

  const openApproveDialog = (refund) => {
    setSelectedRefund(refund);
    setApproveOpen(true);
  };

  const openRejectDialog = (refund) => {
    setSelectedRefund(refund);
    setRejectOpen(true);
  };

  const columns = [
    {
      header: "Refund ID",
      accessor: "id",
      cell: (row) => `#${row.id}`,
    },
    {
      header: "Order",
      accessor: "orderId",
      cell: (row) => `#${row.orderId}`,
    },
    {
      header: "Cashier",
      accessor: "cashierName",
      cell: (row) => row.cashierName || "-",
    },
    {
      header: "Amount",
      accessor: "amount",
      cell: (row) => `₹${Number(row.amount || 0).toFixed(2)}`,
    },
    {
      header: "Method",
      accessor: "refundMethod",
      cell: (row) =>
        row.refundMethod
          ? row.refundMethod.replaceAll("_", " ")
          : "-",
    },
    {
      header: "Status",
      accessor: "status",
      cell: (row) => row.status || "-",
    },
    {
      header: "Reason",
      accessor: "reason",
      cell: (row) => (
        <span
          className="block max-w-[220px] truncate"
          title={row.reason}
        >
          {row.reason || "-"}
        </span>
      ),
    },
    {
      header: "Date",
      accessor: "createdDate",
      cell: (row) =>
        row.createdDate
          ? new Date(row.createdDate).toLocaleString()
          : "-",
    },
    ...(isBranchManager || isCashier
      ? [
          {
            header: "Actions",
            accessor: "actions",
            className: "text-right",
            cell: (row) => (
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  title="View Refund"
                  onClick={() => handleViewRefund(row)}
                  disabled={actionLoading}
                >
                  <Eye size={16} />
                </Button>

                {isBranchManager && row.status === "PENDING" && (
                  <>
                    <Button
                      variant="outline"
                      size="icon"
                      title="Approve Refund"
                      onClick={() => openApproveDialog(row)}
                      disabled={actionLoading}
                    >
                      <Check size={16} />
                    </Button>

                    <Button
                      variant="outline"
                      size="icon"
                      title="Reject Refund"
                      onClick={() => openRejectDialog(row)}
                      disabled={actionLoading}
                    >
                      <X size={16} />
                    </Button>
                  </>
                )}

                {isCashier && row.status === "REJECTED" && (
                  <Button
                    variant="outline"
                    size="icon"
                    title="Edit and Resubmit Refund"
                    onClick={() => handleEditRefund(row)}
                    disabled={actionLoading}
                  >
                    <Edit size={16} />
                  </Button>
                )}
              </div>
            ),
          },
        ]
      : []),
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Refunds"
        description="View and manage refund requests."
      />

      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Search refunds..."
      />

      {loading ? (
        <LoadingSpinner text="Loading refunds..." />
      ) : (
        <DataTable
          columns={columns}
          data={filteredRefunds}
          emptyTitle={search ? "No Refunds Found" : "No Refunds Yet"}
          emptyDescription={
            search
              ? "Try a different search term."
              : "Refund requests will appear here."
          }
        />
      )}

      {filteredRefunds.length > 0 && (
        <Pagination
          currentPage={1}
          totalPages={1}
          onPrevious={() => {}}
          onNext={() => {}}
        />
      )}

      <RefundViewDialog
        open={viewOpen}
        onOpenChange={setViewOpen}
        refund={selectedRefund}
      />

      <RefundDialog
        open={editOpen}
        onOpenChange={(open) => {
          setEditOpen(open);

          if (!open) {
            setSelectedRefund(null);
            setSelectedOrder(null);
          }
        }}
        order={selectedOrder}
        refund={selectedRefund}
        onSuccess={handleEditSuccess}
      />

      <RefundApproveDialog
        open={approveOpen}
        onOpenChange={setApproveOpen}
        refund={selectedRefund}
        onConfirm={handleApprove}
        loading={actionLoading}
      />

      <RefundRejectDialog
        open={rejectOpen}
        onOpenChange={setRejectOpen}
        refund={selectedRefund}
        onConfirm={handleReject}
        loading={actionLoading}
      />
    </div>
  );
};

export default Refunds;