import { useEffect, useState } from "react";
import { Check, Ban, CircleOff, Unlock } from "lucide-react";

import { Button } from "@/components/ui/button";
import storeService from "@/services/store/storeService";

const Stores = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  const fetchStores = async () => {
    try {
      const response = await storeService.getAllStores();
      setStores(response);
    } catch (error) {
      console.error(error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  const handleAction = async (storeId, action) => {
    try {
      setProcessingId(storeId);

      let updatedStore;

      switch (action) {
        case "activate":
          updatedStore = await storeService.activateStore(storeId);
          break;

        case "deactivate":
          updatedStore = await storeService.deactivateStore(storeId);
          break;

        case "block":
          updatedStore = await storeService.blockStore(storeId);
          break;

        case "unblock":
          updatedStore = await storeService.unblockStore(storeId);
          break;

        default:
          return;
      }

      setStores((currentStores) =>
        currentStores.map((store) =>
          store.id === updatedStore.id ? updatedStore : store
        )
      );
    } catch (error) {
      console.error(error.response?.data || error.message);
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return <div>Loading stores...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Stores</h1>
        <p className="text-muted-foreground">
          Manage stores and their activation status.
        </p>
      </div>

      {stores.length === 0 ? (
        <div className="rounded-xl border bg-background p-6 text-center">
          <p className="text-muted-foreground">
            No stores found.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border bg-background">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/40">
              <tr>
                <th className="px-4 py-3 text-left font-medium">
                  Store
                </th>
                <th className="px-4 py-3 text-left font-medium">
                  Store Admin
                </th>
                <th className="px-4 py-3 text-left font-medium">
                  Type
                </th>
                <th className="px-4 py-3 text-left font-medium">
                  Status
                </th>
                <th className="px-4 py-3 text-right font-medium">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {stores.map((store) => (
                <tr key={store.id} className="border-b last:border-0">
                  <td className="px-4 py-4 font-medium">
                    {store.brand}
                  </td>

                  <td className="px-4 py-4">
                    {store.storeAdmin?.fullUserName || "—"}
                  </td>

                  <td className="px-4 py-4">
                    {store.storeType}
                  </td>

                  <td className="px-4 py-4">
                    <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium">
                      {store.status}
                    </span>
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex justify-end gap-2">
                      {store.status === "PENDING" && (
                        <Button
                          size="sm"
                          disabled={processingId === store.id}
                          onClick={() =>
                            handleAction(store.id, "activate")
                          }
                        >
                          <Check className="mr-1 h-4 w-4" />
                          Activate
                        </Button>
                      )}

                      {store.status === "ACTIVE" && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={processingId === store.id}
                            onClick={() =>
                              handleAction(store.id, "deactivate")
                            }
                          >
                            <CircleOff className="mr-1 h-4 w-4" />
                            Deactivate
                          </Button>

                          <Button
                            size="sm"
                            variant="destructive"
                            disabled={processingId === store.id}
                            onClick={() =>
                              handleAction(store.id, "block")
                            }
                          >
                            <Ban className="mr-1 h-4 w-4" />
                            Block
                          </Button>
                        </>
                      )}

                      {store.status === "INACTIVE" && (
                        <>
                          <Button
                            size="sm"
                            disabled={processingId === store.id}
                            onClick={() =>
                              handleAction(store.id, "activate")
                            }
                          >
                            <Check className="mr-1 h-4 w-4" />
                            Activate
                          </Button>

                          <Button
                            size="sm"
                            variant="destructive"
                            disabled={processingId === store.id}
                            onClick={() =>
                              handleAction(store.id, "block")
                            }
                          >
                            <Ban className="mr-1 h-4 w-4" />
                            Block
                          </Button>
                        </>
                      )}

                      {store.status === "BLOCKED" && (
                        <Button
                          size="sm"
                          disabled={processingId === store.id}
                          onClick={() =>
                            handleAction(store.id, "unblock")
                          }
                        >
                          <Unlock className="mr-1 h-4 w-4" />
                          Unblock
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Stores;