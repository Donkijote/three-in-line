import { Password } from "@convex-dev/auth/providers/Password";
import { convexAuth } from "@convex-dev/auth/server";

import type { Avatar } from "./schemas/user";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    Password({
      profile(params) {
        const flow = params.flow;
        const email = params.email as string;
        const avatar = params.avatar as Avatar;

        if (flow === "signUp") {
          if (!avatar) {
            throw new Error("Avatar is required");
          }

          return {
            email: email.toLowerCase(),
            avatar,
          };
        }

        return {
          email: email.toLowerCase(),
          avatar,
        };
      },
    }),
  ],
});
