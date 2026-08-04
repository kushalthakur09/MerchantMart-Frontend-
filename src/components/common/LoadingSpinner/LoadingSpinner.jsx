import { Loader2 } from "lucide-react";

const LoadingSpinner = ({
  text = "Loading...",
  size = 24,
}) => {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-10">
      <Loader2
        size={size}
        className="animate-spin text-primary"
      />

      <p className="text-sm text-muted-foreground">
        {text}
      </p>
    </div>
  );
};

export default LoadingSpinner;