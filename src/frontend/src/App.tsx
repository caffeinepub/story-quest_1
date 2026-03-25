import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { GameScreen } from "./components/GameScreen";
import { Header } from "./components/Header";
import { LobbyScreen } from "./components/LobbyScreen";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 1000 * 30, retry: 1 },
  },
});

type Screen = { type: "lobby" } | { type: "game"; gameId: bigint };

function AppInner() {
  const [screen, setScreen] = useState<Screen>({ type: "lobby" });

  const handleGameStart = (gameId: bigint) => {
    setScreen({ type: "game", gameId });
  };

  const handleBackToLobby = () => {
    setScreen({ type: "lobby" });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        onNewGame={handleBackToLobby}
        showBackButton={screen.type === "game"}
        onBack={handleBackToLobby}
      />

      <main className="flex-1">
        {screen.type === "lobby" ? (
          <LobbyScreen onGameStart={handleGameStart} />
        ) : (
          <GameScreen gameId={screen.gameId} />
        )}
      </main>

      <footer className="py-5 text-center border-t border-border">
        <p className="text-xs text-muted-foreground font-sans">
          © {new Date().getFullYear()} Story Quest • Built with ♥ using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gold-dim hover:text-gold transition-colors underline underline-offset-2"
          >
            caffeine.ai
          </a>
        </p>
      </footer>

      <Toaster position="top-center" />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppInner />
    </QueryClientProvider>
  );
}

export default App;
