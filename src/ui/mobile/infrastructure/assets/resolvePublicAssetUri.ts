import Constants from "expo-constants";

const trimTrailingSlash = (value: string) => value.replace(/\/+$/, "");

const inferDevWebBaseUrl = () => {
  const hostUri =
    Constants.expoConfig?.hostUri ??
    (
      Constants as {
        manifest2?: { extra?: { expoGo?: { debuggerHost?: string } } };
      }
    ).manifest2?.extra?.expoGo?.debuggerHost;

  if (!hostUri) {
    return undefined;
  }

  const [host] = hostUri.split(":");
  if (!host) {
    return undefined;
  }

  return `http://${host}:5173`;
};

const getPublicAssetsBaseUrl = () => {
  const configuredBaseUrl = process.env.EXPO_PUBLIC_PUBLIC_ASSETS_URL?.trim();
  if (configuredBaseUrl) {
    return trimTrailingSlash(configuredBaseUrl);
  }

  const inferredBaseUrl = inferDevWebBaseUrl();
  if (inferredBaseUrl) {
    return trimTrailingSlash(inferredBaseUrl);
  }

  return undefined;
};

export const resolvePublicAssetUri = (uri?: string) => {
  if (!uri) {
    return uri;
  }

  if (!uri.startsWith("/")) {
    return uri;
  }

  const baseUrl = getPublicAssetsBaseUrl();
  if (!baseUrl) {
    return uri;
  }

  return `${baseUrl}${uri}`;
};
