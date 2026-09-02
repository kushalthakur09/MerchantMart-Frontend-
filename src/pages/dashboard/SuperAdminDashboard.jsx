import { useEffect, useMemo, useState } from "react";
import { Store, CheckCircle, Clock3, Ban } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

import { Card, CardContent } from "@/components/ui/card";
import LoadingSpinner from "@/components/common/LoadingSpinner/LoadingSpinner";

import storeService from "@/services/store/storeService";

const SuperAdminDashboard = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const data = await storeService.getAllStores();

        setStores(data || []);
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to load dashboard.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const statistics = useMemo(() => {
    return {
      total: stores.length,

      active: stores.filter((store) => store.status === "ACTIVE").length,

      pending: stores.filter((store) => store.status === "PENDING").length,

      blocked: stores.filter((store) => store.status === "BLOCKED").length,
    };
  }, [stores]);

  if (loading) {
    return <LoadingSpinner text="Loading dashboard..." />;
  }

  const cards = [
    {
      title: "Total Stores",
      value: statistics.total,
      description: "All registered stores",
      icon: Store,
    },
    {
      title: "Active Stores",
      value: statistics.active,
      description: "Currently active",
      icon: CheckCircle,
    },
    {
      title: "Pending Stores",
      value: statistics.pending,
      description: "Awaiting activation",
      icon: Clock3,
    },
    {
      title: "Blocked Stores",
      value: statistics.blocked,
      description: "Currently blocked",
      icon: Ban,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}

      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl font-semibold tracking-tight">
          Super Admin Dashboard
        </h1>

        <p className="mt-1 text-muted-foreground">
          Overview of all stores on MerchantMart.
        </p>
      </motion.div>

      {/* Statistics */}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card, index) => {
          const Icon = card.icon;

          return (
            <motion.div
              key={card.title}
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.35,
                delay: index * 0.08,
              }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {card.title}
                      </p>

                      <p className="mt-2 text-3xl font-bold">{card.value}</p>
                    </div>

                    <div className="rounded-lg bg-primary/10 p-3">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                  </div>

                  <p className="mt-4 text-xs text-muted-foreground">
                    {card.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Store Overview */}

      <Card>
        <CardContent className="p-6">
          <div className="mb-5">
            <h2 className="text-lg font-semibold">Store Overview</h2>

            <p className="text-sm text-muted-foreground">
              Overview of registered stores.
            </p>
          </div>

          {stores.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No stores registered yet.
            </p>
          ) : (
            <div className="space-y-3">
              {stores.slice(0, 5).map((store) => (
                <div
                  key={store.id}
                  className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-medium">{store.brand}</p>

                    <p className="text-sm text-muted-foreground">
                      {store.storeType}
                    </p>
                  </div>

                  <span className="w-fit rounded-full border px-3 py-1 text-xs font-medium">
                    {store.status || "UNKNOWN"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SuperAdminDashboard;
