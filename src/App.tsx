import { ThemeProvider } from "@/context/ThemeProvider";
import { Layout } from "@/layout/Layout";
import { Board } from "@/modules/board";

import "./App.css";

function App() {
  return (
    <ThemeProvider>
      <div data-testid="app" className={"bg-background"}>
        <Layout />
        <div className={"px-16 py-8"}>
          <Board />
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
