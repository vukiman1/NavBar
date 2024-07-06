import React, { useState } from "react";
import SideBar from "./Admin/SideBar/SideBar";
import { Layout, theme, Breadcrumb } from "antd";
import HeaderBar from "./Admin/Header/Header";
const { Content } = Layout;
const App = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [currentTheme, setCurrentTheme] = useState("light");

  const handleTheme = (theme) => {
    console.log(theme);
    setCurrentTheme(theme);
  };
  return (
    <Layout
      style={{
        minHeight: "100vh",
      }}
    >
      <SideBar sendCurrentTheme={handleTheme} />
      <Layout>
        <HeaderBar currentTheme={currentTheme} />
        <Breadcrumb
          style={{
            margin: "6px 0 0 16px",
          }}
        >
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item>List</Breadcrumb.Item>
          <Breadcrumb.Item>App</Breadcrumb.Item>
        </Breadcrumb>
        <Content
          style={{
            margin: "10px 16px",
            padding: "0 48px",
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          Content
          {
            // indicates very long content
            Array.from(
              {
                length: 100,
              },
              (_, index) => (
                <React.Fragment key={index}>
                  {index % 20 === 0 && index ? "more" : "..."}
                  <br />
                </React.Fragment>
              )
            )
          }
        </Content>
      </Layout>
    </Layout>
  );
};
export default App;
