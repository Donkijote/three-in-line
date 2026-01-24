import { LogOut } from "lucide-react";

import { useAuthActions } from "@convex-dev/auth/react";

import { Button } from "@/ui/web/components/ui/button";

export const LogoutButton = () => {
  const { signOut } = useAuthActions();

  return (
    <div className={"flex justify-center items-center w-full"}>
      <Button
        type="button"
        variant={"link"}
        className={"text-muted-foreground/60 hover:no-underline"}
        onClick={() => void signOut()}
      >
        <LogOut className="size-4" />
        Log Out
      </Button>
    </div>
  );
};
