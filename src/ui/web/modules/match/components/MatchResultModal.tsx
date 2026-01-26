import { Smile, Frown } from "lucide-react";

import { useNavigate } from "@tanstack/react-router";

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

type MatchResultModalProps = {
  isOpen: boolean;
  isWinner: boolean;
};

export const MatchResultModal = ({
  isOpen,
  isWinner,
}: MatchResultModalProps) => {
  const navigate = useNavigate();
  const title = isWinner ? "You win!" : "You lost";
  const description = isWinner
    ? "Nice work. You took the match."
    : "Tough round. Better luck next time.";
  const Icon = isWinner ? Smile : Frown;

  const handleOk = () => {
    void navigate({ to: "/play" });
  };

  return (
    <AlertDialog
      open={isOpen}
      onOpenChange={(open) => (!open ? handleOk() : null)}
    >
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia>
            <Icon />
          </AlertDialogMedia>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex! justify-center">
          <AlertDialogAction onClick={handleOk}>Ok</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
