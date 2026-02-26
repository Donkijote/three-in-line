import { v } from "convex/values";

import { getAuthUserId } from "@convex-dev/auth/server";

import { mutation, query } from "./_generated/server";
import { avatar } from "./schemas/user";

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

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }

    return await ctx.db.get(userId);
  },
});

export const getUserById = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.userId);
  },
});

export const updateUsername = mutation({
  args: { username: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const trimmed = args.username.trim();
    if (!trimmed) {
      throw new Error("Username is required");
    }

    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_username", (q) => q.eq("username", trimmed))
      .first();

    if (existingUser && existingUser._id !== userId) {
      throw new Error("Username already exists");
    }

    await ctx.db.patch(userId, { username: trimmed });
    return await ctx.db.get(userId);
  },
});

export const updateAvatar = mutation({
  args: {
    avatar,
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const user = await ctx.db.get(userId);
    const previousAvatars = user?.avatars ?? [];
    const currentAvatar = user?.avatar;
    const historyCandidates = currentAvatar
      ? [currentAvatar, ...previousAvatars]
      : previousAvatars;
    const dedupedHistory = [];
    const seen = new Set<string>();

    for (const item of historyCandidates) {
      if (item.type === args.avatar.type && item.value === args.avatar.value) {
        continue;
      }

      const avatarKey = `${item.type}:${item.value}`;
      if (seen.has(avatarKey)) {
        continue;
      }

      seen.add(avatarKey);
      dedupedHistory.push(item);
    }

    const nextAvatars = [args.avatar, ...dedupedHistory].slice(0, 10);

    await ctx.db.patch(userId, { avatar: args.avatar, avatars: nextAvatars });
    return await ctx.db.get(userId);
  },
});
