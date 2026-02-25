import type { UserAvatar } from "@/domain/entities/Avatar";

export type LoginFlow = "signIn" | "signUp" | "";

export type LoginFormValues = {
  email: string;
  password: string;
  flow: LoginFlow;
  avatar?: UserAvatar;
};

export type LoginSignInPayload = {
  email: string;
  password: string;
  flow: "signIn";
};

export type LoginSignUpPayload = {
  email: string;
  password: string;
  flow: "signUp";
  avatar?: UserAvatar;
};

export type LoginSubmitPayload = LoginSignInPayload | LoginSignUpPayload;

export type CheckEmailExistsFn = (email: string) => Promise<boolean>;

export type PasswordAuthFn = (payload: LoginSubmitPayload) => Promise<void>;
