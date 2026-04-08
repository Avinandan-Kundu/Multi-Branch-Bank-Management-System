import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";

/**
 * Application Entry Point
 *
 * This file initializes the React application and mounts it to the DOM.
 * It sets up the necessary providers and renders the root App component.
 *
 * Key components:
 * - React.StrictMode: Enables additional checks and warnings in development
 * - BrowserRouter: Provides routing context for the entire app using HTML5 history API
 * - App: The main application component with all routes
 *
 * The app is mounted to the DOM element with id="root" (defined in index.html).
 *
 * For backend integration: This setup remains the same, but API calls would be made
 * to backend endpoints instead of localStorage. Consider adding providers for
 * authentication context, API clients, or state management (Redux, Zustand, etc.).
 */
const container = document.getElementById("root");
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
