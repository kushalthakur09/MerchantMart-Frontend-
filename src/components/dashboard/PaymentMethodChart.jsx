import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const formatCurrency = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN")}`;

const PaymentMethodChart = ({ data = [] }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Methods</CardTitle>

        <p className="text-sm text-muted-foreground">
          Sales by payment method.
        </p>
      </CardHeader>

      <CardContent>
        {data.length === 0 ? (
          <div className="flex h-[300px] items-center justify-center text-sm text-muted-foreground">
            No payment data available.
          </div>
        ) : (
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="totalSales"
                  nameKey="paymentType"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label={({ paymentType, percent }) =>
                    `${paymentType} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} />
                  ))}
                </Pie>

                <Tooltip
                  formatter={(value) => [
                    formatCurrency(value),
                    "Sales",
                  ]}
                />

                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PaymentMethodChart;