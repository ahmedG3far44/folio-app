import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { UserProvider } from "./contexts/UserProvider.tsx";
import { AuthProvider } from "./contexts/AuthProvider.tsx";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import ThemeProvider from "./contexts/ThemeProvider.tsx";

import App from "./App.tsx";
import "./index.css";
import AdminProvider from "./contexts/AdminProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <UserProvider>
            <AdminProvider>
              <Toaster position="top-right" />
              <App />
            </AdminProvider>
          </UserProvider>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
