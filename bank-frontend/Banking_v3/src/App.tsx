import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import AdminLogin from "./components/AdminLogin";
import AdminSignup from "./components/AdminSignup";
import CustomerDashboard from "./components/CustomerDashboard";
import AdminDashboard from "./components/AdminDashboard";
import AccountInformation from "./components/AccountInformation";
import GlobalPreferencesBar from "./components/GlobalPreferencesBar";
import "./App.css";

/**
 * Main App Component
 *
 * This is the root component of the React application. It defines the routing structure
 * using React Router. The app handles user authentication and role-based navigation
 * between different dashboards.
 *
 * Routes:
 * - "/" : Home page - Landing page with navigation to login/signup
 * - "/login" : Login page - Authenticates users (admin or customer)
 * - "/signup" : Signup page - Allows new customers to create accounts
 * - "/customer" : Customer dashboard - Main interface for customer banking operations
 * - "/admin" : Admin dashboard - Interface for bank administrators to manage branches
 *
 * Note: Authentication state is managed via localStorage. In a full-stack app,
 * this would be replaced with proper session management and API authentication.
 * Backend integration: Routes would need to be protected with authentication middleware.
 */
import { AppPreferencesProvider } from "./contexts/AppPreferencesContext";

const AppRoutes: React.FC = () => {
  const location = useLocation();
  const showGlobalPreferences = location.pathname !== "/";
  const isAuthRoute = ["/login", "/signup", "/admin/login", "/admin/signup"].includes(location.pathname);

  return (
    <div className="app-shell">
      {showGlobalPreferences && <GlobalPreferencesBar />}
      <main className={`route-frame ${showGlobalPreferences ? "with-topbar" : ""} ${isAuthRoute ? "auth-route-frame" : ""}`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/signup" element={<AdminSignup />} />
          <Route path="/customer" element={<CustomerDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/account" element={<AccountInformation />} />
        </Routes>
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AppPreferencesProvider>
      <AppRoutes />
    </AppPreferencesProvider>
  );
};

export default App;
