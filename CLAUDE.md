# CLAUDE.md - AI Assistant Guide for Selfish: Space Edition Web

## Project Overview

**Project Name:** selfish-space-web
**Status:** 📋 Planning Phase - No code implementation yet
**Language:** Project documentation is in Chinese; code should use English
**Purpose:** Non-commercial web implementation of "Selfish: Space Edition" board game for LAN/personal use

### Important Legal Context
- This is an **unofficial fan-made implementation**
- Original game copyright belongs to **Big Potato / Ridley's Games**
- Do NOT include official card scans or copyrighted artwork
- For personal/LAN use only - not for public deployment

---

## Current Repository State

### Existing Files
- `readme.md` - Comprehensive development checklist in Chinese (310 lines)
  - Contains complete project specification
  - Detailed feature requirements
  - Game rules and mechanics
  - UI/UX design guidelines
  - Step-by-step implementation roadmap

### What's Missing (To Be Implemented)
- All source code (client and server)
- Package configuration files
- Build tooling setup
- Game logic implementation
- UI components

---

## Planned Architecture

### Tech Stack

#### Frontend (`client/`)
- **Framework:** React + TypeScript
- **Build Tool:** Vite (or Next.js if developer is familiar)
- **Styling:** Tailwind CSS
- **Real-time Communication:** socket.io-client

#### Backend (`server/`)
- **Runtime:** Node.js + TypeScript
- **WebSocket:** socket.io
- **Purpose:** Game state management, room handling, rule enforcement

#### Deployment
- Local/LAN deployment
- Both frontend and backend run on host machine
- Players access via LAN IP address

### Planned Directory Structure

```
selfish-space-web/
├── README.md                    # Project overview (exists)
├── DEV_CHECKLIST.md            # Development checklist (current readme.md)
├── CLAUDE.md                   # This file - AI assistant guide
├── server/                     # Backend (to be created)
│   ├── src/
│   │   ├── index.ts           # Entry point
│   │   ├── game/
│   │   │   ├── types.ts       # Game-related types
│   │   │   ├── cards-config.ts # Card definitions
│   │   │   ├── engine.ts      # Turn logic, effect resolution
│   │   │   └── state.ts       # Room & game state management
│   │   └── sockets.ts         # socket.io event bindings
│   ├── package.json
│   └── tsconfig.json
└── client/                     # Frontend (to be created)
    ├── src/
    │   ├── main.tsx
    │   ├── App.tsx
    │   ├── pages/
    │   │   ├── HomePage.tsx   # Create/join room
    │   │   └── RoomPage.tsx   # Game board
    │   ├── components/
    │   │   ├── GameBoard.tsx
    │   │   ├── PlayerPanel.tsx
    │   │   ├── HandArea.tsx
    │   │   └── CardView.tsx
    │   ├── game/
    │   │   ├── types.ts       # Shared types with server
    │   │   └── api.ts         # Socket interaction wrapper
    │   └── styles/
    ├── package.json
    ├── tsconfig.json
    └── vite.config.ts
```

---

## Game Mechanics Summary

### Core Concepts
- **Players:** Multiple astronauts racing to reach the rescue ship
- **Space Track:** Linear path from start (0) to ship (N)
- **Oxygen:** Resource players need to survive; runs out = death
- **Card Types:**
  - **Space Cards:** Events that trigger when landing on a space
  - **Action Cards:** Cards players can play from hand
  - **Oxygen Cards:** Resources for survival

### Win Conditions
- First player to reach the ship wins
- If all players die, everyone loses

### Turn Structure
1. Current player moves forward one space
2. Draw and resolve a Space Card
3. Oxygen is consumed based on rules
4. Players can play Action Cards
5. Check for death/victory conditions
6. Next player's turn

---

## Development Workflow

### Phase 1: Project Initialization (Not Started)
1. Create `client/` directory with Vite + React + TypeScript
2. Create `server/` directory with Node.js + TypeScript
3. Set up package.json for both
4. Configure TypeScript, linting, formatting
5. Test basic socket.io connection

