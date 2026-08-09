import CreateStoreAdminForm from "@/components/store-admin/CreateStoreAdminForm";

const StoreAdmins = () => {
  const handleSuccess = (admin) => {
    console.log("Store Admin created:", admin);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Store Admins</h1>
        <p className="text-muted-foreground">
          Create and manage store administrators.
        </p>
      </div>

      <div className="max-w-xl rounded-xl border bg-background p-6">
        <CreateStoreAdminForm onSuccess={handleSuccess} />
      </div>
    </div>
  );
};

export default StoreAdmins;