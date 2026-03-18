import { useEffect, useMemo, useRef, useState } from "react";

import { router } from "expo-router";
import {
  Crown,
  Flag,
  Frown,
  HeartCrack,
  Home,
  RotateCcw,
  Shuffle,
  TimerOff,
  Trophy,
  WifiOff,
} from "lucide-react-native";
import {
  AppState,
  Modal,
  Pressable,
  View,
} from "react-native";

import { abandonGameUseCase } from "@/application/games/abandonGameUseCase";
import { findOrCreateGameUseCase } from "@/application/games/findOrCreateGameUseCase";
import { heartbeatUseCase } from "@/application/games/heartbeatUseCase";
import { placeMarkUseCase } from "@/application/games/placeMarkUseCase";
import { timeoutTurnUseCase } from "@/application/games/timeoutTurnUseCase";
import { resolveAvatarSrc, type UserAvatar } from "@/domain/entities/Avatar";
import {
  DEFAULT_GRID_SIZE,
  type GameId,
  type MatchState,
} from "@/domain/entities/Game";
import { gameRepository } from "@/infrastructure/convex/repository/gameRepository";
import { useMobileHeader } from "@/ui/mobile/application/providers/MobileHeaderProvider";
import { FullPageLoader } from "@/ui/mobile/components/FullPageLoader";
import { H3, H6, Muted, P, Small } from "@/ui/mobile/components/Typography";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/ui/mobile/components/ui/avatar";
import { Button } from "@/ui/mobile/components/ui/button";
import { Card, CardContent } from "@/ui/mobile/components/ui/card";
import { Icon } from "@/ui/mobile/components/ui/icon";
import { Text } from "@/ui/mobile/components/ui/text";
import { cn } from "@/ui/mobile/lib/utils";
import { useGame, useTurnTimer } from "@/ui/shared/match/hooks/useGame";
import {
  buildMatchPlayers,
  getMatchResultViewModel,
  getOpponentId,
  resolveCurrentSlot,
  toDisplayBoard,
} from "@/ui/shared/match/utils";
import { useCurrentUser, useUserById } from "@/ui/shared/user/hooks/useUser";
import { resolvePlayerLabel } from "@/ui/shared/user/resolvePlayerLabel";

type MatchScreenProps = {
  gameId?: GameId;
};

const HEARTBEAT_INTERVAL_MS = 20_000;
const HEARTBEAT_JITTER_MS = 1_500;

