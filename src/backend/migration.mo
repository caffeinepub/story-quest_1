import Map "mo:core/Map";
import List "mo:core/List";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";

module {
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

  type OldGameState = {
    storyHistory : List.List<Text>;
    currentState : Text;
    playerActions : List.List<Text>;
  };

  type OldActor = {
    gameSessions : Map.Map<Principal, OldGameState>;
  };

  type GameSession = {
    genre : GameGenre;
    turns : List.List<Turn>;
  };

  type NewActor = {
    players : Map.Map<Principal, Map.Map<Nat, GameSession>>;
  };

  public func run(old : OldActor) : NewActor {
    let newPlayers = old.gameSessions.map<Principal, OldGameState, Map.Map<Nat, GameSession>>(
      func(_principal, _oldGameState) {
        Map.empty<Nat, GameSession>();
      }
    );
    { players = newPlayers };
  };
};
