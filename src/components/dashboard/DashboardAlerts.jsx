import {
  AlertTriangle,
  CircleAlert,
  Info,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const severityIcon = {
  CRITICAL: CircleAlert,
  WARNING: AlertTriangle,
  INFO: Info,
};

const DashboardAlerts = ({ alerts = [] }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Store Alerts</CardTitle>

        <p className="text-sm text-muted-foreground">
          Important things requiring your attention.
        </p>
      </CardHeader>

      <CardContent>
        {alerts.length === 0 ? (
          <div className="rounded-lg border border-dashed p-6 text-center">
            <p className="font-medium">
              Everything looks good
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              There are no active alerts for your store.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {alerts.map((alert, index) => {
              const Icon =
                severityIcon[alert.severity] || Info;

              return (
                <div
                  key={`${alert.title}-${index}`}
                  className="flex gap-3 rounded-lg border p-4"
                >
                  <div className="mt-0.5 shrink-0">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>

                  <div className="min-w-0">
                    <p className="font-medium">
                      {alert.title}
                    </p>

                    <p className="mt-1 text-sm text-muted-foreground">
                      {alert.message}
                    </p>

                    {alert.action && (
                      <p className="mt-2 text-xs font-medium">
                        Suggested action: {alert.action}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DashboardAlerts;