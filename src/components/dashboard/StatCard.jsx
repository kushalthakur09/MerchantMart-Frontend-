import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

const StatCard = ({
  title,
  value,
  description,
  icon: Icon,
  format = "number",
  delay = 0,
}) => {
  const formattedValue =
    format === "currency"
      ? `₹${Number(value || 0).toLocaleString("en-IN", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`
      : value;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.35,
        delay,
      }}
    >
      <Card>
        <CardContent className="p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-sm text-muted-foreground">
                {title}
              </p>

              <p className="mt-2 truncate text-2xl font-bold tracking-tight">
                {formattedValue}
              </p>

              {description && (
                <p className="mt-2 text-xs text-muted-foreground">
                  {description}
                </p>
              )}
            </div>

            {Icon && (
              <div className="shrink-0 rounded-lg bg-primary/10 p-3">
                <Icon className="h-5 w-5 text-primary" />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default StatCard;