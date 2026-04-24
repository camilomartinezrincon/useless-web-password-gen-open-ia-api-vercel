import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { PasswordFormGenApp } from "./PasswordFormGenApp";
import { HeaderApp } from "./HeaderApp";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HeaderApp />
    <PasswordFormGenApp />
  </StrictMode>,
);
