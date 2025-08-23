import { useState } from "react";

import { StorageKeys, StorageService } from "@/application/storage-service";
import { WelcomeModal } from "@/components/WelcomeModal";
import { ThemeProvider } from "@/context/ThemeProvider";
import { Layout } from "@/layout/Layout";
import { Board } from "@/modules/board";

import "./App.css";

function App() {
  const [isOpen, setIsOpen] = useState(() => {
    const stored = StorageService.get(StorageKeys.USER_SETTINGS);
    return !stored;
  });

  return (
    <ThemeProvider>
      <div data-testid="app" className={"bg-background"}>
        <Layout />
        <WelcomeModal isOpen={isOpen} startGame={() => setIsOpen(false)} />
        <div className={"px-16 py-8"}>
          {!isOpen ? (
            <Board />
          ) : (
            <div
              className="flex h-[calc(100dvh-8rem)] w-full flex-col justify-start gap-12"
              data-testid={"Board"}
            />
          )}
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
