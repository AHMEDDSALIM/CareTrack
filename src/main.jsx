import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { AuthProvider } from "./store/authContext.jsx";

import { PatientsProvider } from "./store/patientsContext.jsx";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <PatientsProvider>
        <App />
      </PatientsProvider>
    </AuthProvider>
  </StrictMode>
);
