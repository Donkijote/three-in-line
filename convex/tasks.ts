import { v } from "convex/values";

import { mutation, query } from "./_generated/server";

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("tasks").collect();
  },
});

export const toggleTaskCompletion = mutation({
  args: { id: v.id("tasks") },
  handler: async (ctx, args) => {
    const { id } = args;
    const currentTask = await ctx.db.get("tasks", id);
    console.log(currentTask);

    // Overwrite `isCompleted`:
    await ctx.db.patch("tasks", id, { isCompleted: !currentTask?.isCompleted });
    console.log(await ctx.db.get("tasks", id));
  },
});
