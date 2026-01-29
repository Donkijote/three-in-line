import { defineTable } from "convex/server";
import { type Infer, v } from "convex/values";

import type { Doc, Id } from "../_generated/dataModel";

export const player = v.union(v.literal("P1"), v.literal("P2"));

export type Player = Infer<typeof player>;

export const matchFormat = v.union(
  v.literal("single"),
  v.literal("bo3"),
  v.literal("bo5"),
);

export type MatchFormat = Infer<typeof matchFormat>;

export const status = v.union(
  v.literal("waiting"),
  v.literal("playing"),
  v.literal("ended"),
  v.literal("paused"),
  v.literal("canceled"),
);

export type GameStatus = Infer<typeof status>;

export const endedReason = v.union(
  v.literal("win"),
  v.literal("draw"),
  v.literal("abandoned"),
  v.literal("disconnect"),
  v.null(),
);

export type GameEndedReason = Infer<typeof endedReason>;

export const roundSummary = v.object({
  roundIndex: v.number(),
  endedReason,
  winner: v.union(player, v.null()),
  movesCount: v.number(),
  endedTime: v.number(),
});

export type RoundSummary = Infer<typeof roundSummary>;

export type GameDoc = Doc<"games">;
export type GameId = Id<"games">;

export const GameSchema = defineTable({
  status,
  board: v.array(v.union(player, v.null())),
  gridSize: v.number(),
  winLength: v.number(),
  match: v.object({
    format: matchFormat,
    targetWins: v.number(),
    roundIndex: v.number(),
    score: v.object({ P1: v.number(), P2: v.number() }),
    matchWinner: v.union(player, v.null()),
    rounds: v.array(roundSummary),
  }),
  p1UserId: v.id("users"),
  p2UserId: v.union(v.id("users"), v.null()),
  currentTurn: player,
  winner: v.union(player, v.null()),
  winningLine: v.union(v.array(v.number()), v.null()),
  endedReason,
  endedTime: v.union(v.number(), v.null()),
  pausedTime: v.union(v.number(), v.null()),
  abandonedBy: v.union(player, v.null()),
  presence: v.object({
    P1: v.object({ lastSeenTime: v.union(v.number(), v.null()) }),
    P2: v.object({ lastSeenTime: v.union(v.number(), v.null()) }),
  }),
  movesCount: v.number(),
  version: v.number(),
  lastMove: v.union(
    v.object({
      index: v.number(),
      by: player,
      at: v.number(),
    }),
    v.null(),
  ),
  updatedTime: v.number(),
})
  .index("by_updatedTime", ["updatedTime"])
  .index("by_status_p2_createdTime", ["status", "p2UserId"]);
