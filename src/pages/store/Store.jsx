import { useEffect, useState } from "react";

import CreateStoreForm from "@/components/store/CreateStoreForm";
import storeService from "@/services/store/storeService";

const Store = () => {
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStore = async () => {
    try {
      const response = await storeService.getStoreByAdmin();
      setStore(response);
    } catch (error) {
      if (error.response?.status !== 404) {
        console.error(error.response?.data || error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStore();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!store) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">My Store</h1>
          <p className="text-muted-foreground">
            Create your store to start managing your business.
          </p>
        </div>

        <div className="max-w-xl rounded-xl border bg-background p-6">
          <h2 className="mb-6 text-lg font-semibold">Create Store</h2>

          <CreateStoreForm onSuccess={setStore} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">My Store</h1>
        <p className="text-muted-foreground">
          Manage your store information.
        </p>
      </div>

      <div className="rounded-xl border bg-background p-6">
        <h2 className="text-xl font-semibold">{store.brand}</h2>

        <div className="mt-4 space-y-2">
          <p>
            <span className="font-medium">Store Type:</span>{" "}
            {store.storeType}
          </p>

          <p>
            <span className="font-medium">Status:</span>{" "}
            {store.status}
          </p>

          {store.description && (
            <p>
              <span className="font-medium">Description:</span>{" "}
              {store.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Store;