import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { View, type ViewProps } from "react-native";
import { SvgUri } from "react-native-svg";

import * as AvatarPrimitive from "@rn-primitives/avatar";

import { resolvePublicAssetUri } from "@/ui/mobile/infrastructure/assets/resolvePublicAssetUri";
import { cn } from "@/ui/mobile/lib/utils";

type SvgStatus = "idle" | "loading" | "loaded" | "error";

type AvatarSvgContextValue = {
  isSvgSource: boolean;
  setIsSvgSource: (value: boolean) => void;
  svgStatus: SvgStatus;
  setSvgStatus: (status: SvgStatus) => void;
};

const AvatarSvgContext = createContext<AvatarSvgContextValue | null>(null);

const useAvatarSvgContext = () => {
  const context = useContext(AvatarSvgContext);
  if (!context) {
    throw new Error(
      "Avatar compound components cannot be rendered outside the Avatar component",
    );
  }

  return context;
};

const getUriFromSource = (source?: AvatarPrimitive.ImageProps["source"]) => {
  if (!source) {
    return undefined;
  }

  if (Array.isArray(source)) {
    return source.find((entry) => Boolean(entry?.uri))?.uri;
  }

  if (typeof source === "number") {
    return undefined;
  }

  return source.uri;
};

const mapSourceUri = (source?: AvatarPrimitive.ImageProps["source"]) => {
  if (!source || typeof source === "number") {
    return source;
  }

  if (Array.isArray(source)) {
    return source.map((entry) => {
      if (!entry?.uri) {
        return entry;
      }

      return {
        ...entry,
        uri: resolvePublicAssetUri(entry.uri),
      };
    });
  }

  if (!source.uri) {
    return source;
  }

  return {
    ...source,
    uri: resolvePublicAssetUri(source.uri),
  };
};

const isSvgUri = (uri?: string) => {
  if (!uri) {
    return false;
  }

  const sanitizedUri = uri.split("?")[0]?.toLowerCase();
  return Boolean(sanitizedUri?.endsWith(".svg"));
};

function Avatar({
  className,
  ...props
}: AvatarPrimitive.RootProps & React.RefAttributes<AvatarPrimitive.RootRef>) {
  const [isSvgSource, setIsSvgSource] = useState(false);
  const [svgStatus, setSvgStatus] = useState<SvgStatus>("idle");

  const contextValue = useMemo(
    () => ({ isSvgSource, setIsSvgSource, svgStatus, setSvgStatus }),
    [isSvgSource, svgStatus],
  );

  return (
    <AvatarSvgContext.Provider value={contextValue}>
      <AvatarPrimitive.Root
        className={cn(
          "relative flex size-8 shrink-0 overflow-hidden rounded-full",
          className,
        )}
        {...props}
      />
    </AvatarSvgContext.Provider>
  );
}

function AvatarImage({
  className,
  ...props
}: AvatarPrimitive.ImageProps & React.RefAttributes<AvatarPrimitive.ImageRef>) {
  const { setIsSvgSource, setSvgStatus } = useAvatarSvgContext();
  const mappedSource = mapSourceUri(props.source);
  const sourceUri = getUriFromSource(mappedSource);
  const svgSource = isSvgUri(sourceUri);

  useEffect(() => {
    setIsSvgSource(svgSource);
    if (!svgSource) {
      setSvgStatus("idle");
      return;
    }

    setSvgStatus("loading");
    return () => {
      setSvgStatus("idle");
    };
  }, [setIsSvgSource, setSvgStatus, svgSource]);

  if (svgSource && sourceUri) {
    return (
      <SvgUri
        width="100%"
        height="100%"
        uri={sourceUri}
        onLoad={() => setSvgStatus("loaded")}
        onError={() => setSvgStatus("error")}
      />
    );
  }

  return (
    <AvatarPrimitive.Image
      className={cn("aspect-square size-full", className)}
      {...props}
      source={mappedSource}
    />
  );
}

function AvatarFallback({
  className,
  ...props
}: AvatarPrimitive.FallbackProps &
  React.RefAttributes<AvatarPrimitive.FallbackRef>) {
  const { isSvgSource, svgStatus } = useAvatarSvgContext();

  if (isSvgSource && svgStatus === "loaded") {
    return null;
  }

  return (
    <AvatarPrimitive.Fallback
      className={cn(
        "bg-muted flex size-full flex-row items-center justify-center rounded-full",
        className,
      )}
      {...props}
    />
  );
}

function AvatarBadge({ className, ...props }: ViewProps) {
  return (
    <View
      className={cn(
        "absolute bottom-0 right-0 z-10 inline-flex size-7 items-center justify-center rounded-full border-2 border-border bg-primary",
        className,
      )}
      {...props}
    />
  );
}

export { Avatar, AvatarBadge, AvatarFallback, AvatarImage };
