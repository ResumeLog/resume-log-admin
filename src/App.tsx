import { Logo } from "@/components/Logo";
import { Button } from "@/lib/components";

function App() {
  return (
    <div className="flex h-dvh flex-col items-center justify-center gap-4">
      <Logo />
      <Button size="large">Admin</Button>
    </div>
  );
}

export default App;
