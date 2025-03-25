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
import Feedback from "../Admin/Body/Feedback";
import Location from '../Admin/Body/Location';
import District from "../Admin/Body/District";
import JobCategories from "../Admin/Body/JobCategories";
import JobseekerList from "../Admin/Body/JobseekerList";
import Setting from "../Admin/Body/Setting";
import Notification from "../Admin/Body/Notification";

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

      {/* Notification routes */}
      <Route path="/notification" element={<Notification />} />

      {/* Banner routes */}
      <Route path="/banner" element={<Banner />} />

      {/* Review routes */}
      <Route path="/feedback" element={<Feedback />} />

      {/* Revenue routes */}
      {/* <Route path="/revenue" element={<Revenue />} /> */}

      {/* City management routes */}
      <Route path="/cities" element={<Location />} />
      <Route path="/cities/:cityId" element={<District />} />

      {/* JobCategories routes */}
      <Route path="/job-categories" element={<JobCategories />} />

      {/* Jobseeker routes */}
      <Route path="/jobseekers" element={<JobseekerList />} />

      {/* Conditional Route based on auth status */}
      {localStorage.getItem("auth") === "true" ? (
        <Route path="*" element={<NotFound />} />
      ) : (
        <Route path="*" element={<Navigate to="/login" />} />
      )}

      {/* Setting routes */}
      <Route path="/setting" element={<Setting />} />

      {/* Other routes */}
      <Route path="/" element={<Home />} />
      <Route path="/info" element={<UserInfo />} />
    </Routes>
  );
};

export default AdminRouter;
