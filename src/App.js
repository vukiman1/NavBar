import React, { useContext } from "react";
import SideBar from "./Admin/SideBar/SideBar";
import { Layout, Breadcrumb } from "antd";
import HeaderBar from "./Admin/Header/Header";
import AdminRouter from "./router/AdminRouter";
import { DataContext } from "./Context/DataContext";

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
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item>{breadcrumb}</Breadcrumb.Item>
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
