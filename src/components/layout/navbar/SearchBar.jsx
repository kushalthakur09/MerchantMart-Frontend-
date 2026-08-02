import { Search } from "lucide-react";

const SearchBar = () => {
  return (
    <button className="flex h-10 w-full max-w-sm items-center justify-between rounded-lg border bg-background px-3 text-sm text-muted-foreground hover:bg-accent">
      <div className="flex items-center gap-2">
        <Search className="h-4 w-4" />
        <span>Search products, orders...</span>
      </div>

      <kbd className="rounded border bg-muted px-2 py-0.5 text-xs">Ctrl K</kbd>
    </button>
  );
};

export default SearchBar;