### Phase 2: MVP - Minimum Viable Product
Priority features for a playable game:
- Room creation and joining
- Player lobby with nicknames
- Game initialization (deck creation, oxygen distribution)
- Basic turn system (move → draw space card → apply effects)
- Victory/defeat detection
- Simple text-based UI

### Phase 3: Enhanced Gameplay
- Hand management UI
- Action card implementation
- Targeted actions (attacking other players)
- Game event log
- Player death and spectator mode

### Phase 4: Polish
- Full card library implementation
- Animations and visual feedback
- Custom rule options
- Sound effects (optional)

---

## Code Conventions

### TypeScript Types (Core Schema)

```typescript
// Player status
export type PlayerStatus = "ALIVE" | "DEAD";

// Game phases
export type GamePhase = "LOBBY" | "PLAYING" | "FINISHED";

// Player entity
export interface Player {
  id: string;
  name: string;
  position: number;        // Current space on track
  oxygen: number;          // Remaining oxygen units
  hand: string[];          // Card IDs in hand
  status: PlayerStatus;
}

// Main game state
export interface GameState {
  roomId: string;
  players: Player[];
  currentPlayerIndex: number;
  phase: GamePhase;
  winnerId?: string;
  trackLength: number;
  spaceDeck: string[];
  spaceDiscard: string[];
  gameDeck: string[];
  gameDiscard: string[];
  revealedSpaceCards: Record<number, string>; // position -> card ID
}
```

### Socket.io Event Protocol

#### Client → Server
- `room:create` - Create new room
  - Payload: `{ playerName: string }`
- `room:join` - Join existing room
  - Payload: `{ roomId: string, playerName: string }`
- `game:start` - Start game (host only)
- `game:action:move` - Player moves forward
- `game:action:playCard` - Play action card
  - Payload: `{ cardId: string, targetPlayerId?: string }`

#### Server → Client (Broadcast)
- `room:state` - Room lobby state update
- `game:state` - Full game state (filtered per player)
- `game:log` - Event notification text
  - Example: "Alice moved forward and drew COSMIC_RADIATION"
- `game:ended` - Game over
  - Payload: `{ winnerId?: string, reason: string }`

### Naming Conventions
- **Variables/Functions:** camelCase
- **Types/Interfaces:** PascalCase
- **Constants:** UPPER_SNAKE_CASE
- **Files:** kebab-case.ts or PascalCase.tsx (components)
- **Socket Events:** namespace:action format

### Code Style
- Use TypeScript strict mode
- Prefer functional components (React)
- Use async/await over promises
- Validate all player actions server-side
- Never trust client input

---

## Security & Anti-Cheat Considerations

### Server-Side Validation
- **Always** validate:
  - Is it the current player's turn?
  - Does the player have the card they're playing?
  - Is the target valid?
  - Is the action allowed in current game state?

### State Visibility
- **Private Information:** Each player should only see:
  - Their own hand
  - Other players' hand counts (not contents)
  - Public game state (positions, oxygen, revealed cards)
- Implement player-specific state filtering before broadcasting

### Room Management
- Prevent room ID guessing attacks
- Implement max players limit
- Handle disconnections gracefully

---

## UI/UX Guidelines

### Layout Priorities
1. **Space Track:** Central visual element showing all player positions
2. **Player Panels:** Show each player's name, oxygen, status, hand count
3. **Hand Area:** Current player's cards (bottom of screen)
4. **Event Feed:** Recent game events and notifications
5. **Action Buttons:** Move, End Turn, etc.

### Visual Hierarchy
- Current player highlighted clearly
- Dead players grayed out
- Active turn indicator prominent
- Card effects readable and understandable

### Placeholder Art Strategy
- Use simple geometric shapes + text
- Oxygen: Circle icon + number
- Cards: Colored rectangles + card name
- NO official artwork or scans
- Consider AI-generated or hand-drawn art later

---

## Testing Strategy

### Unit Tests
- Card effect logic
- Game state transitions
- Victory/defeat detection
- Oxygen consumption calculations

### Integration Tests
- Socket.io event flows
- Multi-player game scenarios
- Edge cases (simultaneous deaths, deck exhaustion)

