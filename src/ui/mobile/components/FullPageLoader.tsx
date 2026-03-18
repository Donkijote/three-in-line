import type { ComponentProps } from "react";
import { useEffect, useRef } from "react";

import { LinearGradient } from "expo-linear-gradient";
import { Animated, Easing, Modal, View } from "react-native";

import { H3, P, Small } from "@/ui/mobile/components/Typography";
import { Visibility } from "@/ui/mobile/layout/components/Visibility";
import { cn } from "@/ui/mobile/lib/utils";

type FullPageLoaderProps = ComponentProps<typeof View> & {
  label?: string;
  message?: string;
  subMessage?: string;
};

export const FullPageLoader = ({
  label = "Loading",
  message = "",
  subMessage = "",
  className,
  ...props
}: FullPageLoaderProps) => {
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 900,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );

    animation.start();

    return () => {
      animation.stop();
      rotation.setValue(0);
    };
  }, [rotation]);

  const spin = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <Modal
      visible
      animationType="none"
      presentationStyle="fullScreen"
      statusBarTranslucent
    >
      <View
        className={cn(
          "relative flex-1 items-center justify-center overflow-hidden bg-background px-6 py-12",
          className,
        )}
        {...props}
      >
        <LinearGradient
          pointerEvents="none"
          colors={["rgba(20, 199, 145, 0.24)", "rgba(20, 199, 145, 0)"]}
          start={{ x: 0.05, y: 0 }}
          end={{ x: 0.7, y: 0.7 }}
          style={{
            height: 236,
            left: -14,
            position: "absolute",
            top: -14,
            width: 236,
          }}
        />
        <LinearGradient
          pointerEvents="none"
          colors={["rgba(20, 199, 145, 0.2)", "rgba(20, 199, 145, 0)"]}
          start={{ x: 0.95, y: 1 }}
          end={{ x: 0.3, y: 0.3 }}
          style={{
            bottom: -28,
            height: 272,
            position: "absolute",
            right: -18,
            width: 272,
          }}
        />
        <LinearGradient
          pointerEvents="none"
          colors={["transparent", "rgba(61,168,105,0.22)", "transparent"]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={{
            height: 1,
            left: 0,
            position: "absolute",
            right: 0,
            top: 80,
          }}
        />
        <LinearGradient
          pointerEvents="none"
          colors={["transparent", "rgba(61,168,105,0.4)", "transparent"]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={{
            alignSelf: "center",
            height: 1,
            position: "absolute",
            top: 80,
            width: "44%",
          }}
        />

        <View
          className="relative z-10 w-full max-w-sm items-center gap-6 rounded-3xl border border-border/60 bg-card/70 px-8 py-8"
          style={{
            shadowColor: "#000000",
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.12,
            shadowRadius: 18,
            elevation: 4,
          }}
        >
          <View className="items-center justify-center">
            <View className="relative size-16 items-center justify-center">
              <View className="absolute inset-0 rounded-full border-2 border-primary/20" />
              <Animated.View
                className="absolute inset-0 rounded-full border-2 border-primary border-t-transparent"
                style={{ transform: [{ rotate: spin }] }}
              />
              <View className="absolute size-3 rounded-full bg-primary shadow-[0_0_18px_rgba(0,0,0,0.25)]" />
            </View>
          </View>

          <View className="items-center gap-2">
            <Small variant="label" className="text-primary/80">
              {label}
            </Small>
            <Visibility visible={Boolean(message)}>
              <H3 className="text-center text-2xl font-bold tracking-tight">
                {message}
              </H3>
            </Visibility>
            <Visibility visible={Boolean(subMessage)}>
              <P className="mt-0 text-center text-sm leading-6 text-muted-foreground">
                {subMessage}
              </P>
            </Visibility>
          </View>
        </View>
      </View>
    </Modal>
  );
};
