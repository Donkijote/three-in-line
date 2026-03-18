import { PlayScreen } from "@/ui/mobile/modules/play/screens/PlayScreen";
import { RequireAuth } from "@/ui/mobile/router/auth";

export default function PlayRoute() {
  return (
    <RequireAuth>
      <PlayScreen />
    </RequireAuth>
  );
}
