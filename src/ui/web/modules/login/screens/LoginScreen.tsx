import { H1, P } from "@/ui/web/components/Typography";
import { LoginForm } from "@/ui/web/modules/login/components/LoginForm";

export const LoginScreen = () => {
  return (
    <div className="min-h-svh max-w-[calc(100svw-2rem)] lg:min-h-screen dark:bg-background bg-[radial-gradient(50%_45%_at_15%_0%,color-mix(in_oklch,var(--color-primary)_18%,transparent)_0%,transparent_70%)] px-6 pt-12 pb-[calc(0.25rem+env(safe-area-inset-bottom))] text-foreground md:px-10 md:pt-16 md:pb-16">
      <div className="mx-auto flex w-full flex-col gap-8 min-h-[calc(100svh-4rem)] md:min-h-[calc(100svh-8rem)] max-w-2xl md:gap-10">
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

        <LoginForm />
      </div>
    </div>
  );
};
