# Story Quest

## Current State
Fresh project — no existing code.

## Requested Changes (Diff)

### Add
- Full backend with Motoko actor for story management
- Player session/game state persistence per user
- Story history storage (list of turns with player action and story response)
- Game creation: start a new game with a chosen genre/setting
- Turn submission: player submits an action, backend generates a story response using rule-based narrative engine
- Multiple game genre support: Fantasy, Sci-Fi, Horror, Mystery
- Context-aware story generation using stored history to maintain narrative continuity
- Save/load game sessions
- Frontend UI matching AI Dungeon style: dark theme, story text panel, input field, action history

### Modify
- N/A (new project)

### Remove
- N/A (new project)

## Implementation Plan
1. Motoko backend: data types for Game, Turn, Genre; stable storage for games by player principal
2. Backend functions: createGame, submitAction (returns generated story text), getGame, listGames, deleteGame
3. Story generation: rule-based engine using genre templates, context from recent turns, varied narrative patterns
4. Frontend: game lobby (genre picker), active game view (story panel + input), game list
