import type { StableGameSessionDTO } from "@/backend";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Ghost,
  Loader2,
  Rocket,
  Search,
  Sparkles,
  Sword,
  Trash2,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import {
  GameGenre,
  useCreateGame,
  useDeleteGame,
  useListGames,
} from "../hooks/useQueries";

interface LobbyScreenProps {
  onGameStart: (gameId: bigint) => void;
}

const GENRES = [
  {
    id: GameGenre.fantasy,
    label: "Fantasy",
    icon: Sword,
    description:
      "Embark on a magical quest through enchanted lands filled with dragons, ancient magic, and heroic deeds.",
    color: "oklch(0.55 0.12 140 / 0.15)",
    borderColor: "oklch(0.55 0.12 140 / 0.5)",
    textColor: "oklch(0.70 0.14 140)",
  },
  {
    id: GameGenre.sciFi,
    label: "Sci-Fi",
    icon: Rocket,
    description:
      "Explore the cosmos, colonize distant worlds, and uncover the secrets of advanced civilizations.",
    color: "oklch(0.50 0.10 240 / 0.15)",
    borderColor: "oklch(0.55 0.12 240 / 0.5)",
    textColor: "oklch(0.65 0.14 240)",
  },
  {
    id: GameGenre.horror,
    label: "Horror",
    icon: Ghost,
    description:
      "Face your deepest fears in terrifying environments where survival is never guaranteed.",
    color: "oklch(0.40 0.10 0 / 0.15)",
    borderColor: "oklch(0.48 0.13 22 / 0.5)",
    textColor: "oklch(0.60 0.14 22)",
  },
  {
    id: GameGenre.mystery,
    label: "Mystery",
    icon: Search,
    description:
      "Unravel dark secrets, interrogate suspects, and piece together the truth from scattered clues.",
    color: "oklch(0.50 0.08 280 / 0.15)",
    borderColor: "oklch(0.55 0.10 280 / 0.5)",
    textColor: "oklch(0.68 0.12 280)",
  },
];

function genreLabel(genre: GameGenre): string {
  const map: Record<GameGenre, string> = {
    [GameGenre.fantasy]: "Fantasy",
    [GameGenre.sciFi]: "Sci-Fi",
    [GameGenre.horror]: "Horror",
    [GameGenre.mystery]: "Mystery",
  };
  return map[genre] ?? genre;
}

function lastAction(session: StableGameSessionDTO): string {
  if (session.turns.length === 0) return "Adventure just begun...";
  const last = session.turns[session.turns.length - 1];
  if (last.playerAction.length > 60) {
    return `${last.playerAction.slice(0, 60)}...`;
  }
  return last.playerAction;
}

