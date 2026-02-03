import { defineTable } from "convex/server";
import { type Infer, v } from "convex/values";

import type { Doc, Id } from "../_generated/dataModel";

export const avatarType = v.union(
  v.literal("custom"),
  v.literal("preset"),
  v.literal("generated"),
);

export const avatar = v.object({
  type: avatarType,
  value: v.string(),
});

export const UserSchema = defineTable({
  name: v.optional(v.string()),
  image: v.optional(v.string()),
  email: v.optional(v.string()),
  emailVerificationTime: v.optional(v.number()),
  phone: v.optional(v.string()),
  phoneVerificationTime: v.optional(v.number()),
  isAnonymous: v.optional(v.boolean()),
  username: v.optional(v.string()),
  avatar: v.optional(avatar),
  avatars: v.optional(v.array(avatar)),
})
  .index("email", ["email"])
  .index("by_username", ["username"]);

export type AvatarType = Infer<typeof avatarType>;
export type Avatar = Infer<typeof avatar>;
export type UserDoc = Doc<"users">;
export type UserId = Id<"users">;
