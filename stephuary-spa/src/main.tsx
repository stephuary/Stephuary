import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { PostActionMomentProvider } from "./context/PostActionMomentContext";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PostActionMomentProvider>
      <App />
    </PostActionMomentProvider>
  </StrictMode>,
);
