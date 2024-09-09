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
  function getObjectFromLocalStorage(key) {
    // Lấy chuỗi JSON từ localStorage theo key
    const storedData = localStorage.getItem(key);

    // Kiểm tra nếu dữ liệu không tồn tại trong localStorage
    if (!storedData) {
      return null;
    }

    // Chuyển chuỗi JSON thành đối tượng
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
              Xin chào <b>{user.name}</b>{" "}
            </Text>
            <Badge count={1}>
              <Avatar shape="square" src={user.avatar} />
            </Badge>
          </div>
        </Dropdown>
      </Header>
    </div>
  );
};

export default HeaderBar;
