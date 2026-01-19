import { StrictMode } from "react";

import { createRoot } from "react-dom/client";

import { RouterProvider } from "@tanstack/react-router";

import "./styles/globals.css";

import { router } from "./router";

// biome-ignore lint/style/noNonNullAssertion: React self-generated file
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
