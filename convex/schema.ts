import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

import { authTables } from "@convex-dev/auth/server";

import { GameSchema } from "./schemas/game";
import { UserSchema } from "./schemas/user";

export default defineSchema({
  ...authTables,
  users: UserSchema,
  games: GameSchema,
  tasks: defineTable({
    text: v.string(),
    isCompleted: v.boolean(),
  }),
});
