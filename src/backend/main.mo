import Map "mo:core/Map";
import Nat "mo:core/Nat";
import List "mo:core/List";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Migration "migration";

(with migration = Migration.run)
actor {
  type GameGenre = {
    #fantasy;
    #sciFi;
    #horror;
    #mystery;
  };

  type Turn = {
    playerAction : Text;
    storyText : Text;
  };

  type GameSession = {
    genre : GameGenre;
    turns : List.List<Turn>;
  };

  type StableGameSession = {
    genre : GameGenre;
    turns : [Turn];
  };

  type TurnInput = {
    genre : GameGenre;
    action : Text;
  };

  type GameId = Nat;

  type GameState = Map.Map<GameId, GameSession>;

  let players = Map.empty<Principal, GameState>();

  public type TurnInputDTO = {
    genre : GameGenre;
    action : Text;
  };

  public type TurnDTO = {
    playerAction : Text;
    storyText : Text;
  };

  public type StableGameSessionDTO = {
    genre : GameGenre;
    turns : [TurnDTO];
  };

  func toStableSession(session : GameSession) : StableGameSession {
    {
      genre = session.genre;
      turns = session.turns.toArray();
    };
  };

  func toDTO(stableSession : StableGameSession) : StableGameSessionDTO {
    {
      genre = stableSession.genre;
      turns = stableSession.turns.map(func(t) { { playerAction = t.playerAction; storyText = t.storyText } });
    };
  };

  public shared ({ caller }) func createGame(genre : GameGenre) : async Nat {
    let userGames = initializeUser(caller);
    let id = switch (userGames.size() < 340282366920938463463374607431768211455) {
      case (true) { userGames.size() };
      case (false) { Runtime.trap("Maximum number of games reached") };
    };
    userGames.add(
      id,
      {
        genre;
        turns = List.empty<Turn>();
      },
    );
    id;
  };

  public shared ({ caller }) func submitTurn(gameId : Nat, input : TurnInputDTO) : async () {
    let userGames = initializeUser(caller);
    switch (userGames.get(gameId)) {
      case (null) { Runtime.trap("Game not found") };
      case (?session) {
        let newTurn : Turn = {
          playerAction = input.action;
          storyText = generateStoryContinuation(input.action, session.genre);
        };
        session.turns.add(newTurn);
      };
    };
  };

  public shared ({ caller }) func getGame(gameId : Nat) : async ?StableGameSessionDTO {
    players.get(caller).map(func(games) { games.get(gameId).map(func(g) { toDTO(toStableSession(g)) }) }).flatten();
  };

  public shared ({ caller }) func listGames() : async [(GameId, StableGameSessionDTO)] {
    switch (players.get(caller)) {
      case (null) { [] };
      case (?games) {
        games.toArray().map(
          func((id, session)) {
            (id, toDTO(toStableSession(session)));
          }
        );
      };
    };
  };

  public shared ({ caller }) func deleteGame(gameId : Nat) : async Bool {
    switch (players.get(caller)) {
      case (null) { false };
      case (?games) {
        if (games.containsKey(gameId)) {
          games.remove(gameId);
          true;
        } else { false };
      };
    };
  };

  func initializeUser(user : Principal) : GameState {
    switch (players.get(user)) {
      case (null) {
        let newMap = Map.empty<GameId, GameSession>();
        players.add(user, newMap);
        newMap;
      };
      case (?userGames) { userGames };
    };
  };

  func generateStoryContinuation(action : Text, genre : GameGenre) : Text {
    "Player performs action: " # action # ". The story continues...";
  };
};
