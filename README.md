# Tic-Tac-Toe (Web + Mobile + Desktop) — Hexagonal Architecture + Convex (Authoritative)

A small-but-serious Tic-Tac-Toe project built as a **cross-platform app** with a **shared domain** and an **authoritative backend**.

## Stack

### Clients
- **Web:** React + Vite + TanStack Router + Tailwind + shadcn/ui
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

### Coding Conventions
- Prefer arrow functions for components, hooks, utils, and most other functions.
- For route files, function declarations are allowed; if using arrow functions, define them before the `export const Route` to avoid runtime issues.

### Routing
- **TanStack Router** with file-based routes (`src/ui/web/routes`) in SPA mode.

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

## Repo Structure

Recommended layout:

```txt
/project-folder
├── .editorconfig
├── .env.example
├── biome.json
├── bun.lockb
├── package.json
├── tsconfig.json
├── tsconfig.paths.json
├── web
│   ├── package.json
│   ├── vite.config.ts
│   ├── vitest.config.ts
│   ├── tsconfig.json
│   ├── tsconfig.app.json
│   ├── tsconfig.node.json
│   ├── components.json
│   ├── index.html
│   └── wrangler.toml
├── public
│   └── (web static assets)
├── convex
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
│   ├── domain
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
│   ├── application
│   │   ├── use-cases
│   │   │   ├── CreateRoom.ts
│   │   │   ├── JoinRoom.ts
│   │   │   ├── LeaveRoom.ts
│   │   │   ├── StartMatch.ts
│   │   │   ├── MakeMove.ts
│   │   │   ├── Resign.ts
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
│   │   │   ├── application
│   │   │   │   ├── providers
│   │   │   │   │   ├── ConvexProvider.tsx
│   │   │   │   │   └── ThemeProvider.tsx
│   │   │   ├── modules
│   │   │   │   ├── home
│   │   │   │   │   ├── screens
│   │   │   │   │   │   └── HomeScreen.tsx
│   │   │   │   │   └── components
│   │   │   │   │       └── HeroCard.tsx
│   │   │   │   ├── lobby
│   │   │   │   │   ├── screens
│   │   │   │   │   │   └── LobbyScreen.tsx
│   │   │   │   │   ├── components
│   │   │   │   │   │   ├── CreateRoomCard.tsx
│   │   │   │   │   │   └── JoinRoomForm.tsx
│   │   │   │   │   └── hooks
│   │   │   │   │       └── useLobby.ts
│   │   │   │   ├── room
│   │   │   │   │   ├── screens
│   │   │   │   │   │   └── RoomScreen.tsx
│   │   │   │   │   ├── components
│   │   │   │   │   │   ├── Board.tsx
│   │   │   │   │   │   ├── Cell.tsx
│   │   │   │   │   │   ├── PlayersBar.tsx
│   │   │   │   │   │   └── RoomActions.tsx
│   │   │   │   │   ├── hooks
│   │   │   │   │   │   └── useRoom.ts
│   │   │   │   │   └── view-models
│   │   │   │   │       └── boardViewModel.ts
│   │   │   │   ├── profile
│   │   │   │   │   ├── screens
│   │   │   │   │   │   └── ProfileScreen.tsx
│   │   │   │   │   └── components
│   │   │   │   │       ├── AvatarUploader.tsx
│   │   │   │   │       └── UsernameForm.tsx
│   │   │   │   └── settings
│   │   │   │       └── screens
│   │   │   │           └── SettingsScreen.tsx
│   │   │   ├── components
│   │   │   │   ├── layout
│   │   │   │   │   ├── AppShell.tsx
│   │   │   │   │   └── Header.tsx
│   │   │   │   ├── common
│   │   │   │   │    ├── Loading.tsx
│   │   │   │   │    └── ErrorState.tsx
│   │   │   │   └── ui
│   │   │   │       └── (generated shadcn/ui components)
│   │   │   ├── modules
│   │   │   │   └── home
│   │   │   │       ├── components
│   │   │   │       │   ├── ComponentExample.tsx
│   │   │   │       │   └── Example.tsx
│   │   │   │       └── screens
│   │   │   │           └── HomeScreen.tsx
│   │   │   ├── routes
│   │   │   │   ├── __root.tsx
│   │   │   │   └── index.tsx
│   │   │   ├── styles
│   │   │   │   └── globals.css
│   │   │   ├── lib
│   │   │   │   └── utils.ts
│   │   │   ├── main.tsx
│   │   │   ├── router.tsx
│   │   │   └── routeTree.gen.ts
│   │   ├── mobile
│   │   │   ├── app
│   │   │   │   ├── navigation
│   │   │   │   │   └── RootNavigator.tsx
│   │   │   │   └── screens
│   │   │   │       ├── HomeScreen.tsx
│   │   │   │       ├── LobbyScreen.tsx
│   │   │   │       └── RoomScreen.tsx
│   │   │   ├── components
│   │   │   │   └── (mobile components)
│   │   │   └── main.tsx
│   │   │
│   │   └── desktop
│   │       └── src-tauri           # Tauri Rust config
│   │
│   └── config
│       ├── env.ts
│       └── featureFlags.ts
└── docs
    ├── architecture.md
    └── api-contracts.md
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

UI rule:
- UI must not import Convex types or `convex/*` directly; use infrastructure adapters and domain types.

---

### Convex React (Web) example (mock)
```tsx
import type { ReactNode } from "react";

import { ConvexProvider } from "@/ui/web/application/providers/ConvexProvider";
import { useGameById } from "@/infrastructure/convex/GameApi";

function AppProviders({ children }: { children: ReactNode }) {
  return <ConvexProvider>{children}</ConvexProvider>;
}

function RoomsList() {
  const game = useGameById("game-id");
  return <div>Game loaded: {Boolean(game)}</div>;
}
```

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

## Routing Conventions (Web)
- File-based routes live in `src/ui/web/routes`.
- `__root.tsx` defines the root layout and hosts shared providers or UI chrome.
- Use `index.tsx` for `/` and nested folders for nested paths.
- Route components are defined via `createFileRoute` and kept small; move shared UI to `src/ui/web/components`.

---

## Import Conventions (Web)
- Prefer absolute imports with `@/` whenever possible.
- Shared web utilities live in `src/ui/web/lib/`.
- Relative imports are allowed inside `src/ui/web/components/**` for sibling or nested child components (use `./` or `../` only).

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
- Matchmaking uses Convex `_creationTime` for oldest-waiting ordering; no custom `createdTime`.
- Repositories live in infrastructure, use cases in application, UI hooks in `src/ui/web/hooks`.
- Reactive Convex queries stay in UI hooks; repositories focus on mutations.

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
- `bun run test`
- `bun run preview`

---

## Testing

Vitest runs unit tests in a JSDOM environment. Place tests in `src/` with
`*.test.ts(x)` or `*.spec.ts(x)` names and run:

```bash
bun run test
```

---

## Notes

This project intentionally favors:
- **clean boundaries**
- **shared domain**
- **authoritative multiplayer**
- **realtime UX without manual socket plumbing** (Convex subscriptions)

Happy hacking 🤘
