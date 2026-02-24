import { ArrowRight, Pencil } from "lucide-react-native";
import { ActivityIndicator, View } from "react-native";

import { getRandomPresetAvatarId } from "@/domain/entities/Avatar";
import { Small } from "@/ui/mobile/components/Typography";
import { Button } from "@/ui/mobile/components/ui/button";
import { Icon } from "@/ui/mobile/components/ui/icon";
import { Input } from "@/ui/mobile/components/ui/input";
import { Text } from "@/ui/mobile/components/ui/text";
import { Visibility } from "@/ui/mobile/layout/components/Visibility";
import { toUserAvatar } from "@/ui/shared/avatars/presets";
import { useLoginFlow } from "@/ui/shared/login/useLoginFlow";
import {
  resolveLoginSubmitState,
  validateAvatar,
  validateEmail,
  validatePassword,
} from "@/ui/shared/login/validators";

import { AvatarOptions } from "./AvatarOptions";
import { LoginErrorAlert } from "./LoginErrorAlert";

export const LoginForm = () => {
  const {
    authError,
    doesEmailExist,
    form,
    isEmailCheckPending,
    isChecking,
    isSignUp,
    onEmailChanged,
    setAuthError,
  } = useLoginFlow();

  return (
    <View className="flex-1 gap-8">
      <View className="gap-5">
        <View className="gap-2">
          <Small variant="label" className="text-primary/90">
            Email
          </Small>
          <form.Field
            name="email"
            validators={{
              onChange: ({ value }) => validateEmail(value),
            }}
          >
            {(field) => (
              <View className="relative">
                <Input
                  placeholder="you@example.com"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  textContentType="emailAddress"
                  autoComplete="email"
                  value={field.state.value}
                  onChangeText={(nextValue) => {
                    field.handleChange(nextValue);
                    onEmailChanged(nextValue);
                  }}
                  onBlur={field.handleBlur}
                  className="h-14 bg-card pr-12 text-foreground placeholder:text-muted-foreground/70"
                />
                <View
                  className="absolute right-2 top-2 h-10 w-10 items-center justify-center rounded-full bg-primary/15"
                  accessibilityElementsHidden
                  importantForAccessibility="no"
                >
                  <Visibility visible={isChecking}>
                    <ActivityIndicator size="small" color="hsl(158 76% 40%)" />
                  </Visibility>
                  <Visibility visible={!isChecking}>
                    <Icon as={Pencil} size={16} className="text-primary" />
                  </Visibility>
                </View>
              </View>
            )}
          </form.Field>
        </View>

        <Visibility visible={doesEmailExist !== null}>
          <View className="gap-2">
            <Small variant="label" className="text-primary/90">
              Password
            </Small>
            <form.Field
              name="password"
              validators={{
                onChange: ({ value }) => validatePassword(value),
              }}
            >
              {(field) => (
                <Input
                  placeholder="Enter password"
                  secureTextEntry
                  autoCapitalize="none"
                  autoCorrect={false}
                  spellCheck={false}
                  textContentType="password"
                  autoComplete="password"
                  value={field.state.value}
                  onChangeText={field.handleChange}
                  onBlur={field.handleBlur}
                  className="h-14 bg-card text-foreground placeholder:text-muted-foreground/70"
                />
              )}
            </form.Field>
          </View>
        </Visibility>

        <form.Field
          name="avatar"
          defaultValue={{
            type: "preset",
            value: getRandomPresetAvatarId(),
          }}
          validators={{
            onChange: ({ value }) => validateAvatar(value),
          }}
        >
          {(field) => (
            <Visibility visible={isSignUp}>
              <View className="pt-3">
                <AvatarOptions
                  onChange={(avatar) => {
                    field.handleChange(toUserAvatar(avatar));
                  }}
                />
              </View>
            </Visibility>
          )}
        </form.Field>

      </View>

      <form.Subscribe
        selector={(state) => ({
          values: state.values,
          canSubmit: state.canSubmit,
          isSubmitting: state.isSubmitting,
        })}
      >
        {({ values, canSubmit, isSubmitting }) => {
          const { isDisabled } = resolveLoginSubmitState({
            values,
            canSubmit,
            isSubmitting,
            isChecking,
            doesEmailExist,
            isEmailCheckPending: isEmailCheckPending(values.email),
          });

          return (
            <Button
              size="lg"
              disabled={isDisabled}
              onPress={form.handleSubmit}
              className="mt-auto h-12 rounded-full bg-primary active:bg-primary/90"
            >
              <View className="flex-row items-center gap-2">
                <Text className="font-semibold text-primary-foreground uppercase tracking-[1.2px]">
                  {isSignUp ? "Sign up" : "START GAME"}
                </Text>
                <Icon
                  as={ArrowRight}
                  size={16}
                  className="text-primary-foreground"
                />
              </View>
            </Button>
          );
        }}
      </form.Subscribe>

      <LoginErrorAlert error={authError} onClose={() => setAuthError(null)} />
    </View>
  );
};
