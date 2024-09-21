import React from "react";
import SideBar from "./SideBar/SideBar";
import HeaderBar from "./Header/Header";
import BreadCrumb from "../Shared/BreadCrumb";
import AdminRouter from "../router/AdminRouter";
import { Layout } from "antd";
import { useNavigate } from "react-router-dom";

const { Content } = Layout;

const Admin = () => {
  const navigate = useNavigate();
  if (localStorage.getItem("auth") !== "true") {
    navigate("/login");
  }
  return (
    <Layout
      style={{
        minHeight: "100vh",
      }}
    >
      <SideBar />
      <Layout>
        <HeaderBar />
        <BreadCrumb />
        <Content
          style={{
            margin: "10px 16px",
            padding: "0 48px",
            minHeight: 280,
          }}
        >
          <AdminRouter />
        </Content>
      </Layout>
    </Layout>
  );
};

export default Admin;
