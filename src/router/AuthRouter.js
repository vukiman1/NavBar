import React, { useContext } from "react";
import { Route, Routes } from "react-router-dom";
import Register from "../pages/Register";
import Admin from "../Admin/Admin";
import { DataContext } from "../Context/DataContext";
import LoginPage from "../pages/Login";

const AuthRouter = () => {
  const authLogin = localStorage.getItem("auth");
  console.log(authLogin);
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      {authLogin && <Route path="*" element={<Admin />} />}
      <Route path="*" element={<LoginPage />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
};

export default AuthRouter;
