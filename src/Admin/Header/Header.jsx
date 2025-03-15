import React, { useContext } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SolutionOutlined,
  LogoutOutlined,
  BellOutlined,
} from "@ant-design/icons";
import { Button, Badge, Avatar, Typography, Layout, Dropdown, Space } from "antd";
import { DataContext } from "../../Context/DataContext";
import "./Header.css";
import { Link } from "react-router-dom";
const { Text } = Typography;
const { Header } = Layout;

const HeaderBar = () => {
  const { collapsed, setCollapsed, themeStyle } = useContext(DataContext);
  function getObjectFromLocalStorage(key) {
    const storedData = localStorage.getItem(key);
    if (!storedData) {
      return null;
    }
    try {
      return JSON.parse(storedData);
    } catch (error) {
      console.error("Error parsing JSON from localStorage:", error);
      return null;
    }
  }
  const user = getObjectFromLocalStorage("user");
  const items = [
    {
      key: "1",
      label: (
        <Link to="/info">
          <SolutionOutlined style={{ marginRight: "8px" }} />
          Thông tin cá nhân
        </Link>
      ),
    },
    {
      key: "4",
      danger: true,
      label: (
        <Link to="/login">
          <LogoutOutlined style={{ marginRight: "8px" }} />
          Đăng xuất
        </Link>
      ),
    },
  ];

  return (
    <Header
      className="Header_Container"
      style={{
        ...themeStyle,
        padding: "0 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(!collapsed)}
          style={{
            ...themeStyle,
            fontSize: "18px",
            width: 48,
            height: 48,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginRight: "24px",
          }}
        />
        <Text
          strong
          style={{
            fontSize: "20px",
            ...themeStyle,
          }}
        >
          Dashboard
        </Text>
      </div>

      <Space size={24}>
        <Badge count={3} size="small">
          <Button
            type="text"
            icon={<BellOutlined style={{ fontSize: "20px" }} />}
            style={{
              ...themeStyle,
              width: 40,
              height: 40,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          />
        </Badge>

        <Dropdown
          menu={{
            items,
          }}
          placement="bottomRight"
        >
          <div style={{ cursor: "pointer", display: "flex", alignItems: "center" }}>
            <Text
              strong
              style={{
                marginRight: "12px",
                fontSize: "14px",
                ...themeStyle,
              }}
            >
              {user?.name && `Xin chào ${user.name}`}
            </Text>
            <Avatar 
              size={40}
              src={user?.avatar}
              style={{ 
                backgroundColor: "#1890ff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {user?.name ? user.name[0].toUpperCase() : "U"}
            </Avatar>
          </div>
        </Dropdown>
      </Space>
    </Header>
  );
};

export default HeaderBar;
