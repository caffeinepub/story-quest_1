import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface TurnInputDTO {
    action: string;
    genre: GameGenre;
}
export interface StableGameSessionDTO {
    turns: Array<TurnDTO>;
    genre: GameGenre;
}
export type GameId = bigint;
export interface TurnDTO {
    playerAction: string;
    storyText: string;
}
export enum GameGenre {
    sciFi = "sciFi",
    mystery = "mystery",
    horror = "horror",
    fantasy = "fantasy"
}
export interface backendInterface {
    createGame(genre: GameGenre): Promise<bigint>;
    deleteGame(gameId: bigint): Promise<boolean>;
    getGame(gameId: bigint): Promise<StableGameSessionDTO | null>;
    listGames(): Promise<Array<[GameId, StableGameSessionDTO]>>;
    submitTurn(gameId: bigint, input: TurnInputDTO): Promise<void>;
}
