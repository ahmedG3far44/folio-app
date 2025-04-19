import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { UserProvider } from "./contexts/UserProvider.tsx";
import UploadProvider from "./contexts/UploadProvider.tsx";
import { AuthProvider } from "./contexts/AuthProvider.tsx";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <UserProvider>
          <UploadProvider>
            <App />
          </UploadProvider>
        </UserProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
