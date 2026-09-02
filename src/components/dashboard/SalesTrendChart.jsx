import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const periods = [
  { label: "Daily", value: "daily" },
  { label: "Weekly", value: "weekly" },
  { label: "Monthly", value: "monthly" },
];

const formatCurrency = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN")}`;

const SalesTrendChart = ({
  data = [],
  period,
  onPeriodChange,
}) => {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Sales Trend</CardTitle>

            <p className="mt-1 text-sm text-muted-foreground">
              Sales performance over time.
            </p>
          </div>

          <div className="flex w-fit rounded-lg border p-1">
            {periods.map((item) => (
              <Button
                key={item.value}
                variant={
                  period === item.value
                    ? "default"
                    : "ghost"
                }
                size="sm"
                onClick={() =>
                  onPeriodChange(item.value)
                }
              >
                {item.label}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {data.length === 0 ? (
          <div className="flex h-[300px] items-center justify-center text-sm text-muted-foreground">
            No sales data available.
          </div>
        ) : (
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data}
                margin={{
                  top: 10,
                  right: 10,
                  left: 10,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 12 }}
                />

                <YAxis
                  tick={{ fontSize: 12 }}
                  tickFormatter={formatCurrency}
                />

                <Tooltip
                  formatter={(value) => [
                    formatCurrency(value),
                    "Sales",
                  ]}
                />

                <Line
                  type="monotone"
                  dataKey="totalSales"
                  stroke="currentColor"
                  className="text-primary"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SalesTrendChart;