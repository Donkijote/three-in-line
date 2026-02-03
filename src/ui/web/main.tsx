import { StrictMode } from "react";

import { createRoot } from "react-dom/client";

import { RouterProvider } from "@tanstack/react-router";

import "@/ui/web/styles/globals.css";

import { ConvexProvider } from "@/ui/web/application/providers/ConvexProvider";
import { router } from "@/ui/web/router";

// biome-ignore lint/style/noNonNullAssertion: React self-generated file
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ConvexProvider>
      <RouterProvider router={router} />
    </ConvexProvider>
  </StrictMode>,
);
