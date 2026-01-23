import { defineTable } from "convex/server";
import { v } from "convex/values";

export const UserSchema = defineTable({
  name: v.optional(v.string()),
  image: v.optional(v.string()),
  email: v.optional(v.string()),
  emailVerificationTime: v.optional(v.number()),
  phone: v.optional(v.string()),
  phoneVerificationTime: v.optional(v.number()),
  isAnonymous: v.optional(v.boolean()),
  username: v.optional(v.string()),
  avatar: v.optional(
    v.object({
      type: v.union(
        v.literal("custom"),
        v.literal("preset"),
        v.literal("generated"),
      ),
      value: v.string(),
    }),
  ),
})
  .index("email", ["email"])
  .index("by_username", ["username"]);
