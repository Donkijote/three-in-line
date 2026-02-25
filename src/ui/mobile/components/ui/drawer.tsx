import type { ComponentProps, PropsWithChildren } from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { BlurView } from "expo-blur";
import {
  Animated,
  Modal,
  PanResponder,
  Platform,
  Pressable,
  type PressableProps,
  useWindowDimensions,
  View,
  type ViewProps,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Text } from "@/ui/mobile/components/ui/text";
import { cn } from "@/ui/mobile/lib/utils";

type DrawerDirection = "bottom" | "top" | "left" | "right";

type DrawerContextValue = {
  direction: DrawerDirection;
  open: boolean;
  setOpen: (open: boolean) => void;
};

const DrawerContext = createContext<DrawerContextValue | null>(null);

const useDrawerContext = () => {
  const context = useContext(DrawerContext);
  if (!context) {
    throw new Error("Drawer components must be used within <Drawer />");
  }
  return context;
};

type DrawerProps = PropsWithChildren<{
  defaultOpen?: boolean;
  direction?: DrawerDirection;
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
}>;

function Drawer({
  children,
  direction = "bottom",
  open,
  defaultOpen = false,
  onOpenChange,
}: DrawerProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isControlled = open !== undefined;
  const resolvedOpen = isControlled ? open : internalOpen;

  const setOpen = useCallback(
    (nextOpen: boolean) => {
      if (!isControlled) {
        setInternalOpen(nextOpen);
      }
      onOpenChange?.(nextOpen);
    },
    [isControlled, onOpenChange],
  );

  const value = useMemo<DrawerContextValue>(
    () => ({
      direction,
      open: resolvedOpen,
      setOpen,
    }),
    [direction, resolvedOpen, setOpen],
  );

  return (
    <DrawerContext.Provider value={value}>{children}</DrawerContext.Provider>
  );
}

function DrawerTrigger({ children, onPress, ...props }: PressableProps) {
  const { setOpen } = useDrawerContext();

  return (
    <Pressable
      onPress={(event) => {
        onPress?.(event);
        setOpen(true);
      }}
      {...props}
    >
      {children}
    </Pressable>
  );
}

function DrawerClose({ children, onPress, ...props }: PressableProps) {
  const { setOpen } = useDrawerContext();

  return (
    <Pressable
      onPress={(event) => {
        onPress?.(event);
        setOpen(false);
      }}
      {...props}
    >
      {children}
    </Pressable>
  );
}

function DrawerPortal({ children }: PropsWithChildren) {
  return <>{children}</>;
}

type DrawerOverlayProps = PressableProps & {
  closeOnPress?: boolean;
};

function DrawerOverlay({
  className,
  closeOnPress = true,
  ...props
}: DrawerOverlayProps) {
  const { setOpen } = useDrawerContext();

  return (
    <Pressable
      className={cn("absolute inset-0", className)}
      onPress={() => {
        if (closeOnPress) {
          setOpen(false);
        }
      }}
      {...props}
    >
      {Platform.OS === "ios" ? (
        <BlurView intensity={18} tint="dark" className="absolute inset-0" />
      ) : (
        <View className="absolute inset-0 bg-black/75" />
      )}
    </Pressable>
  );
}

