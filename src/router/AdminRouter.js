import React from "react";
import { Route, Routes } from "react-router-dom";
import Products from "../Admin/Body/Products";
import Users from "../Admin/Body/Users";
import NotFound from "../pages/NotFound";
import Home from "../pages/Home";
import EditUser from "../pages/EditUser";
import CreateUser from "../pages/CreateUser";

const AdminRouter = () => {
  return (
    <Routes>
      <Route path="/products" element={<Products />} />
      <Route path="/users" element={<Users />} />
      <Route path="/users/edit/:id" element={<EditUser />} />
      <Route path="/users/add" element={<CreateUser />} />
      {/* <Route path="/home" element={<Home />} /> */}
      <Route path="*" element={<NotFound />} />
      <Route path="/" element={<Home />} />
    </Routes>
  );
};

export default AdminRouter;
