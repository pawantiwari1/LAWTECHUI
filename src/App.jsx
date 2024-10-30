import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import AdminLayout from "layouts/admin";
import AuthLayout from "layouts/auth";
import LegalNoticeView from "views/admin/caseView/components/LegalNoticeView";
import { ToastContainer } from "react-toastify";
import PrivateRoute from "views/auth/private_route";

import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="auth/*" element={<AuthLayout />} />
        {/* <Route path="admin/*" element={<AdminLayout />} />   */}
        <Route path="admin/*" element={
          <PrivateRoute><AdminLayout /></PrivateRoute>
          } />

        {/* <Route path="/" element={<Navigate to="/admin" replace />} /> */}
        <Route path="/" element={<Navigate to="/auth" replace />} />
      </Routes>
      <ToastContainer />
    </>
  );
};

export default App;
