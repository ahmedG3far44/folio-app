import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { UserProvider } from "./contexts/UserProvider.tsx";
import { AuthProvider } from "./contexts/AuthProvider.tsx";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import UploadProvider from "./contexts/UploadProvider.tsx";
import App from "./App.tsx";
import "./index.css";
import ThemeProvider from "./contexts/ThemeProvider.tsx";
import LayoutProvider from "./contexts/LayoutProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <UserProvider>
            <UploadProvider>
              <LayoutProvider>
                <Toaster position="top-right" />
                <App />
              </LayoutProvider>
            </UploadProvider>
          </UserProvider>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
