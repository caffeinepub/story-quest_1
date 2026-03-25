import { Button } from "@/components/ui/button";
import { ChevronLeft, Flame, Plus } from "lucide-react";

interface HeaderProps {
  onNewGame: () => void;
  showBackButton?: boolean;
  onBack?: () => void;
}

export function Header({ onNewGame, showBackButton, onBack }: HeaderProps) {
  return (
    <header
      className="sticky top-0 z-50 border-b"
      style={{
        background: "oklch(0.13 0.008 220)",
        borderColor: "oklch(var(--gold) / 0.2)",
        boxShadow:
          "0 1px 0 oklch(var(--gold) / 0.1), 0 2px 12px oklch(0 0 0 / 0.4)",
      }}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <button
          type="button"
          onClick={onNewGame}
          className="flex items-center gap-3 group"
          data-ocid="header.link"
        >
          <div
            className="w-9 h-9 rounded flex items-center justify-center"
            style={{
              background: "oklch(var(--gold) / 0.15)",
              border: "1px solid oklch(var(--gold) / 0.4)",
            }}
          >
            <Flame className="w-5 h-5 text-gold animate-flicker" />
          </div>
          <span className="font-cinzel text-lg font-bold text-gold-light tracking-widest uppercase hidden sm:block group-hover:text-gold transition-colors">
            Story Quest
          </span>
        </button>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-6">
          <button
            type="button"
            onClick={onNewGame}
            className="text-sm font-cinzel tracking-wider text-muted-foreground hover:text-gold-light transition-colors"
            data-ocid="nav.lobby.link"
          >
            Library
          </button>
          <span className="text-border text-xs">⚔</span>
          <button
            type="button"
            className="text-sm font-cinzel tracking-wider text-muted-foreground hover:text-gold-light transition-colors"
            data-ocid="nav.about.link"
          >
            Chronicles
          </button>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {showBackButton && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="gap-2 font-cinzel tracking-wide text-muted-foreground hover:text-gold-light"
              data-ocid="header.back.button"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Library</span>
            </Button>
          )}
          <Button
            onClick={onNewGame}
            size="sm"
            className="gap-2 font-cinzel tracking-wide"
            style={{
              background: "oklch(var(--gold) / 0.12)",
              border: "1px solid oklch(var(--gold) / 0.5)",
              color: "oklch(var(--gold-light))",
            }}
            data-ocid="header.new_game.button"
          >
            <Plus className="w-4 h-4" />
            New Game
          </Button>
        </div>
      </div>
    </header>
  );
}
