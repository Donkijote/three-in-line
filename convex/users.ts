import { v } from "convex/values";

import { query } from "./_generated/server";

export const checkEmailExists = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const trimmed = args.email.trim();
    if (!trimmed) {
      return false;
    }

    const existingUser = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", trimmed))
      .first();

    return Boolean(existingUser);
  },
});

export const checkUsernameExists = query({
  args: { username: v.string() },
  handler: async (ctx, args) => {
    const trimmed = args.username.trim();
    if (!trimmed) {
      return false;
    }

    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_username", (q) => q.eq("username", trimmed))
      .first();

    return Boolean(existingUser);
  },
});