export const MatchScreen = ({ gameId }: MatchScreenProps) => {
  useGameHeartbeat(gameId);

  const { setHeader } = useMobileHeader();
  const game = useGame(gameId);
  const currentUser = useCurrentUser();
  const currentUserId = currentUser?.id;
  const opponentId = getOpponentId(game, currentUserId);
  const opponentUser = useUserById(opponentId);
  const [isPlacing, setIsPlacing] = useState(false);
  const [isAbandoning, setIsAbandoning] = useState(false);
  const currentSlot =
    currentUser && game
      ? (resolveCurrentSlot(currentUser.id, game.p1UserId) ?? null)
      : null;
  const timerEnabled = game?.turnDurationMs !== null;
  const timerActive =
    Boolean(timerEnabled) &&
    game?.status === "playing" &&
    game.turnDeadlineTime !== null;
  const { isExpired, progress: timerProgress } = useTurnTimer({
    isActive: Boolean(timerActive),
    durationMs: game?.turnDurationMs,
    deadlineTime: game?.turnDeadlineTime,
    expireDelayMs: 1200,
    onExpire: () => handleExpire(game?.id),
  });
  const isOwnTurnTimerActive = Boolean(
    timerActive && currentSlot && game?.currentTurn === currentSlot,
  );
  const isTimeUpVisible = Boolean(isExpired && isOwnTurnTimerActive);

  useEffect(() => {
    setHeader({
      title: "Tic-Tac-Toe",
      eyebrow: "Live Match",
      leftSlot: (
        <Button size="sm" variant="ghost" onPress={() => router.back()}>
          <P>Back</P>
        </Button>
      ),
    });

    return () => {
      setHeader(null);
    };
  }, [setHeader]);

  const resultViewModel = useMemo(() => {
    if (!game || !currentUser || !opponentUser) {
      return null;
    }

    return getMatchResultViewModel({
      status: game.status,
      endedReason: game.endedReason,
      winner: game.winner,
      abandonedBy: game.abandonedBy,
      p1UserId: game.p1UserId,
      currentUserId,
      score: game.match?.score,
      currentUser: {
        name: resolvePlayerLabel(currentUser, "You"),
        avatar: currentUser.avatar,
      },
      opponentUser: {
        name: resolvePlayerLabel(opponentUser, "Opponent"),
        avatar: opponentUser.avatar,
      },
    });
  }, [currentUser, currentUserId, game, opponentUser]);

  if (!gameId) {
    return (
      <CenteredState
        title="Missing match"
        description="A game id is required before the mobile match screen can load."
      />
    );
  }

  if (!game || !currentUser) {
    return (
      <FullPageLoader
        label="Match"
        message="Loading match"
        subMessage="Syncing the latest game state."
      />
    );
  }

  if ((game.status === "waiting" && !game.p2UserId) || !opponentUser) {
    return (
      <FullPageLoader
        label="Match"
        message="Waiting for opponent"
        subMessage="Waiting for the second player to connect."
      />
    );
  }

  const handleCellPress = async (index: number) => {
    if (isPlacing) {
      return;
    }

    setIsPlacing(true);
    try {
      await placeMarkUseCase(gameRepository, { gameId, index });
    } catch (error) {
      console.debug("Place mark failed.", error);
    } finally {
      setIsPlacing(false);
    }
  };

  const handleCreateNewGame = async () => {
    try {
      const nextGameId = await findOrCreateGameUseCase(gameRepository, {
        gridSize: game.gridSize,
        winLength: game.winLength,
        matchFormat: game.match.format,
        isTimed: game.turnDurationMs !== null,
      });

      router.replace({
        pathname: "/match",
        params: { gameId: nextGameId },
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleAbandonMatch = async () => {
    if (!gameId || isAbandoning) {
      return;
    }

    setIsAbandoning(true);
    try {
      await abandonGameUseCase(gameRepository, { gameId });
      router.replace("/play");
    } finally {
      setIsAbandoning(false);
    }
  };

  const players = buildMatchPlayers(
    game.p1UserId,
    game.currentTurn,
    currentUser,
    opponentUser,
    game.match,
  );

  return (
    <>
      <View className="flex-1 gap-6 pb-12">
        <MatchPlayersSection
          players={players}
          showWins={game.match.format !== "single"}
          timerActive={Boolean(timerActive)}
          timerProgress={timerProgress}
        />

        <MatchBoardSection
          board={game.board}
          gridSize={game.gridSize}
          status={game.status}
          currentTurn={game.currentTurn}
          currentUserId={currentUserId}
          p1UserId={game.p1UserId}
          isTimeUp={isTimeUpVisible}
          isPlacing={isPlacing}
          onCellPress={handleCellPress}
        />

        <MatchActionsSection
          match={game.match}
          isAbandoning={isAbandoning}
          onAbandonMatch={handleAbandonMatch}
        />
      </View>

      <MatchResultOverlay
        model={resultViewModel}
        onPrimaryAction={handleCreateNewGame}
      />
    </>
  );
};

type MatchPlayersSectionProps = {
  players: ReturnType<typeof buildMatchPlayers>;
  showWins: boolean;
  timerActive: boolean;
  timerProgress: number;
};

const MatchPlayersSection = ({
  players,
  showWins,
  timerActive,
  timerProgress,
}: MatchPlayersSectionProps) => {
  return (
    <View className="flex-row gap-3">
      {players.map((player) => (
        <MatchPlayerCard
          key={player.id}
          name={player.name}
          symbol={player.symbol}
          wins={player.wins}
          showWins={showWins}
          isTurn={player.isTurn}
          avatar={player.avatar}
          accent={player.accent}
          turnTimer={
            timerActive && player.isTurn
              ? { isActive: true, progress: timerProgress }
              : undefined
          }
        />
      ))}
    </View>
  );
};

type MatchPlayerCardProps = {
  name: string;
  symbol: "X" | "O";
  wins: number;
  showWins: boolean;
  isTurn: boolean;
  avatar?: string;
  accent: "primary" | "opponent";
  turnTimer?: {
    isActive: boolean;
    progress: number;
  };
};

const MatchPlayerCard = ({
  name,
  symbol,
  wins,
  showWins,
  isTurn,
  avatar,
  accent,
  turnTimer,
}: MatchPlayerCardProps) => {
  const showTurnTimer = Boolean(turnTimer?.isActive);
  const accentClasses =
    accent === "opponent"
      ? {
          badge: "bg-opponent text-opponent-foreground",
          border: "border-opponent/50",
          symbol: "text-opponent",
          timer: "bg-opponent",
          shadow: "shadow-[0_0_18px_-10px_rgba(227,94,82,0.55)]",
        }
      : {
          badge: "bg-primary text-primary-foreground",
          border: "border-primary/50",
          symbol: "text-primary",
          timer: "bg-primary",
          shadow: "shadow-[0_0_18px_-10px_rgba(61,168,105,0.55)]",
        };
  const timerProgress = Math.max(0, Math.min(turnTimer?.progress ?? 0, 1));
  const isUrgent = showTurnTimer && timerProgress <= 0.1;
  const badgeClassName = isUrgent
    ? "bg-destructive text-destructive-foreground"
    : accentClasses.badge;

  return (
    <Card
      className={cn(
        "flex-1 gap-0 rounded-3xl border-border/60 px-0 py-0 shadow-sm shadow-black/5",
        {
          "opacity-70": !isTurn,
          [accentClasses.border]: isTurn,
          [accentClasses.shadow]: isTurn,
        },
      )}
    >
      {showTurnTimer ? (
        <View className="overflow-hidden rounded-t-3xl">
          <View className="h-1 w-full bg-secondary/80">
            <View
              className={cn("h-full", {
                "bg-destructive": isUrgent,
                [accentClasses.timer]: !isUrgent,
              })}
              style={{ width: `${Math.max(timerProgress * 100, 0)}%` }}
            />
          </View>
        </View>
      ) : null}
      <CardContent className="items-center gap-3 px-4 py-4">
        {isTurn ? (
          <View className="w-full flex-row justify-center">
            <Small
              className={cn(
                "rounded-full px-2.5 py-1 text-[10px] uppercase tracking-[0.18em]",
                badgeClassName,
              )}
            >
              Turn
            </Small>
          </View>
        ) : null}
        <Avatar
          alt={name}
          className={cn("size-16 border-2 bg-card", {
            [accentClasses.border]: isTurn,
            "border-border/60": !isTurn,
          })}
        >
          {avatar ? <AvatarImage source={{ uri: avatar }} /> : null}
          <AvatarFallback className="bg-secondary">
            <H6>{name.slice(0, 1)}</H6>
          </AvatarFallback>
        </Avatar>
        <View className="items-center gap-1">
          <H6 className="text-center text-sm">{name}</H6>
          <Text className={cn("text-sm font-semibold", accentClasses.symbol)}>
            ({symbol})
          </Text>
          {showWins ? (
            <Muted className="mt-0 text-xs text-muted-foreground">
              Wins: {wins}
            </Muted>
          ) : null}
        </View>
      </CardContent>
    </Card>
  );
};

type MatchBoardSectionProps = {
  board: Array<"P1" | "P2" | null>;
  gridSize?: number;
  status: "waiting" | "playing" | "paused" | "ended" | "canceled";
  currentTurn: "P1" | "P2";
  currentUserId?: string;
  p1UserId: string;
  isTimeUp: boolean;
  isPlacing: boolean;
  onCellPress: (index: number) => void;
};

const MatchBoardSection = ({
  board,
  gridSize,
  status,
  currentTurn,
  currentUserId,
  p1UserId,
  isTimeUp,
  isPlacing,
  onCellPress,
}: MatchBoardSectionProps) => {
  const resolvedGridSize = gridSize ?? DEFAULT_GRID_SIZE;
  const currentSlot = resolveCurrentSlot(currentUserId, p1UserId);
  const isCurrentUserP1 = currentSlot ? currentSlot === "P1" : true;
  const displayBoard = toDisplayBoard(board, resolvedGridSize);
  const cellFontClassName =
    resolvedGridSize <= 4 ? "text-4xl" : "text-3xl leading-none";
  const currentPlayerClasses = {
    P1: isCurrentUserP1 ? "text-primary" : "text-opponent",
    P2: isCurrentUserP1 ? "text-opponent" : "text-primary",
  };

  return (
    <Card
      className={cn(
        "relative rounded-[2rem] border-border/70 px-4 py-4 shadow-[0_18px_35px_-26px_rgba(0,0,0,0.5)]",
        {
          "border-destructive/60": isTimeUp,
        },
      )}
    >
      <View className="gap-2">
        {displayBoard.map((row, rowIndex) => (
          <View key={`row-${rowIndex.toString()}`} className="flex-row gap-2">
            {row.map((cell, colIndex) => {
              const isCellTaken = cell !== "";
              const isKnownUser = Boolean(currentSlot);
              const isNotYourTurn =
                status === "playing" &&
                isKnownUser &&
                currentTurn !== currentSlot &&
                !isTimeUp;
              const isHardDisabled =
                status !== "playing" || !isKnownUser || isPlacing || isTimeUp;
              const isDisabled =
                isHardDisabled || isCellTaken || Boolean(isNotYourTurn);
              const index = rowIndex * resolvedGridSize + colIndex;

              return (
                <Pressable
                  key={`${rowIndex.toString()}-${colIndex.toString()}`}
                  accessibilityRole="button"
                  accessibilityLabel={`Match cell ${index + 1}`}
                  disabled={isHardDisabled}
                  className={cn(
                    "aspect-square flex-1 items-center justify-center rounded-3xl border border-border/70 bg-secondary",
                    {
                      "opacity-55": isDisabled,
                    },
                  )}
                  onPress={() => {
                    if (isCellTaken || isNotYourTurn) {
                      return;
                    }

                    onCellPress(index);
                  }}
                >
                  <Text
                    className={cn("font-semibold", cellFontClassName, {
                      [currentPlayerClasses.P1]: cell === "X",
                      [currentPlayerClasses.P2]: cell === "O",
                    })}
                  >
                    {cell}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        ))}
      </View>
      {isTimeUp ? (
        <View className="absolute inset-0 items-center justify-center rounded-[2rem] bg-card/92 px-6">
          <View className="items-center gap-4">
            <View className="size-18 items-center justify-center rounded-full border border-destructive/30 bg-destructive/10">
              <Icon as={TimerOff} className="size-9 text-destructive" />
            </View>
            <View className="items-center gap-1">
              <H3 className="text-center uppercase tracking-[0.2em] text-destructive">
                Time&apos;s up
              </H3>
              <Muted className="mt-0 text-center text-sm">
                Your turn expired before the move could be placed.
              </Muted>
            </View>
          </View>
        </View>
      ) : null}
    </Card>
  );
};

type MatchActionsSectionProps = {
  match: MatchState | null;
  isAbandoning: boolean;
  onAbandonMatch: () => Promise<void>;
};

const MatchActionsSection = ({
  match,
  isAbandoning,
  onAbandonMatch,
}: MatchActionsSectionProps) => {
  const showRoundCounter = Boolean(match && match.format !== "single");
  const bestOf = match ? match.targetWins * 2 - 1 : 1;

  return (
    <View className="gap-4">
      {showRoundCounter ? (
        <View className="items-center">
          <View className="rounded-full border border-border/60 bg-card px-4 py-2">
            <Small className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Round {match?.roundIndex ?? 1} · Best of {bestOf}
            </Small>
          </View>
        </View>
      ) : null}

      <Button
        variant="outline"
        className="h-12 rounded-full border-destructive/30"
        onPress={() => void onAbandonMatch()}
        disabled={isAbandoning}
      >
        <Icon as={Flag} className="text-destructive" size={16} />
        <Text className="font-semibold text-destructive">
          {isAbandoning ? "Abandoning..." : "Abandon Match"}
        </Text>
      </Button>
    </View>
  );
};

type MatchResultOverlayProps = {
  model: ReturnType<typeof getMatchResultViewModel>;
  onPrimaryAction: () => Promise<void>;
};

const MatchResultOverlay = ({
  model,
  onPrimaryAction,
}: MatchResultOverlayProps) => {
  if (!model) {
    return null;
  }

  const iconConfig = resolveResultIcon(model.icon, model.accent);
  const currentAccentClassName = model.isCurrentWinner
    ? "text-primary"
    : "text-destructive";
  const opponentAccentClassName = model.isCurrentWinner
    ? "text-destructive"
    : "text-primary";

  return (
    <Modal transparent visible animationType="fade">
      <View className="flex-1 justify-center bg-background/95 px-6">
        <Card className="rounded-[2rem] border-border/70 px-0 py-0 shadow-[0_18px_35px_-26px_rgba(0,0,0,0.5)]">
          <CardContent className="gap-6 px-6 py-6">
            <View className="items-center gap-2">
              <View
                className={cn(
                  "size-20 items-center justify-center rounded-full",
                  iconConfig.containerClassName,
                )}
              >
                <Icon
                  as={iconConfig.icon}
                  className={iconConfig.iconClassName}
                />
              </View>
              <H3
                className={cn(
                  "text-center uppercase tracking-[0.18em]",
                  model.accent === "primary"
                    ? "text-primary"
                    : "text-destructive",
                )}
              >
                {model.title}
              </H3>
              {model.subtitle ? (
                <Muted className="mt-0 text-center whitespace-pre-line text-sm leading-6">
                  {model.subtitle}
                </Muted>
              ) : null}
              {model.pill ? (
                <Small className="rounded-full bg-secondary px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  {model.pill}
                </Small>
              ) : null}
            </View>

            <View className="rounded-[1.5rem] border border-border/60 bg-secondary/50 px-4 py-4">
              <View className="flex-row items-center justify-between gap-4">
                <ResultPlayer
                  label="You"
                  name={model.currentUser.name}
                  avatar={model.currentUser.avatar}
                  score={model.score?.current}
                  accentClassName={currentAccentClassName}
                  isWinner={model.isCurrentWinner}
                />
                <View className="items-center gap-1">
                  <Small className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                    Final
                  </Small>
                  <Small className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                    Result
                  </Small>
                </View>
                <ResultPlayer
                  label="Opponent"
                  name={model.opponentUser.name}
                  avatar={model.opponentUser.avatar}
                  score={model.score?.opponent}
                  accentClassName={opponentAccentClassName}
                  isWinner={!model.isCurrentWinner}
                  align="right"
                />
              </View>
              {model.footer ? (
                <View className="mt-4 border-t border-border/60 pt-4">
                  <Small className="text-center text-[10px] uppercase tracking-[0.18em] text-primary">
                    {model.footer}
                  </Small>
                </View>
              ) : null}
            </View>

            <View className="gap-3">
              <Button
                className={cn(
                  "h-12 rounded-full",
                  model.accent === "primary" ? "bg-primary" : "bg-destructive",
                )}
                onPress={() => void onPrimaryAction()}
              >
                <Icon as={RotateCcw} className="text-primary-foreground" />
                <Text className="font-semibold uppercase tracking-[0.18em] text-primary-foreground">
                  {model.primaryLabel}
                </Text>
              </Button>
              <Button
                variant="secondary"
                className="h-12 rounded-full"
                onPress={() => router.replace("/play")}
              >
                <Icon as={Shuffle} />
                <Text className="font-semibold uppercase tracking-[0.18em]">
                  {model.changeModeLabel}
                </Text>
              </Button>
              <Button
                variant="outline"
                className="h-12 rounded-full"
                onPress={() => router.replace("/")}
              >
                <Icon as={Home} />
                <Text className="font-semibold uppercase tracking-[0.18em]">
                  {model.secondaryLabel}
                </Text>
              </Button>
            </View>
          </CardContent>
        </Card>
      </View>
    </Modal>
  );
};

type ResultPlayerProps = {
  label: string;
  name: string;
  avatar?: UserAvatar;
  score?: number;
  accentClassName: string;
  isWinner: boolean;
  align?: "left" | "right";
};

const ResultPlayer = ({
  label,
  name,
  avatar,
  score,
  accentClassName,
  isWinner,
  align = "left",
}: ResultPlayerProps) => {
  const avatarSrc = resolveAvatarSrc(avatar);

  return (
    <View
      className={cn("min-w-0 flex-1 gap-2", {
        "items-end": align === "right",
        "items-start": align === "left",
      })}
    >
      <Avatar
        alt={name}
        className={cn("size-14 border-2 bg-card", {
          "border-border/60": !isWinner,
          "border-primary/70": isWinner,
          "border-destructive/70": !isWinner,
        })}
      >
        {avatarSrc ? <AvatarImage source={{ uri: avatarSrc }} /> : null}
        <AvatarFallback className="bg-secondary">
          <H6>{name.slice(0, 1)}</H6>
        </AvatarFallback>
      </Avatar>
      <View
        className={cn(
          "absolute top-10 size-5 items-center justify-center rounded-full",
          {
            "-right-1 bg-primary": align === "left" && isWinner,
            "-right-1 bg-destructive": align === "left" && !isWinner,
            "-left-1 bg-primary": align === "right" && isWinner,
            "-left-1 bg-destructive": align === "right" && !isWinner,
          },
        )}
      >
        <Icon
          as={isWinner ? Crown : Frown}
          className="size-3 text-primary-foreground"
        />
      </View>
      <View
        className={cn("gap-1", {
          "items-end": align === "right",
          "items-start": align === "left",
        })}
      >
        <Small className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          {label}
        </Small>
        <H6 className="text-sm" numberOfLines={1}>
          {name}
        </H6>
        {typeof score === "number" ? (
          <Text className={cn("text-xl font-semibold", accentClassName)}>
            {score}
          </Text>
        ) : null}
      </View>
    </View>
  );
};

type CenteredStateProps = {
  title: string;
  description: string;
};

const CenteredState = ({ title, description }: CenteredStateProps) => {
  return (
    <View className="flex-1 justify-center">
      <Card className="rounded-3xl border-border/60">
        <CardContent className="gap-2 px-6 py-6">
          <H3 className="text-left text-xl">{title}</H3>
          <Muted className="mt-0 text-base leading-6">{description}</Muted>
        </CardContent>
      </Card>
    </View>
  );
};

const handleExpire = async (gameId?: string) => {
  if (!gameId) {
    return;
  }

  try {
    await timeoutTurnUseCase(gameRepository, { gameId });
  } catch (error) {
    console.debug("Timeout turn failed.", error);
  }
};

const useGameHeartbeat = (gameId?: GameId) => {
  const gameIdRef = useRef<GameId | undefined>(gameId);
  const intervalIdRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutIdRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inFlightRef = useRef(false);

  useEffect(() => {
    gameIdRef.current = gameId;
  }, [gameId]);

  useEffect(() => {
    const stop = () => {
      if (intervalIdRef.current !== null) {
        clearInterval(intervalIdRef.current);
        intervalIdRef.current = null;
      }

      if (timeoutIdRef.current !== null) {
        clearTimeout(timeoutIdRef.current);
        timeoutIdRef.current = null;
      }
    };

    const triggerHeartbeat = async () => {
      const activeGameId = gameIdRef.current;
      if (!activeGameId || inFlightRef.current) {
        return;
      }

      inFlightRef.current = true;
      try {
        await heartbeatUseCase(gameRepository, { gameId: activeGameId });
      } catch (error) {
        console.debug("Game heartbeat failed.", error);
      } finally {
        inFlightRef.current = false;
      }
    };

    const triggerHeartbeatWithJitter = () => {
      const delay = Math.floor(Math.random() * (HEARTBEAT_JITTER_MS + 1));

      if (delay === 0) {
        void triggerHeartbeat();
        return;
      }

      if (timeoutIdRef.current !== null) {
        clearTimeout(timeoutIdRef.current);
      }

      timeoutIdRef.current = setTimeout(() => {
        void triggerHeartbeat();
      }, delay);
    };

    const startInterval = () => {
      if (intervalIdRef.current !== null || !gameIdRef.current) {
        return;
      }

      intervalIdRef.current = setInterval(() => {
        triggerHeartbeatWithJitter();
      }, HEARTBEAT_INTERVAL_MS);
    };

    if (!gameId) {
      stop();
      return;
    }

    void triggerHeartbeat();
    if (AppState.currentState === "active") {
      startInterval();
    }

    const subscription = AppState.addEventListener("change", (nextState) => {
      if (!gameIdRef.current) {
        stop();
        return;
      }

      if (nextState === "active") {
        void triggerHeartbeat();
        startInterval();
        return;
      }

      stop();
    });

    return () => {
      subscription.remove();
      stop();
    };
  }, [gameId]);
};

const resolveResultIcon = (
  icon: NonNullable<ReturnType<typeof getMatchResultViewModel>>["icon"],
  accent: NonNullable<ReturnType<typeof getMatchResultViewModel>>["accent"],
) => {
  if (icon === "wifi") {
    return {
      icon: WifiOff,
      iconClassName: "size-10 text-amber-500",
      containerClassName: "bg-amber-500/12",
    };
  }

  if (icon === "flag") {
    return {
      icon: Flag,
      iconClassName: "size-10 text-muted-foreground",
      containerClassName: "bg-secondary",
    };
  }

  if (icon === "trophy") {
    return {
      icon: Trophy,
      iconClassName: "size-10 text-primary",
      containerClassName:
        accent === "primary"
          ? "bg-primary/12 border border-primary/20"
          : "bg-destructive/12 border border-destructive/20",
    };
  }

  return {
    icon: HeartCrack,
    iconClassName: "size-10 text-destructive",
    containerClassName: "bg-destructive/12 border border-destructive/20",
  };
};
