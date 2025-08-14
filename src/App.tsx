import { Layout } from "@/layout/Layout.tsx";
import { Board } from "@/modules/board";

import "./App.css";

function App() {
  return (
    <div data-testid="app" className={"bg-background"}>
      <Layout />
      <div className={"px-16 py-8"}>
        <Board />
      </div>
    </div>
  );
}

export default App;
