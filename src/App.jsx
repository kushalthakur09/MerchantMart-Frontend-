import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Button } from "@/components/ui/button";

function App() {
  return (
    <div className="flex h-screen items-center justify-center bg-background text-foreground">
      <Button>hii</Button>
      <ThemeToggle />
    </div>
  );
}

export default App;
