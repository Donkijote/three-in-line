import { useEffect } from "react";

import { View } from "react-native";

import { useMobileHeader } from "@/ui/mobile/application/providers/MobileHeaderProvider";
import { H2, Muted, P } from "@/ui/mobile/components/Typography";
import { Button } from "@/ui/mobile/components/ui/button";

type MockScreenProps = {
  onGoBack?: () => void;
};

export const MockScreen = ({ onGoBack }: MockScreenProps) => {
  const { setHeader } = useMobileHeader();

  useEffect(() => {
    setHeader({
      title: "Mock",
      leftSlot: (
        <Button size="sm" variant="ghost" onPress={onGoBack}>
          <P>Back</P>
        </Button>
      ),
    });

    return () => {
      setHeader(null);
    };
  }, [onGoBack, setHeader]);

  return (
    <View className="flex-1 gap-4">
      <H2>Mock Screen</H2>
      <Muted>
        Expo Router navigation is working. This is a dummy destination screen.
      </Muted>

      <Button variant="secondary" onPress={onGoBack}>
        <P>Go Back</P>
      </Button>
    </View>
  );
};
