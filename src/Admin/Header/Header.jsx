import React, { useContext } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SolutionOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Button, Badge, Avatar, Typography, Layout, Dropdown } from "antd";
import { DataContext } from "../../Context/DataContext";
import "./Header.css";
import { Link } from "react-router-dom";
const { Text } = Typography;
const { Header } = Layout;

const HeaderBar = () => {
  const { collapsed, setCollapsed, themeStyle } = useContext(DataContext);

  const items = [
    {
      key: "1",
      label: (
        <Link to="/info">
          <SolutionOutlined style={{ marginRight: "5px" }} />
          Thông tin cá nhân
        </Link>
      ),
    },
    {
      key: "4",
      danger: true,
      label: (
        <Link to="/login">
          <LogoutOutlined style={{ marginRight: "5px" }} />
          Đăng xuất
        </Link>
      ),
    },
  ];

  return (
    <div>
      <Header
        className="Header_Container"
        style={{
          ...themeStyle,
        }}
      >
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(!collapsed)}
          style={{
            ...themeStyle,
            fontSize: "16px",
            width: 64,
            height: 64,
          }}
        />

        <Dropdown
          menu={{
            items,
          }}
        >
          <div style={{ cursor: "pointer" }}>
            <Text
              strong
              style={{
                ...themeStyle,
              }}
            >
              Xin chào <b>Kim An!</b>{" "}
            </Text>
            <Badge count={1}>
              <Avatar
                shape="square"
                src="https://img.freepik.com/free-psd/3d-illustration-human-avatar-profile_23-2150671142.jpg?size=338&ext=jpg&ga=GA1.1.1413502914.1720105200&semt=sph"
              />
            </Badge>
          </div>
        </Dropdown>
      </Header>
    </div>
  );
};

export default HeaderBar;
