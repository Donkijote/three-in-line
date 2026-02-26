import { useEffect, useState } from "react";

import { CircleCheck, CircleX, Pencil } from "lucide-react-native";
import { ActivityIndicator, View } from "react-native";
import { useDebouncedCallback } from "use-debounce";

import { Small } from "@/ui/mobile/components/Typography";
import { Button } from "@/ui/mobile/components/ui/button";
import { Icon } from "@/ui/mobile/components/ui/icon";
import { Input } from "@/ui/mobile/components/ui/input";
import { Text } from "@/ui/mobile/components/ui/text";
import {
  useCheckUsernameExists,
  useCurrentUser,
  useUpdateUsername,
} from "@/ui/shared/user/hooks/useUser";

export const DisplayNameSection = () => {
  const currentUser = useCurrentUser();
  const currentUsername = currentUser?.username?.trim() ?? "";
  const [displayName, setDisplayName] = useState("");
  const [hasEdited, setHasEdited] = useState(false);
  const [doesNameExist, setDoesNameExist] = useState<boolean | null>(null);
  const { checkUsernameExists, isChecking } = useCheckUsernameExists();
  const updateUsername = useUpdateUsername();
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (hasEdited) {
      return;
    }

    setDisplayName(currentUsername);
    setDoesNameExist(currentUsername ? false : null);
  }, [currentUsername, hasEdited]);

  const trimmedDisplayName = displayName.trim();

  const handleCheckUsername = async (value: string) => {
    const trimmedValue = value.trim();

    if (!trimmedValue) {
      setDoesNameExist(null);
      return;
    }

    if (trimmedValue === currentUsername) {
      setDoesNameExist(false);
      return;
    }

    try {
      const exists = await checkUsernameExists(trimmedValue);
      setDoesNameExist(exists);
    } catch (error) {
      console.error("Failed to verify username", error);
      setDoesNameExist(null);
    }
  };

  const debouncedCheckUsername = useDebouncedCallback((value: string) => {
    void handleCheckUsername(value);
  }, 600);

  const handleChange = (nextValue: string) => {
    setDisplayName(nextValue);
    setHasEdited(true);

    if (!nextValue.trim()) {
      debouncedCheckUsername.cancel();
      setDoesNameExist(null);
      return;
    }

    if (nextValue.trim() === currentUsername) {
      debouncedCheckUsername.cancel();
      setDoesNameExist(false);
      return;
    }

    debouncedCheckUsername(nextValue);
  };

  const handleAccept = async () => {
    setIsUpdating(true);
    try {
      await updateUsername({ username: trimmedDisplayName });
      setDisplayName(trimmedDisplayName);
      setHasEdited(false);
      setDoesNameExist(null);
    } catch (error) {
      console.error("Failed to update username", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const shouldShowAccept =
    Boolean(trimmedDisplayName) &&
    trimmedDisplayName !== currentUsername &&
    doesNameExist === false &&
    !isUpdating;

  const renderStatusIcon = () => {
    if (isChecking || isUpdating) {
      return <ActivityIndicator size="small" color="hsl(0 0% 45.15%)" />;
    }

    if (!trimmedDisplayName) {
      return <Icon as={Pencil} className="text-muted-foreground" size={16} />;
    }

    if (doesNameExist === null) {
      return <Icon as={Pencil} className="text-muted-foreground" size={16} />;
    }

    return doesNameExist ? (
      <Icon as={CircleX} className="text-destructive" size={18} />
    ) : (
      <Icon as={CircleCheck} className="text-primary" size={18} />
    );
  };

  return (
    <View className="gap-2">
      <View className="h-8 flex-row items-center justify-between">
        <Small variant="label" className="text-muted-foreground">
          Display Name
        </Small>
        {shouldShowAccept ? (
          <Button
            size="sm"
            variant="outline"
            className="h-8 rounded-full"
            onPress={() => void handleAccept()}
            disabled={isUpdating}
          >
            <Text className="text-primary uppercase tracking-[1px]">
              Accept
            </Text>
          </Button>
        ) : null}
      </View>

      <View className="relative">
        <Input
          placeholder="PixelMaster_99"
          value={displayName}
          onChangeText={handleChange}
          editable={!isUpdating}
          autoCapitalize="none"
          autoCorrect={false}
          className="h-12 bg-card pr-12 text-foreground placeholder:text-muted-foreground/70"
        />
        <View
          className="absolute right-2 top-1 h-10 w-10 items-center justify-center rounded-full"
          accessibilityElementsHidden
          importantForAccessibility="no"
        >
          {renderStatusIcon()}
        </View>
      </View>
    </View>
  );
};
