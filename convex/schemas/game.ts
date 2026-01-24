import { defineTable } from "convex/server";
import { type Infer, v } from "convex/values";

const player = v.union(v.literal("P1"), v.literal("P2"));

const status = v.union(
  v.literal("waiting"),
  v.literal("playing"),
  v.literal("ended"),
  v.literal("paused"),
  v.literal("canceled"),
);

export type GameStatus = Infer<typeof status>;

export const GameSchema = defineTable({
  status,
  board: v.array(v.union(player, v.null())),
  p1UserId: v.id("users"),
  p2UserId: v.union(v.id("users"), v.null()),
  currentTurn: player,
  winner: v.union(player, v.null()),
  winningLine: v.union(v.array(v.number()), v.null()),
  endedReason: v.union(
    v.literal("win"),
    v.literal("draw"),
    v.literal("abandoned"),
    v.literal("disconnect"),
    v.null(),
  ),
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
}).index("by_updatedTime", ["updatedTime"]);
