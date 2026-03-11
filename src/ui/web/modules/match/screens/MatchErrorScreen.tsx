import { useEffect, useRef } from "react";

import { Flag } from "lucide-react";

import { useNavigate } from "@tanstack/react-router";

import { useUserPreferences } from "@/ui/web/application/providers/UserPreferencesProvider";
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
import { playDisconnectedSound } from "@/ui/web/lib/sound";

type MatchErrorScreenProps = {
  error: unknown;
};

export const MatchErrorScreen = ({ error }: MatchErrorScreenProps) => {
  const navigate = useNavigate();
  const { preferences } = useUserPreferences();
  const hasPlayedDisconnectedSoundRef = useRef(false);
  const message = getMatchErrorMessage(error);

  useEffect(() => {
    if (hasPlayedDisconnectedSoundRef.current || !preferences.gameSounds) {
      return;
    }

    hasPlayedDisconnectedSoundRef.current = true;
    playDisconnectedSound();
  }, [preferences.gameSounds]);

  const handleOk = () => {
    void navigate({ to: "/play" });
  };

  return (
    <AlertDialog open={true}>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia>
            <Flag />
          </AlertDialogMedia>
          <AlertDialogTitle>Match ended</AlertDialogTitle>
          <AlertDialogDescription>{message}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex! w-full justify-center">
          <AlertDialogAction onClick={handleOk}>Ok</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

const getMatchErrorMessage = (error: unknown) => {
  if (error instanceof Error && error.message.includes("Game not found")) {
    return "Your opponent abandoned the game. You'll return to the lobby.";
  }
  return "This match is no longer available. You'll return to the lobby.";
};
