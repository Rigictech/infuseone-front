import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import DashboardLayout from "./components/DashboardLayout";
import UserManagement from "./pages/UserManagement";
import FormstackList from "./pages/FormstackList";
import WebsiteList from "./pages/WebsiteList";
import InfoManager from "./pages/InfoManager";
import UploadsList from "./pages/UploadsList";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import { UserProvider } from "./context/UserContext";


const RootRedirect = () => {
  debugger
  const role = localStorage.getItem('role');
  return role === 'Admin' ? <Navigate to="users-list" replace /> : <Navigate to="formstack-list" replace />;
};

const AdminRoute = ({ children }) => {
  const role = localStorage.getItem('role');
  return role === 'Admin' ? children : <NotFound />;
};

import { Toaster } from "react-hot-toast";

function App() {
  return (
    <UserProvider>
      <Toaster position="top-right" />
      <BrowserRouter
        basename={import.meta.env.PROD ? "/infuseone-ghost-page" : "/"}
      >
        <Routes>
          {/* Public */}
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Protected */}
          <Route path="/" element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route index element={<RootRedirect />} />
              <Route path="users-list" element={<AdminRoute><UserManagement /></AdminRoute>} />
              <Route path="formstack-list" element={<FormstackList />} />
              <Route path="website-list" element={<WebsiteList />} />
              <Route path="info" element={<InfoManager />} />
              <Route path="uploads" element={<UploadsList />} />
              <Route path="profile" element={<Profile />} />
            </Route>
          </Route>

          {/* Catch all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
