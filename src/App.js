import React, { useContext } from "react";
import SideBar from "./Admin/SideBar/SideBar";
import { Layout, Breadcrumb } from "antd";
import HeaderBar from "./Admin/Header/Header";
import AdminRouter from "./router/AdminRouter";
import { DataContext } from "./Context/DataContext";
import { NavLink } from "react-router-dom";

const { Content } = Layout;
const App = () => {
  const { breadcrumb } = useContext(DataContext);
  return (
    <Layout
      style={{
        minHeight: "100vh",
      }}
    >
      <SideBar />
      <Layout>
        <HeaderBar />
        <Breadcrumb
          style={{
            margin: "6px 0 0 16px",
          }}
        >
          
          <Breadcrumb.Item>
            <NavLink to="/">Home</NavLink>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            {breadcrumb === "Tài khoản" ? (
              <NavLink to="/users">Tài khoản</NavLink>
            ) : breadcrumb === "Sản phẩm" ? (
              <NavLink to="/products">Sản phẩm</NavLink>
            ) : (
              ""
            )}
          </Breadcrumb.Item>
        </Breadcrumb>
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
export default App;
