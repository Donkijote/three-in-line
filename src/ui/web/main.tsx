import { StrictMode } from "react";

import { createRoot } from "react-dom/client";

import "./styles/globals.css";

import App from "./App.tsx";

// biome-ignore lint/style/noNonNullAssertion: React self-generated file
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
