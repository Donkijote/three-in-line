import { ShieldX } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/ui/web/components/ui/alert-dialog";

type LoginErrorAlertProps = {
  error: unknown;
  onClose: () => void;
};

export const LoginErrorAlert = ({ error, onClose }: LoginErrorAlertProps) => {
  const message = getAuthErrorMessage(error);
  const isOpen = Boolean(error);

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent className="bottom-6 top-auto w-[min(30rem,calc(100%-2rem))] translate-y-0 border border-destructive bg-card/95 shadow-[0_0_10px_rgba(255,64,64,0.55),0_0_28px_rgba(255,64,64,0.35)] data-[size=default]:max-w-(var(--container-sm))">
        <AlertDialogHeader className="grid grid-cols-[auto_1fr] grid-rows-[auto_auto] items-start gap-x-4 gap-y-1 text-left">
          <AlertDialogMedia className="bg-destructive/15 text-destructive mb-0 size-10 row-span-2 self-start ring ring-destructive/40">
            <ShieldX className="size-4" />
          </AlertDialogMedia>
          <AlertDialogTitle className="text-destructive w-full font-semibold uppercase tracking-[0.2em]">
            Authentication failed
          </AlertDialogTitle>
          <AlertDialogDescription className="text-muted-foreground col-start-2">
            {message}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <div className="flex w-full justify-center">
            <AlertDialogAction
              onClick={onClose}
              className="rounded-full bg-foreground text-background hover:bg-foreground/90 w-1/3"
            >
              Try again
            </AlertDialogAction>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export const getAuthErrorMessage = (error: unknown) => {
  if (error instanceof Error && error.message.trim()) {
    if (error.message.toLowerCase().includes("invalid")) {
      return "We couldn't get you into the arena. Please check your credentials and try again.";
    }
    return error.message;
  }
  return "We couldn't get you into the arena. Please check your credentials and try again.";
};
