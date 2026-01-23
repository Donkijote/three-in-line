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
