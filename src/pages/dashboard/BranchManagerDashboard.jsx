import { useEffect, useState } from "react";

import branchAnalyticsService from "@/services/analytics/branchAnalyticsService";
import LoadingSpinner from "@/components/common/LoadingSpinner/LoadingSpinner";

import StatCard from "@/components/dashboard/StatCard";
import SalesTrendChart from "@/components/dashboard/SalesTrendChart";
import CategorySalesChart from "@/components/dashboard/CategorySalesChart";
import PaymentMethodChart from "@/components/dashboard/PaymentMethodChart";

const BranchManagerDashboard = () => {
  const [overview, setOverview] = useState(null);
  const [salesData, setSalesData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [topCashiers, setTopCashiers] = useState([]);
  const [categorySales, setCategorySales] = useState([]);
  const [paymentBreakdown, setPaymentBreakdown] = useState([]);

  const [loading, setLoading] = useState(true);
  const [salesLoading, setSalesLoading] = useState(false);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);

        const [
          overviewData,
          salesData,
          topProductsData,
          topCashiersData,
          categoryData,
          paymentData,
        ] = await Promise.all([
          branchAnalyticsService.getTodayOverview(),
          branchAnalyticsService.getDailySales(7),
          branchAnalyticsService.getTopProducts(),
          branchAnalyticsService.getTopCashiers(),
          branchAnalyticsService.getCategorySales(),
          branchAnalyticsService.getPaymentBreakdown(),
        ]);

        setOverview(overviewData);
        setSalesData(salesData);
        setTopProducts(topProductsData);
        setTopCashiers(topCashiersData);
        setCategorySales(categoryData);
        setPaymentBreakdown(paymentData);
      } catch (error) {
        console.error(
          "Failed to load branch manager dashboard:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const handleSalesPeriodChange = async (period) => {
    let days = 7;

    if (period === "weekly") {
      days = 30;
    }

    if (period === "monthly") {
      days = 90;
    }

    try {
      setSalesLoading(true);

      const data =
        await branchAnalyticsService.getDailySales(days);

      setSalesData(data);
    } catch (error) {
      console.error("Failed to load sales data:", error);
    } finally {
      setSalesLoading(false);
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
          Branch Manager Dashboard
        </h1>

        <p className="text-muted-foreground">
          Monitor today's branch performance, sales, staff, and
          operations.
        </p>
      </div>

      {/* Today's Overview */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Today's Sales"
          value={`₹${(
            overview?.totalSales ?? 0
          ).toLocaleString("en-IN")}`}
        />

        <StatCard
          title="Today's Orders"
          value={(overview?.totalOrders ?? 0).toLocaleString(
            "en-IN"
          )}
        />

        <StatCard
          title="Today's Customers"
          value={(overview?.totalCustomers ?? 0).toLocaleString(
            "en-IN"
          )}
        />

        <StatCard
          title="Today's Refunds"
          value={(overview?.totalRefunds ?? 0).toLocaleString(
            "en-IN"
          )}
        />

        <StatCard
          title="Refund Amount"
          value={`₹${(
            overview?.totalRefundAmount ?? 0
          ).toLocaleString("en-IN")}`}
        />
      </div>

      {/* Sales Trend */}
      <div className="relative">
        {salesLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-background/60">
            <LoadingSpinner />
          </div>
        )}

        <SalesTrendChart
          data={salesData}
          period="daily"
          onPeriodChange={handleSalesPeriodChange}
        />
      </div>

      {/* Category + Payment */}
      <div className="grid gap-6 lg:grid-cols-2">
        <CategorySalesChart data={categorySales} />

        <PaymentMethodChart
          data={paymentBreakdown.map((item) => ({
            paymentType: item.paymentType,
            totalSales: item.totalAmount,
          }))}
        />
      </div>

      {/* Top Products */}
      <div className="rounded-lg border bg-card">
        <div className="border-b p-5">
          <h2 className="text-lg font-semibold">
            Top Products
          </h2>

          <p className="text-sm text-muted-foreground">
            Best-selling products in your branch.
          </p>
        </div>

        <div className="divide-y">
          {topProducts.length === 0 ? (
            <div className="p-5 text-sm text-muted-foreground">
              No product sales available.
            </div>
          ) : (
            topProducts.map((product, index) => (
              <div
                key={`${product.productName}-${index}`}
                className="flex items-center justify-between gap-4 p-4"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold">
                    {index + 1}
                  </div>

                  <p className="truncate font-medium">
                    {product.productName}
                  </p>
                </div>

                <div className="shrink-0 text-right">
                  <p className="font-semibold">
                    {product.quantitySold.toLocaleString("en-IN")}
                  </p>

                  <p className="text-xs text-muted-foreground">
                    {product.percentage}% of sales
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Top Cashiers */}
      <div className="rounded-lg border bg-card">
        <div className="border-b p-5">
          <h2 className="text-lg font-semibold">
            Top Cashiers
          </h2>

          <p className="text-sm text-muted-foreground">
            Cashier revenue performance in your branch.
          </p>
        </div>

        <div className="divide-y">
          {topCashiers.length === 0 ? (
            <div className="p-5 text-sm text-muted-foreground">
              No cashier sales available.
            </div>
          ) : (
            topCashiers.map((cashier, index) => (
              <div
                key={`${cashier.cashierName}-${index}`}
                className="flex items-center justify-between gap-4 p-4"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold">
                    {index + 1}
                  </div>

                  <p className="truncate font-medium">
                    {cashier.cashierName}
                  </p>
                </div>

                <p className="shrink-0 font-semibold">
                  ₹{Number(cashier.revenue || 0).toLocaleString("en-IN")}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default BranchManagerDashboard;