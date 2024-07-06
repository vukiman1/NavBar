import React, { useState } from "react";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Button, Badge, Avatar, Typography, Layout } from "antd";

const { Text } = Typography;
const { Header } = Layout;

const HeaderBar = (currentTheme) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div>
      <Header
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: currentTheme === "light" ? "#fff" : "#001529",
        }}
      >
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(!collapsed)}
          style={{
            fontSize: "16px",
            color: currentTheme === "dark" ? "#fff" : "#001529",
            width: 64,
            height: 64,
          }}
        />
        <div>
          <Text
            strong
            style={{
              color: currentTheme === "dark" ? "#fff" : "#001529",
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
      </Header>
    </div>
  );
};

export default HeaderBar;
