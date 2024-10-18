import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { EvoluProvider } from "@evolu/react";
import { evolu } from "./evoluSetup";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <EvoluProvider value={evolu}>
      <App />
    </EvoluProvider>
  </StrictMode>
);
