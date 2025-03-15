import { Button, Menu, Layout } from "antd";
import {
  MoonOutlined,
  SunOutlined,
  ShopOutlined,
  UserOutlined,
  PieChartOutlined,
  ReconciliationOutlined,
  BarsOutlined,
  SolutionOutlined,
  SettingOutlined
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
      children: [{ key: "11", label: <NavLink to="/">Trang chủ</NavLink> },
        { key: "111", label: <NavLink to="/notification">Thông báo</NavLink> }
      ],
    },
    {
      key: "2",
      icon: <UserOutlined />,
      label: <NavLink to="/users">Quản lý người dùng</NavLink>,
    },
    {
      key: "3",
      icon: <ShopOutlined />,
      label: <NavLink to="/company">Quản lý công ty</NavLink>,
    },
    {
      key: "4",
      icon: <ReconciliationOutlined />,
      label: <NavLink to="/job-post">Tin tuyển dụng</NavLink>,
    },
    {
      key: "44",
      icon: <BarsOutlined />,
      label: "Trang web",
      children: [
        { key: "441", label: <NavLink to="/banner">Quảng cáo</NavLink> },
        { key: "442", label: <NavLink to="/review">Đánh giá</NavLink> },
        { key: "443", label: <NavLink to="/revenue">Quản lý vị trí</NavLink> },
      ],
    },
    {
      key: "5",
      icon: <SolutionOutlined />,
      label: <NavLink to="/resume">Hồ sơ ứng viên</NavLink>,
    },
    {
      key: "6",
      icon: <SettingOutlined />,
      label: <NavLink to="/setting">Cài đặt hệ thống</NavLink>,
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
