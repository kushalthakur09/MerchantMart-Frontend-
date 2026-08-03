import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ThemeProvider } from "./components/ui/theme-provider";
import { RecoilRoot } from "recoil";
import AuthInitializer from "./components/auth/AuthInitializer";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RecoilRoot>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <AuthInitializer>
          <App />
        </AuthInitializer>
      </ThemeProvider>
    </RecoilRoot>
  </StrictMode>,
);
