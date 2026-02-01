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
    <AlertDialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
    >
      <AlertDialogContent
        size="sm"
        className="bottom-6 top-auto w-[min(40rem,calc(100%-2rem))] translate-y-0 border border-destructive/60 bg-card/95 shadow-xl max-w-none data-[size=sm]:max-w-none"
      >
        <AlertDialogHeader className="grid grid-cols-[auto_1fr] grid-rows-[auto_auto] items-start gap-x-4 gap-y-1 text-left">
          <AlertDialogMedia className="bg-destructive/15 text-destructive mb-0 size-10 row-span-2 self-start">
            <ShieldX className="size-4" />
          </AlertDialogMedia>
          <AlertDialogTitle className="text-destructive text-sm font-semibold uppercase tracking-[0.2em]">
            Authentication failed
          </AlertDialogTitle>
          <AlertDialogDescription className="text-muted-foreground text-xs col-start-2">
            {message}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex! w-full justify-end">
          <AlertDialogAction
            onClick={onClose}
            className="rounded-full bg-foreground text-background hover:bg-foreground/90"
          >
            Try again
          </AlertDialogAction>
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
