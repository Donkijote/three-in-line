import type { ComponentType } from "react";

import { useConvexAuth } from "convex/react";
import { Gamepad2, Home, Settings } from "lucide-react";

import { Link, useRouterState } from "@tanstack/react-router";

import { cn } from "@/ui/web/lib/utils";

type NavItem = {
  label: string;
  icon: ComponentType<{ className?: string }>;
  to: string;
};

const navItems: NavItem[] = [
  { label: "Home", icon: Home, to: "/" },
  { label: "Play", icon: Gamepad2, to: "/play" },
  { label: "Settings", icon: Settings, to: "/settings" },
];

export const NavBar = () => {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });

  if (isLoading || !isAuthenticated || pathname === "/match") return null;

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-4 z-40 flex justify-center px-4"
    >
      <div className="flex w-full max-w-xs md:max-w-md items-center justify-between rounded-full border border-border/60 bg-card/80 px-4 py-2 shadow-[0_18px_50px_-35px_rgba(0,0,0,0.7)] backdrop-blur-xs">
        {navItems.map((item) => {
          const isActive = item.to ? pathname === item.to : false;
          const Icon = item.icon;
          const content = (
            <span className="flex flex-col items-center gap-0">
              <span
                className={cn("grid size-9 place-items-center", {
                  "text-primary": isActive,
                  "text-muted-foreground": !isActive,
                })}
              >
                <Icon className="size-5" />
              </span>
              <span
                className={cn(
                  "text-[10px] font-semibold uppercase tracking-[0.2em]",
                  {
                    "text-primary": isActive,
                    "text-muted-foreground": !isActive,
                  },
                )}
              >
                {item.label}
              </span>
            </span>
          );

          return (
            <Link
              key={item.label}
              to={item.to}
              className="flex flex-1 justify-center"
            >
              {content}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
