import { useEffect, useState } from "react";

import analyticsService from "@/services/analytics/analyticsService";
import LoadingSpinner from "@/components/common/LoadingSpinner/LoadingSpinner";

import StatCard from "@/components/dashboard/StatCard";
import SalesTrendChart from "@/components/dashboard/SalesTrendChart";
import CategorySalesChart from "@/components/dashboard/CategorySalesChart";
import PaymentMethodChart from "@/components/dashboard/PaymentMethodChart";
import BranchSalesChart from "@/components/dashboard/BranchSalesChart";
import DashboardAlerts from "@/components/dashboard/DashboardAlerts";

const StoreManagerDashboard = () => {
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
        setLoading(true);

        const [
          overviewData,
          trendsData,
          categoryData,
          paymentData,
          branchData,
          alertsData,
        ] = await Promise.all([
          analyticsService.getOverview(),
          analyticsService.getSalesTrends(period),
          analyticsService.getCategorySales(),
          analyticsService.getPaymentMethodSales(),
          analyticsService.getBranchSales(),
          analyticsService.getAlerts(),
        ]);

        setOverview(overviewData);
        setSalesTrends(trendsData);
        setCategorySales(categoryData);
        setPaymentMethods(paymentData);
        setBranchSales(branchData);
        setAlerts(alertsData);
      } catch (error) {
        console.error("Failed to load store manager dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const handlePeriodChange = async (newPeriod) => {
    try {
      setPeriod(newPeriod);
      setTrendLoading(true);

      const data = await analyticsService.getSalesTrends(newPeriod);
      setSalesTrends(data);
    } catch (error) {
      console.error("Failed to load sales trends:", error);
    } finally {
      setTrendLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Store Manager Dashboard
        </h1>

        <p className="text-muted-foreground">
          Monitor store performance, sales, branches, and operations.
        </p>
      </div>

      {/* Overview */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value={`₹${(overview?.totalRevenue ?? 0).toLocaleString("en-IN")}`}
        />

        <StatCard
          title="Total Orders"
          value={(overview?.totalOrders ?? 0).toLocaleString("en-IN")}
        />

        <StatCard
          title="Customers"
          value={(overview?.totalCustomers ?? 0).toLocaleString("en-IN")}
        />

        <StatCard
          title="Branches"
          value={(overview?.totalBranches ?? 0).toLocaleString("en-IN")}
        />

        <StatCard
          title="Products"
          value={(overview?.totalProducts ?? 0).toLocaleString("en-IN")}
        />

        <StatCard
          title="Refunds"
          value={(overview?.totalRefunds ?? 0).toLocaleString("en-IN")}
        />

        <StatCard
          title="Refund Amount"
          value={`₹${(overview?.totalRefundAmount ?? 0).toLocaleString(
            "en-IN"
          )}`}
        />
      </div>

      {/* Sales Trend */}
      <div className="relative">
        {trendLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-background/60">
            <LoadingSpinner />
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
        <PaymentMethodChart data={paymentMethods} />
      </div>

      {/* Branch Performance */}
      <BranchSalesChart data={branchSales} />

      {/* Alerts */}
      <DashboardAlerts alerts={alerts} />
    </div>
  );
};

export default StoreManagerDashboard;