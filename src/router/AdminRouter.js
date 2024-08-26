import React from "react";
import { Route, Routes } from "react-router-dom";
import Products from "../Admin/Body/Products";
import Users from "../Admin/Body/Users";
import NotFound from "../pages/NotFound";
import Home from "../pages/Home";

const AdminRouter = () => {
  return (
    <Routes>
      <Route path="/products" element={<Products />} />
      <Route path="/users" element={<Users />} />
      <Route path="/home" element={<Home />} />
      <Route path="*" element={<NotFound />} />
      <Route path="/" element={<Home />} />
    </Routes>
  );
};

export default AdminRouter;
