import { Button } from "@/components/ui/button";

const Pagination = ({ currentPage, totalPages, onPrevious, onNext }) => {
  return (
    <div className="mt-6 flex items-center justify-between">
      <Button
        variant="outline"
        disabled={currentPage === 1}
        onClick={onPrevious}
      >
        Previous
      </Button>

      <span className="text-sm text-muted-foreground">
        Page {currentPage} of {totalPages}
      </span>

      <Button
        variant="outline"
        disabled={currentPage === totalPages}
        onClick={onNext}
      >
        Next
      </Button>
    </div>
  );
};

export default Pagination;
