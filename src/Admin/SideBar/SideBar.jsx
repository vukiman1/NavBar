import { Button, Menu, Layout } from "antd";
import {
  MoonOutlined,
  SunOutlined,
  DropboxOutlined,
  UserOutlined,
  PieChartOutlined,
} from "@ant-design/icons";
import React, { useState } from "react";
const { Sider } = Layout;

const SideBar = ({ sendCurrentTheme }) => {
  const [collapsedWidth, setCollapsedWidth] = useState(0);
  const [currentTheme, setCurrentTheme] = useState("light");
  const [collapsed, setCollapsed] = useState(false);
  console.log(currentTheme);
  const items = [
    {
      key: "1",
      icon: <PieChartOutlined />,
      label: "Dashboard",
      children: [{ key: "11", label: "Option 1" }],
    },
    {
      key: "2",
      icon: <UserOutlined />,
      label: "Users",
    },
    {
      key: "3",
      icon: <DropboxOutlined />,
      label: "Products",
    },
  ];
  return (
    <div>
      <Sider
        trigger={null}
        theme={currentTheme}
        breakpoint="sm"
        collapsible
        collapsed={collapsed}
        collapsedWidth={collapsedWidth}
        onBreakpoint={(broken) => {
          setCollapsedWidth(broken ? 0 : 80);
          setCollapsed(broken);
        }}
        style={{
          position: "fixed",
          minHeight: "100vh",
          fontWeight: "500",
        }}
      >
        <div className="demo-logo-vertical">
          <h1
            style={{
              color: currentTheme === "dark" ? "#fff" : "#001529",
              textAlign: "center",
            }}
          >
            Logo
          </h1>
        </div>

        <Menu
          theme={currentTheme}
          mode="inline"
          defaultSelectedKeys={["1"]}
          items={items}
        />
        <div
          style={{
            position: "absolute",
            bottom: 10,
            textAlign: "center",
            width: "100%",
          }}
        >
          <Button
            icon={currentTheme === "light" ? <MoonOutlined /> : <SunOutlined />}
            onClick={() => {
              setCurrentTheme(currentTheme === "light" ? "dark" : "light");
              sendCurrentTheme(currentTheme === "light" ? "dark" : "light");
            }}
          ></Button>
        </div>
      </Sider>
      <Sider
        trigger={null}
        breakpoint="sm"
        theme={currentTheme}
        collapsible
        collapsed={collapsed}
        collapsedWidth={collapsedWidth}
        onBreakpoint={(broken) => {
          setCollapsedWidth(broken ? 0 : 80);
          setCollapsed(broken);
        }}
      ></Sider>
    </div>
  );
};

export default SideBar;
