import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { GameGenre } from "../backend";
import { useActor } from "./useActor";

export { GameGenre };

export function useListGames() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["games"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listGames();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetGame(gameId: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["game", gameId?.toString()],
    queryFn: async () => {
      if (!actor || gameId === null) return null;
      return actor.getGame(gameId);
    },
    enabled: !!actor && !isFetching && gameId !== null,
  });
}

export function useCreateGame() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (genre: GameGenre) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.createGame(genre);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["games"] });
    },
  });
}

export function useDeleteGame() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (gameId: bigint) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.deleteGame(gameId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["games"] });
    },
  });
}

export function useSubmitTurn(gameId: bigint | null) {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      action,
      genre,
    }: { action: string; genre: GameGenre }) => {
      if (!actor || gameId === null) throw new Error("No active game");
      await actor.submitTurn(gameId, { action, genre });
      return actor.getGame(gameId);
    },
    onSuccess: (data) => {
      if (gameId !== null) {
        queryClient.setQueryData(["game", gameId.toString()], data);
        queryClient.invalidateQueries({ queryKey: ["games"] });
      }
    },
  });
}
