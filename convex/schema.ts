import { defineSchema } from "convex/server";

import { authTables } from "@convex-dev/auth/server";

import { GameSchema } from "./schemas/game";
import { UserSchema } from "./schemas/user";

export default defineSchema({
  ...authTables,
  users: UserSchema,
  games: GameSchema,
});