### Manual Testing Checklist
- Can create and join rooms
- Game starts correctly
- Turns progress properly
- Cards have correct effects
- Game ends with correct winner
- Disconnection handling

---

## Git Workflow

### Branch Strategy
- `main` - Stable, working builds
- `develop` - Integration branch
- Feature branches: `feature/room-system`, `feature/card-effects`, etc.

### Commit Messages
Use conventional commits:
- `feat: add room creation socket event`
- `fix: correct oxygen consumption logic`
- `refactor: extract card effects to separate module`
- `docs: update game rules in README`

### Development Branch
Currently working on: `claude/claude-md-micn3b11ee2dgk94-017rzQtnums6cQpcgNd1mfEq`

---

## Common Tasks for AI Assistants

### When Starting Development
1. Read `readme.md` thoroughly to understand all requirements
2. Set up project structure according to planned architecture
3. Initialize both client and server with proper tooling
4. Create shared types file for client-server consistency

### When Implementing Features
1. Reference the checklist in `readme.md` (sections 2.1, 2.2, 2.3)
2. Start with MVP features (section 2.1) before enhancements
3. Implement server logic first, then client UI
4. Always validate game rules server-side

### When Writing Game Logic
1. Refer to section 3 (Core Game Rules) in readme.md
2. Implement TypeScript types from section 3.2
3. Follow socket protocol from section 4
4. Ensure turn-based logic is sequential and validated

### When Creating UI
1. Follow UI design from section 5 in readme.md
2. Start with static layouts, then add socket integration
3. Use placeholders for artwork (section 6)
4. Prioritize functionality over aesthetics initially

### When Adding Card Effects
1. Define card in `cards-config.ts`
2. Implement effect logic in `engine.ts`
3. Add validation in turn handler
4. Create UI component for card display
5. Test with multiple players

---

## Documentation Requirements

### Code Comments
- Document complex game logic
- Explain card effect algorithms
- Note any deviations from original rules
- Mark TODOs for incomplete features

### README Updates
- Keep installation instructions current
- Document environment setup
- List implemented vs planned features
- Include quick start guide for LAN setup

---

## Known Limitations & Future Considerations

### Current Scope Limitations
- No authentication system (not needed for LAN)
- No persistent storage (games exist in memory only)
- No replay/save game functionality
- Basic visuals only

### Potential Future Enhancements
- Game replay system
- Statistics tracking
- Custom rule variants
- Better mobile support
- Internationalization (English UI option)

---

## Quick Reference for AI Assistants

### First Time Setup Commands
```bash
# Initialize client
cd client
npm create vite@latest . -- --template react-ts
npm install socket.io-client tailwindcss

# Initialize server
cd server
npm init -y
npm install express socket.io typescript @types/node
npx tsc --init
```

### Development Commands
```bash
# Run server
cd server && npm run dev

# Run client
cd client && npm run dev
```

### Key Files to Reference
- `readme.md` - Complete project specification and checklist
- `CLAUDE.md` - This file for AI assistant guidance
- `server/src/game/types.ts` - Core type definitions
- `server/src/game/engine.ts` - Game logic implementation
- `client/src/game/types.ts` - Client-side types (should match server)

---

## Questions to Ask Before Major Changes

1. Does this feature align with the MVP checklist in readme.md?
2. Is this implementing original game rules correctly?
3. Does this add unnecessary complexity?
4. Is the server validating all player actions?
5. Will this work in a LAN environment?
6. Are we using any copyrighted assets?

---

## Resources & References

### Original Game
- Selfish: Space Edition by Ridley's Games
- (Do not use official assets - reference rules only)

### Technical Documentation
- [socket.io Docs](https://socket.io/docs/)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [Vite Guide](https://vitejs.dev/guide/)

---

## Changelog

### 2025-11-24
- Created CLAUDE.md
- Repository contains only planning documents
- No code implementation started yet
- Established architecture and conventions for future development

---

**Last Updated:** 2025-11-24
**Project Phase:** Planning
**Next Steps:** Initialize project structure and set up basic socket.io communication
