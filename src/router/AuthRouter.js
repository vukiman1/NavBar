import React, { useContext, useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Register from "../pages/Register";
import Admin from "../Admin/Admin";
import { DataContext } from "../Context/DataContext";
import LoginPage from "../pages/Login";

const AuthRouter = () => {
  const navigate = useNavigate();
  const { isLogin } = useContext(DataContext);

  useEffect(() => {
    if (!isLogin) {
      navigate("/login");
    }
  }, [isLogin, navigate]);

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<Admin />} />
    </Routes>
  );
};

export default AuthRouter;
