import { H1, P, Small } from "@/ui/web/components/Typography";
import { AvatarOptions } from "@/ui/web/modules/login/components/AvatarOptions";
import { LoginForm } from "@/ui/web/modules/login/components/LoginForm";

export const LoginScreen = () => {
  return (
    <div className="min-h-screen bg-background bg-[radial-gradient(50%_45%_at_15%_0%,color-mix(in_oklch,var(--color-primary)_18%,transparent)_0%,transparent_70%)] px-6 py-12 text-foreground md:px-10 md:py-16">
      <div className="mx-auto flex min-h-[calc(100vh-6rem)] w-full max-w-md flex-col gap-8 md:min-h-[calc(100vh-8rem)] md:max-w-2xl md:gap-10">
        <div className="space-y-4">
          <div className="h-1 w-12 rounded-full bg-primary" />
          <H1 className="text-5xl font-extrabold uppercase leading-none tracking-tight md:text-6xl">
            NEW
            <br />
            GAME
          </H1>
          <P className="text-base text-muted-foreground">
            Enter the arena. Choose your identity.
          </P>
        </div>

        <LoginForm>
          <div className="space-y-4 md:space-y-5">
            <div className="flex items-center justify-between">
              <Small className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/90">
                Select avatar
              </Small>
              <Small className="text-xs uppercase tracking-[0.2em] text-muted-foreground/70">
                Scroll for more
              </Small>
            </div>
            <AvatarOptions />
          </div>
        </LoginForm>
      </div>
    </div>
  );
};
