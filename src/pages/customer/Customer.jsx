import { useEffect, useState } from "react";
import { Pencil, Power } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import customerService from "@/services/customer/customerService";

import LoadingSpinner from "@/components/common/LoadingSpinner/LoadingSpinner";
import PageHeader from "@/components/common/PageHeader/PageHeader";
import SearchBar from "@/components/common/SearchBar/SearchBar";
import DataTable from "@/components/common/DataTable/DataTable";
import Pagination from "@/components/common/Pagination/Pagination";
import StatusDialog from "@/components/common/StatusDialog/StatusDialog";
import CustomerDialog from "@/components/customer/CustomerDialog";

import { ROLES } from "@/constants/roles";
import useAuth from "@/hooks/useAuth";

const Customer = () => {
  const { user } = useAuth();

  const isAdmin =
    user?.role === ROLES.ADMIN;

  const canManageCustomers =
    user?.role === ROLES.ADMIN ||
    user?.role === ROLES.STORE_ADMIN ||
    user?.role === ROLES.STORE_MANAGER;

  const [search, setSearch] = useState("");
  const [customers, setCustomers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toggling, setToggling] = useState(false);

  const [openCustomerDialog, setOpenCustomerDialog] =
    useState(false);

  const [editingCustomer, setEditingCustomer] =
    useState(null);

  const [openStatusDialog, setOpenStatusDialog] =
    useState(false);

  const [selectedCustomer, setSelectedCustomer] =
    useState(null);

  const loadCustomers = async () => {
    try {
      setLoading(true);

      const response = await customerService.getAll();

      setCustomers(response);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to load customers."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const handleCreateCustomer = () => {
    setEditingCustomer(null);
    setOpenCustomerDialog(true);
  };

  const handleEditCustomer = (customer) => {
    setEditingCustomer(customer);
    setOpenCustomerDialog(true);
  };

  const handleSaveCustomer = async (customer) => {
    try {
      setSaving(true);

      if (editingCustomer) {
        await customerService.update(
          editingCustomer.id,
          customer
        );

        toast.success(
          "Customer updated successfully."
        );
      } else {
        await customerService.create(customer);

        toast.success(
          "Customer created successfully."
        );
      }

      setOpenCustomerDialog(false);
      setEditingCustomer(null);

      await loadCustomers();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          `Failed to ${
            editingCustomer
              ? "update"
              : "create"
          } customer.`
      );
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!selectedCustomer) {
      return;
    }

    try {
      setToggling(true);

      const isActive =
        selectedCustomer.status === "ACTIVE";

      if (isActive) {
        await customerService.deactivate(
          selectedCustomer.id
        );
      } else {
        await customerService.activate(
          selectedCustomer.id
        );
      }

      toast.success(
        isActive
          ? "Customer deactivated successfully."
          : "Customer activated successfully."
      );

      setOpenStatusDialog(false);
      setSelectedCustomer(null);

      await loadCustomers();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          `Failed to ${
            selectedCustomer.status === "ACTIVE"
              ? "deactivate"
              : "activate"
          } customer.`
      );
    } finally {
      setToggling(false);
    }
  };

  const filteredCustomers = customers.filter(
    (customer) => {
      const keyword = search.toLowerCase();

      return (
        customer.fullName
          ?.toLowerCase()
          .includes(keyword) ||
        customer.email
          ?.toLowerCase()
          .includes(keyword) ||
        customer.phoneNo
          ?.toLowerCase()
          .includes(keyword)
      );
    }
  );

  const columns = [
    {
      header: "Name",
      accessor: "fullName",
    },
    {
      header: "Phone",
      accessor: "phoneNo",
      cell: (row) => row.phoneNo || "-",
    },
    {
      header: "Email",
      accessor: "email",
      cell: (row) => row.email || "-",
    },
    {
      header: "Status",
      accessor: "status",
      cell: (row) => (
        <div className="rounded-full border px-3 py-1 text-xs font-medium w-fit">
          {row.status || "ACTIVE"}
        </div>
      ),
    },
  ];

  // Only management roles get action buttons
  if (canManageCustomers) {
    columns.push({
      header: "Actions",
      accessor: "actions",
      className: "text-right",

      cell: (row) => (
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() =>
              handleEditCustomer(row)
            }
          >
            <Pencil size={16} />
          </Button>

          <Button
            variant={
              row.status === "ACTIVE"
                ? "destructive"
                : "outline"
            }
            size="icon"
            onClick={() => {
              setSelectedCustomer(row);
              setOpenStatusDialog(true);
            }}
          >
            <Power size={16} />
          </Button>
        </div>
      ),
    });
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Customers"
        description="Manage your customers."
        buttonLabel={
          canManageCustomers
            ? "Add Customer"
            : undefined
        }
        onButtonClick={
          canManageCustomers
            ? handleCreateCustomer
            : undefined
        }
      />

      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Search customers..."
      />

      {loading ? (
        <LoadingSpinner text="Loading customers..." />
      ) : (
        <DataTable
          columns={columns}
          data={filteredCustomers}
          emptyTitle={
            search
              ? "No Customers Found"
              : "No Customers Yet"
          }
          emptyDescription={
            search
              ? "Try a different search term."
              : canManageCustomers
                ? "Create your first customer."
                : "No customers are available."
          }
        />
      )}

      {filteredCustomers.length > 0 && (
        <Pagination
          currentPage={1}
          totalPages={1}
          onPrevious={() => {}}
          onNext={() => {}}
        />
      )}

      {canManageCustomers && (
        <>
          <CustomerDialog
            open={openCustomerDialog}
            onOpenChange={(open) => {
              setOpenCustomerDialog(open);

              if (!open) {
                setEditingCustomer(null);
              }
            }}
            title={
              editingCustomer
                ? "Edit Customer"
                : "Add Customer"
            }
            loading={saving}
            initialData={editingCustomer}
            onSubmit={handleSaveCustomer}
          />

          <StatusDialog
            open={openStatusDialog}
            onOpenChange={(open) => {
              if (!toggling) {
                setOpenStatusDialog(open);

                if (!open) {
                  setSelectedCustomer(null);
                }
              }
            }}
            action={
              selectedCustomer?.status === "ACTIVE"
                ? "deactivate"
                : "activate"
            }
            title={
              selectedCustomer?.status === "ACTIVE"
                ? "Deactivate Customer"
                : "Activate Customer"
            }
            description={
              selectedCustomer
                ? selectedCustomer.status === "ACTIVE"
                  ? `Are you sure you want to deactivate "${selectedCustomer.fullName}"?`
                  : `Are you sure you want to activate "${selectedCustomer.fullName}"?`
                : ""
            }
            onConfirm={handleToggleStatus}
            loading={toggling}
          />
        </>
      )}
    </div>
  );
};

export default Customer;