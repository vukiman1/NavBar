import React from "react";
import SideBar from "./Admin/SideBar/SideBar";
import { Layout} from "antd";
import HeaderBar from "./Admin/Header/Header";
import AdminRouter from "./router/AdminRouter";
import BreadCrumb from "./Shared/BreadCrumb";

const { Content } = Layout;
const App = () => {
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
export default App;
