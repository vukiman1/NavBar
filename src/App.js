import React, { useState } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DropboxOutlined,
  UserOutlined,
  MoonOutlined,
  SunOutlined,
  PieChartOutlined,
} from "@ant-design/icons";
import {
  Button,
  Layout,
  Menu,
  theme,
  Breadcrumb,
  Badge,
  Avatar,
  Typography,
} from "antd";
const { Text } = Typography;

const { Header, Sider, Content } = Layout;
const App = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [currentTheme, setCurrentTheme] = useState("light");
  const [collapsedWidth, setCollapsedWidth] = useState(0);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

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
    <Layout
      style={{
        minHeight: "100vh",
      }}
    >
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
              icon={
                currentTheme === "light" ? <MoonOutlined /> : <SunOutlined />
              }
              onClick={() =>
                setCurrentTheme(currentTheme === "light" ? "dark" : "light")
              }
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

      <Layout>
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
              <Text strong>
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