export function LobbyScreen({ onGameStart }: LobbyScreenProps) {
  const [selectedGenre, setSelectedGenre] = useState<GameGenre>(
    GameGenre.fantasy,
  );
  const { data: games, isLoading: gamesLoading } = useListGames();
  const createGame = useCreateGame();
  const deleteGame = useDeleteGame();

  const handleBeginAdventure = async () => {
    try {
      const gameId = await createGame.mutateAsync(selectedGenre);
      onGameStart(gameId);
    } catch {
      toast.error("Failed to create game. Please try again.");
    }
  };

  const handleDelete = async (e: React.MouseEvent, gameId: bigint) => {
    e.stopPropagation();
    try {
      await deleteGame.mutateAsync(gameId);
      toast.success("Chronicle removed.");
    } catch {
      toast.error("Failed to delete game.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      {/* Hero */}
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="ornament-divider mb-6">
          <span className="text-xs font-cinzel tracking-[0.4em] text-gold-dim uppercase">
            Enter the Realm
          </span>
        </div>
        <h1
          className="font-cinzel text-5xl md:text-7xl font-black text-gold-light tracking-widest uppercase mb-4"
          style={{ textShadow: "0 0 40px oklch(var(--gold) / 0.3)" }}
        >
          Story Quest
        </h1>
        <p className="font-fell italic text-xl text-muted-foreground max-w-lg mx-auto leading-relaxed">
          Your choices shape the chronicle. Every decision writes a new page in
          the eternal saga.
        </p>
      </motion.div>

      {/* Genre Picker */}
      <motion.section
        className="mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        data-ocid="lobby.section"
      >
        <h2 className="font-cinzel text-sm tracking-[0.3em] text-gold-dim uppercase mb-6 text-center">
          Choose Your Realm
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {GENRES.map((g, i) => {
            const Icon = g.icon;
            const isSelected = selectedGenre === g.id;
            return (
              <motion.button
                type="button"
                key={g.id}
                onClick={() => setSelectedGenre(g.id)}
                className="relative p-5 rounded-lg text-left transition-all duration-200 group"
                style={{
                  background: isSelected ? g.color : "oklch(0.16 0.008 220)",
                  border: `1px solid ${isSelected ? g.borderColor : "oklch(var(--border))"}`,
                  boxShadow: isSelected ? `0 0 20px ${g.color}` : "none",
                }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.07 }}
                data-ocid="lobby.genre.tab"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Icon className="w-6 h-6 mb-3" style={{ color: g.textColor }} />
                <h3
                  className="font-cinzel font-bold text-sm tracking-wide mb-2"
                  style={{
                    color: isSelected
                      ? g.textColor
                      : "oklch(var(--foreground))",
                  }}
                >
                  {g.label}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                  {g.description}
                </p>
                {isSelected && (
                  <div
                    className="absolute top-2 right-2 w-2 h-2 rounded-full"
                    style={{ background: g.textColor }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>

        <div className="flex justify-center">
          <Button
            onClick={handleBeginAdventure}
            disabled={createGame.isPending}
            className="px-10 py-6 text-base font-cinzel tracking-[0.2em] uppercase"
            style={{
              background:
                "linear-gradient(135deg, oklch(var(--gold) / 0.25), oklch(var(--gold) / 0.12))",
              border: "1px solid oklch(var(--gold) / 0.7)",
              color: "oklch(var(--gold-light))",
              boxShadow: "0 4px 20px oklch(var(--gold) / 0.2)",
            }}
            data-ocid="lobby.begin_adventure.primary_button"
          >
            {createGame.isPending ? (
              <>
                <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                Summoning...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 w-5 h-5" />
                Begin Adventure
              </>
            )}
          </Button>
        </div>
      </motion.section>

      {/* Saved Games */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.35 }}
      >
        <div className="ornament-divider mb-6">
          <span className="text-xs font-cinzel tracking-[0.3em] text-gold-dim uppercase">
            Saved Chronicles
          </span>
        </div>

        {gamesLoading ? (
          <div
            className="flex items-center justify-center py-12"
            data-ocid="lobby.loading_state"
          >
            <Loader2 className="w-8 h-8 animate-spin text-gold-dim" />
          </div>
        ) : !games || games.length === 0 ? (
          <div
            className="text-center py-12 rounded-lg"
            style={{
              background: "oklch(0.15 0.008 220)",
              border: "1px solid oklch(var(--border))",
            }}
            data-ocid="lobby.empty_state"
          >
            <Sword className="w-10 h-10 mx-auto mb-3 text-gold-dim opacity-50" />
            <p className="font-cinzel text-sm tracking-wide text-muted-foreground">
              No chronicles yet. Begin your first adventure above.
            </p>
          </div>
        ) : (
          <div className="grid gap-3">
            {games.map(([gameId, session], idx) => {
              const genreInfo = GENRES.find((g) => g.id === session.genre);
              const Icon = genreInfo?.icon ?? Sword;
              const itemOcid = `lobby.game.item.${idx + 1}`;
              const deleteOcid = `lobby.game.delete_button.${idx + 1}`;
              return (
                <motion.div
                  key={gameId.toString()}
                  className="flex items-center gap-4 p-4 rounded-lg cursor-pointer group transition-all duration-200"
                  style={{
                    background: "oklch(0.16 0.008 220)",
                    border: "1px solid oklch(var(--border))",
                  }}
                  onClick={() => onGameStart(gameId)}
                  whileHover={{ borderColor: "oklch(var(--gold) / 0.4)", x: 2 }}
                  data-ocid={itemOcid}
                >
                  <div
                    className="w-10 h-10 rounded flex items-center justify-center flex-shrink-0"
                    style={{
                      background: genreInfo?.color ?? "oklch(var(--muted))",
                      border: `1px solid ${genreInfo?.borderColor ?? "transparent"}`,
                    }}
                  >
                    <Icon
                      className="w-5 h-5"
                      style={{ color: genreInfo?.textColor }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-cinzel text-sm font-bold text-foreground tracking-wide">
                        {genreLabel(session.genre)} Chronicle
                      </span>
                      <Badge
                        variant="outline"
                        className="text-xs font-cinzel"
                        style={{
                          borderColor: genreInfo?.borderColor,
                          color: genreInfo?.textColor,
                        }}
                      >
                        {session.turns.length} turns
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground truncate font-fell italic">
                      {lastAction(session)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs font-cinzel tracking-wide text-gold-dim hover:text-gold-light opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        onGameStart(gameId);
                      }}
                    >
                      Continue
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-8 h-8 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => handleDelete(e, gameId)}
                      disabled={deleteGame.isPending}
                      data-ocid={deleteOcid}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.section>
    </div>
  );
}
