import Constants from "expo-constants";

import { Text } from "@/ui/mobile/components/ui/text";

const appVersion = Constants.expoConfig?.version ?? "0.0.0";
const buildNumber =
  Constants.expoConfig?.ios?.buildNumber ??
  (Constants.expoConfig?.android?.versionCode
    ? String(Constants.expoConfig.android.versionCode)
    : "dev");

export const VersionInfo = () => {
  return (
    <Text className="text-center text-xs uppercase tracking-widest text-muted-foreground/60">
      Version {appVersion} (Build {buildNumber})
    </Text>
  );
};
