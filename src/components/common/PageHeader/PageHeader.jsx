import { Button } from "@/components/ui/button";

const PageHeader = ({ title, description, buttonLabel, onButtonClick }) => {
  return (
    <div className="mb-6 flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>

        {description && (
          <p className="mt-1 text-muted-foreground">{description}</p>
        )}
      </div>

      {buttonLabel && <Button onClick={onButtonClick}>{buttonLabel}</Button>}
    </div>
  );
};

export default PageHeader;
