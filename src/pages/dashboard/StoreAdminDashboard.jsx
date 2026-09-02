import { useEffect, useState } from "react";
import {
  IndianRupee,
  ShoppingCart,
  Users,
  GitBranch,
  Package,
  RotateCcw,
  Receipt,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

import analyticsService from "@/services/analytics/analyticsService";

import LoadingSpinner from "@/components/common/LoadingSpinner/LoadingSpinner";
import StatCard from "@/components/dashboard/StatCard";
import SalesTrendChart from "@/components/dashboard/SalesTrendChart";
import CategorySalesChart from "@/components/dashboard/CategorySalesChart";
import PaymentMethodChart from "@/components/dashboard/PaymentMethodChart";
import BranchSalesChart from "@/components/dashboard/BranchSalesChart";
import DashboardAlerts from "@/components/dashboard/DashboardAlerts";

const StoreAdminDashboard = () => {
  const [overview, setOverview] = useState(null);
  const [salesTrends, setSalesTrends] = useState([]);
  const [categorySales, setCategorySales] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [branchSales, setBranchSales] = useState([]);
  const [alerts, setAlerts] = useState([]);

  const [period, setPeriod] = useState("daily");

  const [loading, setLoading] = useState(true);
  const [trendLoading, setTrendLoading] = useState(false);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [
          overviewData,
          trendData,
          categoryData,
          paymentData,
          branchData,
          alertData,
        ] = await Promise.all([
          analyticsService.getOverview(),
          analyticsService.getSalesTrends(period),
          analyticsService.getCategorySales(),
          analyticsService.getPaymentMethodSales(),
          analyticsService.getBranchSales(),
          analyticsService.getAlerts(),
        ]);

        setOverview(overviewData);
        setSalesTrends(trendData || []);
        setCategorySales(categoryData || []);
        setPaymentMethods(paymentData || []);
        setBranchSales(branchData || []);
        setAlerts(alertData || []);
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            "Failed to load store dashboard."
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const handlePeriodChange = async (newPeriod) => {
    if (newPeriod === period) return;

    setPeriod(newPeriod);
    setTrendLoading(true);

    try {
      const data =
        await analyticsService.getSalesTrends(
          newPeriod
        );

      setSalesTrends(data || []);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to load sales trend."
      );
    } finally {
      setTrendLoading(false);
    }
  };

  if (loading) {
    return (
      <LoadingSpinner text="Loading store dashboard..." />
    );
  }

  const stats = [
    {
      title: "Total Revenue",
      value: overview?.totalRevenue,
      description: "Total sales revenue",
      icon: IndianRupee,
      format: "currency",
    },
    {
      title: "Total Orders",
      value: overview?.totalOrders,
      description: "Orders across all branches",
      icon: ShoppingCart,
    },
    {
      title: "Customers",
      value: overview?.totalCustomers,
      description: "Customers served",
      icon: Users,
    },
    {
      title: "Branches",
      value: overview?.totalBranches,
      description: "Branches in your store",
      icon: GitBranch,
    },
    {
      title: "Products",
      value: overview?.totalProducts,
      description: "Products in your store",
      icon: Package,
    },
    {
      title: "Refunds",
      value: overview?.totalRefunds,
      description: "Total refunds",
      icon: RotateCcw,
    },
    {
      title: "Refund Amount",
      value: overview?.totalRefundAmount,
      description: "Total refunded amount",
      icon: Receipt,
      format: "currency",
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
          Store Admin Dashboard
        </h1>

        <p className="mt-1 text-muted-foreground">
          Overview of your store's performance and operations.
        </p>
      </motion.div>

      {/* Statistics */}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <StatCard
            key={stat.title}
            {...stat}
            delay={index * 0.06}
          />
        ))}
      </div>

      {/* Sales Trend */}

      <div className="relative">
        {trendLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-background/60 backdrop-blur-[1px]">
            <LoadingSpinner text="Loading sales..." />
          </div>
        )}

        <SalesTrendChart
          data={salesTrends}
          period={period}
          onPeriodChange={handlePeriodChange}
        />
      </div>

      {/* Category + Payment */}

      <div className="grid gap-6 lg:grid-cols-2">
        <CategorySalesChart data={categorySales} />

        <PaymentMethodChart
          data={paymentMethods}
        />
      </div>

      {/* Branch Sales */}

      <BranchSalesChart data={branchSales} />

      {/* Alerts */}

      <DashboardAlerts alerts={alerts} />

    </div>
  );
};

export default StoreAdminDashboard;