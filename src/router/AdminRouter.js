import React from "react";
import { Route, Routes } from "react-router-dom";
import Products from "../Admin/Body/Products";
import Users from "../Admin/Body/Users";

const AdminRouter = () => {
  return (
    <Routes>
      <Route path="/products" element={<Products />} />
      <Route path="/users" element={<Users />} />
    </Routes>
  );
};

export default AdminRouter;
