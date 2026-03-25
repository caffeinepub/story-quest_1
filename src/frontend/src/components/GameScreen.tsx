import type { TurnDTO } from "@/backend";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  Eye,
  Flame,
  FlaskConical,
  Footprints,
  Ghost,
  HelpCircle,
  Loader2,
  Moon,
  Package,
  Rocket,
  Search,
  Send,
  Sword,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { GameGenre, useGetGame, useSubmitTurn } from "../hooks/useQueries";

interface GameScreenProps {
  gameId: bigint;
}

const GENRE_SUGGESTIONS: Record<
  GameGenre,
  { label: string; icon: React.ElementType }[]
> = {
  [GameGenre.fantasy]: [
    { label: "Draw your sword", icon: Sword },
    { label: "Cast a spell", icon: Zap },
    { label: "Look around", icon: Eye },
    { label: "Search for herbs", icon: FlaskConical },
  ],
  [GameGenre.sciFi]: [
    { label: "Scan the area", icon: Eye },
    { label: "Hack terminal", icon: Zap },
    { label: "Check ship logs", icon: Package },
    { label: "Contact command", icon: Rocket },
  ],
  [GameGenre.horror]: [
    { label: "Investigate noise", icon: Eye },
    { label: "Hide in shadows", icon: Moon },
    { label: "Search for exit", icon: Footprints },
    { label: "Call for help", icon: HelpCircle },
  ],
  [GameGenre.mystery]: [
    { label: "Examine clues", icon: Search },
    { label: "Interview witness", icon: HelpCircle },
    { label: "Search the room", icon: Eye },
    { label: "Check alibi", icon: Package },
  ],
};

const GENRE_META: Record<
  GameGenre,
  { label: string; icon: React.ElementType; color: string; textColor: string }
> = {
  [GameGenre.fantasy]: {
    label: "Fantasy",
    icon: Sword,
    color: "oklch(0.55 0.12 140 / 0.15)",
    textColor: "oklch(0.70 0.14 140)",
  },
  [GameGenre.sciFi]: {
    label: "Sci-Fi",
    icon: Rocket,
    color: "oklch(0.50 0.10 240 / 0.15)",
    textColor: "oklch(0.65 0.14 240)",
  },
  [GameGenre.horror]: {
    label: "Horror",
    icon: Ghost,
    color: "oklch(0.40 0.10 0 / 0.15)",
    textColor: "oklch(0.60 0.14 22)",
  },
  [GameGenre.mystery]: {
    label: "Mystery",
    icon: Search,
    color: "oklch(0.50 0.08 280 / 0.15)",
    textColor: "oklch(0.68 0.12 280)",
  },
};

function TurnBlock({ turn }: { turn: TurnDTO }) {
  return (
    <div className="space-y-3 animate-fade-in">
      <div className="flex justify-end">
        <div
          className="max-w-[75%] px-4 py-3 rounded-lg text-right"
          style={{
            background: "oklch(var(--gold) / 0.1)",
            border: "1px solid oklch(var(--gold) / 0.3)",
          }}
        >
          <p className="text-xs font-cinzel tracking-wider text-gold-dim mb-1 uppercase">
            You
          </p>
          <p className="text-sm font-fell italic text-foreground">
            {turn.playerAction}
          </p>
        </div>
      </div>

      <div
        className="p-5 rounded-lg"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.40 0.05 68 / 0.12), oklch(0.32 0.04 55 / 0.08))",
          border: "1px solid oklch(var(--gold) / 0.15)",
        }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Flame className="w-3.5 h-3.5 text-gold-dim animate-flicker" />
          <span className="text-xs font-cinzel tracking-[0.2em] text-gold-dim uppercase">
            The Chronicle
          </span>
        </div>
        <p
          className="font-fell text-base text-foreground"
          style={{ lineHeight: "1.8" }}
        >
          {turn.storyText}
        </p>
      </div>
    </div>
  );
}

