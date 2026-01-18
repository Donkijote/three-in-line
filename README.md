# Tic-Tac-Toe (Web + Mobile + Desktop) — Hexagonal Architecture + Convex (Authoritative)

A small-but-serious Tic-Tac-Toe project built as a **cross-platform app** with a **shared domain** and an **authoritative backend**.

## Stack

### Clients
- **Web:** React + Vite + Tailwind + shadcn/ui
- **Mobile:** Expo (React Native)
- **Desktop:** Tauri (wrapping the Web app)

### Backend
- **Convex** (database + realtime subscriptions)
- **Convex Auth** (Google/Apple/etc.)
- **Convex File Storage** (avatars)

### Tooling
- **Bun** — package manager & scripts
- **TypeScript**
- **Biome** — linting & formatting

## Core Architecture Rules

### 1) Authoritative server
- Clients never decide “truth”.
- Clients send **intent** (e.g. `makeMove(roomId, cellIndex)`).
- Backend validates + applies rules, persists state, and broadcasts updates via Convex reactive queries.

### 2) Hexagonal (Ports & Adapters)
- **Domain** is pure: no React, no Convex, no I/O.
- **Application** defines use-cases (join room, start match, make move).
- **Ports** are interfaces required by the application/domain (repos, clock, id generator, etc.).
- **Adapters** implement ports for each platform (Convex adapters in backend; local storage adapters in clients).

### 3) Shared domain package
- The game rules (board, legal moves, win detection) live in a shared package used by backend and optionally clients
  (clients may use it only for rendering helpers; never for authoritative decisions).

---

## Monorepo Structure

Recommended layout:

```txt
/project-folder
├── convex                         # Convex backend (authoritative)
│   ├── schema.ts
│   ├── auth.config.ts
│   ├── users.ts
│   ├── rooms.ts
│   ├── games.ts
│   ├── files.ts
│   └── _generated
│       └── (Convex generated types)
│
├── src
│   ├── domain                     # PURE DOMAIN (shared everywhere)
│   │   ├── entities
│   │   │   ├── Game.ts
│   │   │   ├── Board.ts
│   │   │   └── Player.ts
│   │   ├── value-objects
│   │   │   ├── CellIndex.ts
│   │   │   ├── Mark.ts
│   │   │   └── GameStatus.ts
│   │   ├── services
│   │   │   ├── RulesService.ts
│   │   │   └── WinDetector.ts
│   │   ├── errors
│   │   │   ├── DomainError.ts
│   │   │   └── InvalidMoveError.ts
│   │   └── index.ts
│   │
│   ├── application                # USE-CASES + PORTS
│   │   ├── use-cases
│   │   │   ├── CreateRoom.ts
│   │   │   ├── JoinRoom.ts
│   │   │   ├── StartMatch.ts
│   │   │   ├── MakeMove.ts
│   │   │   └── Rematch.ts
│   │   ├── ports
│   │   │   ├── RoomRepository.ts
│   │   │   ├── GameRepository.ts
│   │   │   ├── UserRepository.ts
│   │   │   ├── AvatarStorage.ts
│   │   │   ├── Clock.ts
│   │   │   └── IdGenerator.ts
│   │   ├── dto
│   │   │   ├── RoomDTO.ts
│   │   │   ├── GameStateDTO.ts
│   │   │   └── UserProfileDTO.ts
│   │   └── index.ts
│   │
│   ├── infrastructure             # ADAPTERS (I/O, frameworks)
│   │   ├── convex                 # client-side Convex wrappers
│   │   │   ├── client.ts
│   │   │   ├── gameApi.ts
│   │   │   └── userApi.ts
│   │   ├── storage
│   │   │   ├── WebSettingsStorage.ts
│   │   │   └── MobileSettingsStorage.ts
│   │   └── index.ts
│   │
│   ├── ui
│   │   ├── shared                 # cross-platform UI helpers
│   │   │   ├── state
│   │   │   │   ├── useRoom.ts
│   │   │   │   └── useProfile.ts
│   │   │   └── components
│   │   │       └── BoardViewModel.ts
│   │   │
│   │   ├── web
│   │   │   ├── app
│   │   │   │   ├── providers
│   │   │   │   ├── routes
│   │   │   │   └── router.tsx
│   │   │   ├── components
│   │   │   │   ├── game
│   │   │   │   ├── layout
│   │   │   │   └── common
│   │   │   ├── shadcn             # generated shadcn/ui components
│   │   │   ├── styles
│   │   │   │   └── globals.css
│   │   │   └── main.tsx
│   │   │
│   │   ├── mobile
│   │   │   ├── app
│   │   │   │   ├── navigation
│   │   │   │   └── screens
│   │   │   ├── components
│   │   │   └── main.tsx
│   │   │
│   │   └── desktop
│   │       └── src-tauri           # Tauri Rust config
│   │
│   └── config
│       ├── env.ts
│       └── featureFlags.ts
│
├── public                          # web static assets
├── docs
│   ├── architecture.md
│   └── api-contracts.md
│
├── index.html                      # Vite entry
├── vite.config.ts
├── tailwind.config.ts
├── components.json                # shadcn/ui config
├── tsconfig.json
├── biome.json
├── bun.lockb
├── package.json
└── README.md

```

---

## Hexagonal “Where does what go?”

### ✅ Domain (pure, shared)
**Location:** `src/domain/**`

Put here:
- Entities (Game, Board, Player)
- Value objects (CellIndex, Mark, GameStatus)
- Pure domain services (rules, win detection)
- Domain errors

