import { Layout } from "@/layout/Layout.tsx";

import "./App.css";

function App() {
  return (
    <div data-testid="app">
      <Layout />
      <div className={"px-16 py-8"}>
        <h1>Hello World!</h1>
        <p>This is a simple React component.</p>
      </div>
    </div>
  );
}

export default App;
