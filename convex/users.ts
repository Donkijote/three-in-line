import { v } from "convex/values";

import { query } from "./_generated/server";

export const checkCodenameExists = query({
  args: { codeName: v.string() },
  handler: async (ctx, args) => {
    const trimmed = args.codeName.trim();
    if (!trimmed) {
      return false;
    }

    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_codeName", (q) => q.eq("codeName", trimmed))
      .first();

    return Boolean(existingUser);
  },
});
