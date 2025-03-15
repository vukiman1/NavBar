import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Products from "../Admin/Body/Products";
import Users from "../Admin/Body/Users";
import NotFound from "../pages/NotFound";
import Home from "../pages/Home";
import EditUser from "../pages/EditUser";
import CreateUser from "../pages/CreateUser";
import UserInfo from "../pages/UserInfo";
import EditProduct from "../pages/EditProduct";
import CreateProduct from "../pages/CreateProduct";
import JobPost from "../Admin/Body/JobPost";
import Company from "../Admin/Body/Company";
import Banner from "../Admin/Body/Banner";
// import Review from "../Admin/Body/Review";
// import Revenue from "../Admin/Body/Revenue";

const AdminRouter = () => {
  return (
    <Routes>
      {/* Product routes */}
      <Route path="/products" element={<Products />} />
      <Route path="/products/edit/:id" element={<EditProduct />} />
      <Route path="/products/add" element={<CreateProduct />} />

      {/* User routes */}
      <Route path="/users" element={<Users />} />
      <Route path="/users/edit/:id" element={<EditUser />} />
      <Route path="/users/add" element={<CreateUser />} />

      {/* JobPost routes */}
      <Route path="/job-post" element={<JobPost />} />
      {/* <Route path="/job-post/edit/:id" element={<EditJobPost />} /> */}
      {/* <Route path="/job-post/add" element={<CreateJobPost />} /> */}

      {/* Company routes */}
      <Route path="/company" element={<Company />} />

      {/* Banner routes */}
      <Route path="/banner" element={<Banner />} />

      {/* Review routes */}
      {/* <Route path="/review" element={<Review />} /> */}

      {/* Revenue routes */}
      {/* <Route path="/revenue" element={<Revenue />} /> */}

      {/* Conditional Route based on auth status */}
      {localStorage.getItem("auth") === "true" ? (
        <Route path="*" element={<NotFound />} />
      ) : (
        <Route path="*" element={<Navigate to="/login" />} />
      )}

      {/* Other routes */}
      <Route path="/" element={<Home />} />
      <Route path="/info" element={<UserInfo />} />
    </Routes>
  );
};

export default AdminRouter;
