import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

import { authTables } from "@convex-dev/auth/server";

import { UserSchema } from "./schemas/user";

export default defineSchema({
  ...authTables,
  users: UserSchema,
  tasks: defineTable({
    text: v.string(),
    isCompleted: v.boolean(),
  }),
});