export function GameScreen({ gameId }: GameScreenProps) {
  const [action, setAction] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { data: game, isLoading } = useGetGame(gameId);
  const submitTurn = useSubmitTurn(gameId);

  const genre = game?.genre ?? GameGenre.fantasy;
  const genreMeta = GENRE_META[genre];
  const GenreIcon = genreMeta.icon;
  const suggestions = GENRE_SUGGESTIONS[genre];

  const turns = game?.turns.length ?? 0;
  const healthPct = Math.max(20, 100 - turns * 4);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  });

  const handleSubmit = async () => {
    const trimmed = action.trim();
    if (!trimmed) return;
    setAction("");
    try {
      await submitTurn.mutateAsync({ action: trimmed, genre });
    } catch {
      toast.error("The story faltered. Try again.");
    }
    textareaRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSuggestion = (label: string) => {
    setAction(label);
    textareaRef.current?.focus();
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-5xl">
      <div className="flex gap-6">
        {/* Main column */}
        <div className="flex-1 min-w-0 space-y-4">
          {/* Story Panel */}
          <div
            className="rounded-lg overflow-hidden"
            style={{
              border: "1px solid oklch(var(--gold) / 0.25)",
              boxShadow: "0 4px 24px oklch(0 0 0 / 0.4)",
            }}
            data-ocid="game.panel"
          >
            <div
              className="px-5 py-3 flex items-center gap-3"
              style={{
                background: "oklch(0.14 0.008 220)",
                borderBottom: "1px solid oklch(var(--gold) / 0.2)",
              }}
            >
              <Flame className="w-4 h-4 text-gold animate-flicker" />
              <span className="font-cinzel text-xs tracking-[0.3em] text-gold uppercase">
                Chronicle of Adventure
              </span>
            </div>

            <ScrollArea className="h-[420px]">
              <div ref={scrollRef} className="p-6 space-y-6">
                {isLoading ? (
                  <div className="space-y-4" data-ocid="game.loading_state">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-16 w-full rounded-lg" />
                    ))}
                  </div>
                ) : !game || game.turns.length === 0 ? (
                  <motion.div
                    className="text-center py-12"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    data-ocid="game.empty_state"
                  >
                    <div
                      className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                      style={{
                        background: genreMeta.color,
                        border: `1px solid ${genreMeta.textColor}`,
                      }}
                    >
                      <GenreIcon
                        className="w-8 h-8"
                        style={{ color: genreMeta.textColor }}
                      />
                    </div>
                    <p className="font-cinzel text-sm tracking-wide text-gold-dim mb-2">
                      Your {genreMeta.label} adventure awaits
                    </p>
                    <p className="font-fell italic text-muted-foreground text-sm">
                      Type an action below to begin your chronicle...
                    </p>
                  </motion.div>
                ) : (
                  game.turns.map((turn) => (
                    <TurnBlock
                      key={
                        turn.playerAction.slice(0, 30) +
                        turn.storyText.slice(0, 10)
                      }
                      turn={turn}
                    />
                  ))
                )}

                {submitTurn.isPending && (
                  <motion.div
                    className="flex items-center gap-3 py-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    data-ocid="game.loading_state"
                  >
                    <Loader2 className="w-5 h-5 animate-spin text-gold-dim" />
                    <span className="font-fell italic text-muted-foreground text-sm">
                      The chronicle unfolds...
                    </span>
                  </motion.div>
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-2">
            {suggestions.map((s) => {
              const SIcon = s.icon;
              return (
                <button
                  type="button"
                  key={s.label}
                  onClick={() => handleSuggestion(s.label)}
                  disabled={submitTurn.isPending}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-cinzel tracking-wide transition-all duration-150 disabled:opacity-40"
                  style={{
                    background: "oklch(0.18 0.008 220)",
                    border: "1px solid oklch(var(--border))",
                    color: "oklch(var(--muted-foreground))",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor =
                      "oklch(var(--gold) / 0.5)";
                    (e.currentTarget as HTMLElement).style.color =
                      "oklch(var(--gold-light))";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor =
                      "oklch(var(--border))";
                    (e.currentTarget as HTMLElement).style.color =
                      "oklch(var(--muted-foreground))";
                  }}
                  data-ocid="game.action.button"
                >
                  <SIcon className="w-3 h-3" />
                  {s.label}
                </button>
              );
            })}
          </div>

          {/* Input */}
          <div
            className="rounded-lg p-4 space-y-3"
            style={{
              background: "oklch(0.16 0.008 220)",
              border: "1px solid oklch(var(--gold) / 0.2)",
            }}
            data-ocid="game.input.panel"
          >
            <div className="flex gap-3">
              <Textarea
                ref={textareaRef}
                value={action}
                onChange={(e) => setAction(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  submitTurn.isPending
                    ? "Waiting for the story..."
                    : "What do you do? (Enter to submit)"
                }
                disabled={submitTurn.isPending || isLoading}
                rows={2}
                className="resize-none font-fell text-base border-0 focus-visible:ring-0 text-foreground placeholder:text-muted-foreground p-0"
                style={{ background: "transparent" }}
                data-ocid="game.action.textarea"
              />
              <Button
                onClick={handleSubmit}
                disabled={submitTurn.isPending || isLoading || !action.trim()}
                className="px-4 self-end flex-shrink-0"
                style={{
                  background: "oklch(var(--gold) / 0.15)",
                  border: "1px solid oklch(var(--gold) / 0.5)",
                  color: "oklch(var(--gold-light))",
                }}
                data-ocid="game.submit.button"
              >
                {submitTurn.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground font-cinzel tracking-wider">
              Shift+Enter for new line
            </p>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="w-56 flex-shrink-0 space-y-4 hidden lg:block">
          <div
            className="rounded-lg p-4"
            style={{
              background: "oklch(0.16 0.008 220)",
              border: "1px solid oklch(var(--gold) / 0.2)",
            }}
            data-ocid="game.sidebar.panel"
          >
            <p className="font-cinzel text-xs tracking-[0.25em] text-gold-dim uppercase mb-3">
              Realm
            </p>
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded flex items-center justify-center"
                style={{ background: genreMeta.color }}
              >
                <GenreIcon
                  className="w-4 h-4"
                  style={{ color: genreMeta.textColor }}
                />
              </div>
              <span
                className="font-cinzel text-sm font-bold"
                style={{ color: genreMeta.textColor }}
              >
                {genreMeta.label}
              </span>
            </div>
          </div>

          <div
            className="rounded-lg p-4 space-y-4"
            style={{
              background: "oklch(0.16 0.008 220)",
              border: "1px solid oklch(var(--gold) / 0.2)",
            }}
          >
            <p className="font-cinzel text-xs tracking-[0.25em] text-gold-dim uppercase">
              Stats
            </p>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-xs font-cinzel tracking-wide text-muted-foreground">
                  Vitality
                </span>
                <span className="text-xs font-cinzel text-destructive">
                  {healthPct}%
                </span>
              </div>
              <div
                className="h-2 rounded-full overflow-hidden"
                style={{ background: "oklch(0.32 0.08 22)" }}
              >
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: "oklch(0.48 0.13 22)" }}
                  animate={{ width: `${healthPct}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs font-cinzel tracking-wide text-muted-foreground">
                Chronicles
              </span>
              <span className="font-cinzel text-sm font-bold text-gold">
                {turns}
              </span>
            </div>

            <div>
              <p className="text-xs font-cinzel tracking-wide text-muted-foreground mb-2">
                Inventory
              </p>
              <div className="space-y-1">
                {["Ancient Scroll", "Worn Dagger", "Healing Potion"].map(
                  (item) => (
                    <div key={item} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-gold-dim" />
                      <span className="text-xs font-fell text-muted-foreground">
                        {item}
                      </span>
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
