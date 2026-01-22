import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";
import Login from "./pages/Login";
import DashboardLayout from "./components/DashboardLayout";
import UserManagement from "./pages/UserManagement";
import FormstackList from "./pages/FormstackList";
import WebsiteList from "./pages/WebsiteList";
import InfoManager from "./pages/InfoManager";
import UploadsList from "./pages/UploadsList";
import Profile from "./pages/Profile";
import { UserProvider } from "./context/UserContext";

function App() {
  return (
    <UserProvider>
      <BrowserRouter
        basename={import.meta.env.PROD ? "/infuseone-ghost-page" : "/"}
      >
        <Routes>
          {/* Public */}
          <Route path="/login" element={<Login />} />

          {/* Protected */}
          <Route path="/" element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route index element={<Navigate to="users-list" replace />} />
              <Route path="users-list" element={<UserManagement />} />
              <Route path="formstack-list" element={<FormstackList />} />
              <Route path="website-list" element={<WebsiteList />} />
              <Route path="info" element={<InfoManager />} />
              <Route path="uploads" element={<UploadsList />} />
              <Route path="profile" element={<Profile />} />
            </Route>
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
