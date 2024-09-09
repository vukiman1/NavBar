import { Button, Menu, Layout } from "antd";
import {
  MoonOutlined,
  SunOutlined,
  DropboxOutlined,
  UserOutlined,
  PieChartOutlined,
  ReconciliationOutlined,
} from "@ant-design/icons";
import React, { useContext, useState } from "react";
import { DataContext } from "../../Context/DataContext";
import { NavLink } from "react-router-dom";
const { Sider } = Layout;

const SideBar = () => {
  const [collapsedWidth, setCollapsedWidth] = useState(0);
  const { currentTheme, setCurrentTheme, themeStyle, collapsed, setCollapsed } =
    useContext(DataContext);

  const items = [
    {
      key: "1",
      icon: <PieChartOutlined />,
      label: "Dashboard",
      children: [{ key: "11", label: <NavLink to="/">Home</NavLink> }],
    },
    {
      key: "2",
      icon: <UserOutlined />,
      label: <NavLink to="/users">Tài khoản</NavLink>,
    },
    {
      key: "3",
      icon: <DropboxOutlined />,
      label: <NavLink to="/products">Sản phẩm</NavLink>,
    },
    {
      key: "4",
      icon: <ReconciliationOutlined />,
      label: <NavLink to="/revenue">Đơn hàng</NavLink>,
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
              ...themeStyle,
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