type DrawerContentProps = ViewProps & {
  closeOnOverlayPress?: boolean;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function DrawerContent({
  className,
  children,
  closeOnOverlayPress = true,
  ...props
}: DrawerContentProps) {
  const { direction, open, setOpen } = useDrawerContext();
  const { height, width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [isMounted, setIsMounted] = useState(open);
  const progress = useRef(new Animated.Value(open ? 1 : 0)).current;
  const dragOffset = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (open) {
      setIsMounted(true);
      dragOffset.setValue(0);
      Animated.spring(progress, {
        toValue: 1,
        damping: 30,
        mass: 0.9,
        stiffness: 340,
        useNativeDriver: true,
      }).start();
      return;
    }

    Animated.spring(progress, {
      toValue: 0,
      damping: 30,
      mass: 0.9,
      stiffness: 240,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) {
        setIsMounted(false);
      }
    });
  }, [dragOffset, open, progress]);

  const horizontalDistance = Math.max(width * 0.9, 420);
  const verticalDistance = Math.max(height * 0.9, 560);

  const closeAxis = direction === "left" || direction === "right" ? "x" : "y";
  const closeSign = direction === "left" || direction === "top" ? -1 : 1;

  const baseTranslateX =
    direction === "left"
      ? progress.interpolate({
          inputRange: [0, 1],
          outputRange: [-horizontalDistance, 0],
        })
      : direction === "right"
        ? progress.interpolate({
            inputRange: [0, 1],
            outputRange: [horizontalDistance, 0],
          })
        : 0;

  const baseTranslateY =
    direction === "top"
      ? progress.interpolate({
          inputRange: [0, 1],
          outputRange: [-verticalDistance, 0],
        })
      : direction === "bottom"
        ? progress.interpolate({
            inputRange: [0, 1],
            outputRange: [verticalDistance, 0],
          })
        : 0;

  const signedDragOffset =
    closeSign === 1 ? dragOffset : Animated.multiply(dragOffset, -1);

  const translateX =
    closeAxis === "x"
      ? Animated.add(baseTranslateX, signedDragOffset)
      : baseTranslateX;
  const translateY =
    closeAxis === "y"
      ? Animated.add(baseTranslateY, signedDragOffset)
      : baseTranslateY;

  const animatedSheetStyle = {
    opacity: progress.interpolate({
      inputRange: [0, 1],
      outputRange: [0.9, 1],
    }),
    transform: [{ translateX }, { translateY }],
  };

  const animatedOverlayStyle = {
    opacity: progress.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    }),
  };

  const closeDistanceThreshold =
    (closeAxis === "x" ? horizontalDistance : verticalDistance) * 0.08;

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => closeAxis === "y",
        onStartShouldSetPanResponderCapture: () => closeAxis === "y",
        onMoveShouldSetPanResponder: (_, gestureState) => {
          const primaryMovement =
            closeAxis === "x"
              ? Math.abs(gestureState.dx)
              : Math.abs(gestureState.dy);
          const crossMovement =
            closeAxis === "x"
              ? Math.abs(gestureState.dy)
              : Math.abs(gestureState.dx);
          return primaryMovement > 2 && primaryMovement > crossMovement;
        },
        onMoveShouldSetPanResponderCapture: (_, gestureState) => {
          const primaryMovement =
            closeAxis === "x"
              ? Math.abs(gestureState.dx)
              : Math.abs(gestureState.dy);
          return closeAxis === "y" ? primaryMovement > 1 : primaryMovement > 2;
        },
        onPanResponderTerminationRequest: () => true,
        onPanResponderMove: (_, gestureState) => {
          const primaryDelta =
            closeAxis === "x" ? gestureState.dx : gestureState.dy;
          const projectedDistance = closeSign * primaryDelta;
          dragOffset.setValue(Math.max(0, projectedDistance));
        },
        onPanResponderRelease: (_, gestureState) => {
          const primaryDelta =
            closeAxis === "x" ? gestureState.dx : gestureState.dy;
          const primaryVelocity =
            closeAxis === "x" ? gestureState.vx : gestureState.vy;
          const projectedDistance = Math.max(0, closeSign * primaryDelta);
          const projectedVelocity = closeSign * primaryVelocity;

          if (
            projectedDistance > closeDistanceThreshold ||
            projectedVelocity > 0.2
          ) {
            setOpen(false);
            return;
          }

          Animated.spring(dragOffset, {
            toValue: 0,
            damping: 24,
            mass: 0.8,
            stiffness: 300,
            useNativeDriver: true,
          }).start();
        },
        onPanResponderTerminate: () => {
          Animated.spring(dragOffset, {
            toValue: 0,
            damping: 24,
            mass: 0.8,
            stiffness: 300,
            useNativeDriver: true,
          }).start();
        },
      }),
    [closeAxis, closeDistanceThreshold, closeSign, dragOffset, setOpen],
  );

  if (!isMounted) {
    return null;
  }

  const containerPaddingTop =
    direction === "top"
      ? Math.max(insets.top + 16, 28)
      : direction === "left" || direction === "right"
        ? Math.max(insets.top + 2, 8)
        : 4;

  const containerPaddingBottom =
    direction === "bottom"
      ? Math.max(insets.bottom * 0.3, 0)
      : direction === "left" || direction === "right"
        ? Math.max(insets.bottom * 0.35, 4)
        : Math.max(insets.bottom + 8, 12);

  return (
    <Modal
      animationType="none"
      transparent
      visible={isMounted}
      onRequestClose={() => setOpen(false)}
    >
      <DrawerPortal>
        <View className="flex-1">
          <AnimatedPressable
            className="absolute inset-0"
            style={animatedOverlayStyle}
            onPress={() => {
              if (closeOnOverlayPress) {
                setOpen(false);
              }
            }}
          >
            {Platform.OS === "ios" ? (
              <BlurView
                intensity={18}
                tint="dark"
                className="absolute inset-0"
              />
            ) : (
              <View className="absolute inset-0 bg-black/75" />
            )}
          </AnimatedPressable>
          <View
            className={cn("absolute inset-0 px-4", {
              "justify-end": direction === "bottom",
              "justify-start": direction === "top",
              "items-start": direction === "left",
              "items-end": direction === "right",
            })}
            style={{
              paddingBottom: containerPaddingBottom,
              paddingTop: containerPaddingTop,
            }}
            pointerEvents="box-none"
          >
            <Animated.View
              className={cn(
                "relative overflow-hidden border border-border bg-card p-4 shadow-lg shadow-black/35",
                {
                  "mb-0 max-h-[84%] w-full rounded-[30px]":
                    direction === "bottom",
                  "mt-3 max-h-[84%] w-full rounded-[30px]": direction === "top",
                  "h-full max-h-full w-[82%] max-w-sm rounded-[30px]":
                    direction === "left" || direction === "right",
                },
                className,
              )}
              style={animatedSheetStyle}
              {...(closeAxis === "x" ? panResponder.panHandlers : {})}
              {...props}
            >
              {direction === "bottom" ? (
                <View
                  className="mb-3 mt-1 h-6 w-24 self-center items-center justify-center"
                  {...panResponder.panHandlers}
                >
                  <View className="h-1.5 w-24 rounded-full bg-muted" />
                </View>
              ) : null}
              {children}
              {direction === "top" ? (
                <View
                  className="mt-3 h-6 w-24 self-center items-center justify-center"
                  {...panResponder.panHandlers}
                >
                  <View className="h-1.5 w-24 rounded-full bg-muted" />
                </View>
              ) : null}
            </Animated.View>
          </View>
        </View>
      </DrawerPortal>
    </Modal>
  );
}

function DrawerHeader({ className, ...props }: ViewProps) {
  return (
    <View
      className={cn("flex flex-col gap-1 px-1 py-2", className)}
      {...props}
    />
  );
}

function DrawerFooter({ className, ...props }: ViewProps) {
  return (
    <View
      className={cn("mt-auto flex flex-col gap-2 px-1 py-2", className)}
      {...props}
    />
  );
}

function DrawerTitle({ className, ...props }: ComponentProps<typeof Text>) {
  return (
    <Text
      className={cn(
        "text-foreground text-base font-semibold tracking-tight",
        className,
      )}
      {...props}
    />
  );
}

function DrawerDescription({
  className,
  ...props
}: ComponentProps<typeof Text>) {
  return (
    <Text
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
}

export {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerPortal,
  DrawerTitle,
  DrawerTrigger,
};