Rules:
- No Convex imports
- No React imports
- No storage / I/O
- No `Date.now()` directly (use a port if time is needed)

---

### ✅ Application (use-cases + ports)
**Location:** `src/application/**`

Put here:
- Use-cases expressing intent:
    - `CreateRoom`
    - `JoinRoom`
    - `LeaveRoom`
    - `StartMatch`
    - `MakeMove`
    - `Resign`
    - `Rematch`
- Application-level orchestration (no persistence details)
- DTOs for transport
- Ports (interfaces) required by the use-cases

Rules:
- No Convex imports
- No React imports
- No framework-specific code
- Depends only on `src/domain`

---

### ✅ Authoritative Backend (application service + adapters)
**Location:** `convex/**`

Put here:
- Convex mutations & queries implementing the real runtime behavior:
    - `createRoom`
    - `joinRoom`
    - `leaveRoom`
    - `startMatch`
    - `makeMove`
    - `resign`
    - `requestRematch`
- Validation logic:
    - authentication
    - room membership
    - turn order
- Persistence:
    - game state
    - match history
    - user profiles & settings
- Broadcasting state changes via Convex subscriptions

This is the **authoritative layer** of the system.

Allowed:
- Import from `src/domain`
- Import from `src/application`
- Use Convex DB, Auth, and File APIs

---

### ✅ Ports (interfaces)
**Location:** `src/application/ports/**`

Examples:
- `GameRepository`
- `RoomRepository`
- `UserRepository`
- `AvatarStorage`
- `IdGenerator`
- `Clock`

Notes:
- Ports are pure TypeScript interfaces
- They describe *what the application needs*, not *how it is implemented*
- In practice, many ports are fulfilled directly by Convex inside `convex/**`

---

### ✅ Adapters (platform implementations)
**Location:** `src/infrastructure/**`

Put here:
- Convex client wrappers (web & mobile):
    - queries
    - mutations
    - subscriptions
- Local / secure storage implementations:
    - web `localStorage`
    - mobile secure storage
- Platform-specific I/O concerns

Examples:
- `src/infrastructure/convex/client.ts`
- `src/infrastructure/convex/gameApi.ts`
- `src/infrastructure/storage/WebSettingsStorage.ts`
- `src/infrastructure/storage/MobileSettingsStorage.ts`

Adapters are the **only place** where you talk to:
- Convex client APIs
- Browser / mobile storage
- OS or platform APIs

---

### ✅ UI (presentation)
**Location:** `src/ui/**`

Structure:
- `src/ui/web/**`
- `src/ui/mobile/**`
- `src/ui/desktop/**`
- `src/ui/shared/**` (optional cross-platform helpers)

Put here:
- Routing / navigation
- UI components
- Layouts and screens
- View-model helpers (NOT business rules)

Rules:
- No business rules
- No game validation logic
- UI renders state and emits intents via gateways

---

## Example: Core Domain (shared)

**`src/domain/entities/Game.ts`**
- Game state structure
- Apply move (pure, returns a new game instance)
- No persistence
- No side effects

**`src/domain/services/RulesService.ts`**
- `isMoveLegal(game, playerId, cellIndex)`
- `applyMove(game, playerId, cellIndex)`
- `computeStatus(game)`

---

## Example: Backend Use-Case (authoritative)

**`convex/games.ts`**
- `makeMove` mutation
    - load room + game
    - validate auth + membership
    - call domain rules to validate/apply
    - persist new state
    - return updated state (clients subscribed will update automatically)

**`convex/rooms.ts`**
- Matchmaking and room lifecycle
- Ready-state toggles
- Rematch flow

---

## Data Model (suggested)

### Tables (Convex)
- `users`
    - `userId`, `username`, `displayName`, `avatarFileId`, `createdAt`
- `rooms`
    - `status` (`waiting` | `playing` | `finished`), `createdBy`, `createdAt`
- `roomMembers`
    - `roomId`, `userId`, `role` (`player1` | `player2` | `spectator`), `joinedAt`
- `games`
    - `roomId`, `state` (serialized), `currentTurnUserId`, `status`, `updatedAt`
- `matchHistory`
    - `roomId`, `players`, `result`, `movesCount`, `finishedAt`
- `userSettings`
    - `userId`, preferences (theme, sound, etc.)

### Files
- Avatars stored in Convex File Storage
- User profile stores `avatarFileId`

---

## Client “Gateway” Pattern

In clients, treat the backend as a port.

Example (Web):

**`src/infrastructure/convex/gameApi.ts`**
- `createRoom()`
- `joinRoom(roomCode)`
- `makeMove(roomId, cellIndex)`
- `subscribeRoom(roomId)` (query subscription wrapper)

This keeps UI clean, testable, and transport-agnostic.

---

## Conventions

- **No business rules in UI.** UI can *display* derived info but backend decides.
- **Mutations are commands, queries are reads.**
- **DTOs live in `packages/shared-types`.**
- **Domain types are imported by backend; clients mostly consume DTOs.**
- Keep “generated” Convex code in `_generated/` only.

---

## Roadmap (suggested)

1. Offline local game (shared domain + web UI)
2. Convex rooms + matchmaking
3. Authoritative moves + history
4. Convex Auth (Google first)
5. Username uniqueness checks
6. Avatar upload
7. Mobile + desktop packaging

---

## Scripts (example)

At root:
- `bun run dev`
- `bun run build`
- `bun run lint`
- `bun run preview`

---

## Notes

This project intentionally favors:
- **clean boundaries**
- **shared domain**
- **authoritative multiplayer**
- **realtime UX without manual socket plumbing** (Convex subscriptions)

Happy hacking 🤘
