import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/authContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Navbar    from "./components/Navbar";
import Login     from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Services  from "./pages/Services";
import Alerts    from "./pages/Alerts";

// Layout wrapper â€” renders Navbar above all protected pages
function AppLayout() {
  return (
    <>
      <Navbar />
      <ProtectedRoute />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<Login />} />

          {/* Protected â€” all children require a valid token */}
          <Route element={<AppLayout />}>
            <Route path="/"         element={<Dashboard />} />
            <Route path="/services" element={<Services />} />
            <Route path="/alerts"   element={<Alerts />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
