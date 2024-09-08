import React from "react";
import { Button, Checkbox, Col, Flex, Form, Input, Row } from "antd";
import { UserOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";
import backgroundImg from "../Assets/images/img.jpg";
import { Link } from "react-router-dom";
const Register = () => {
  const onFinish = (values) => {
    console.log("Received values of form: ", values);
  };

  return (
    <div
      style={{
        backgroundImage: `url(${backgroundImg})`, // Sử dụng `url()` cho ảnh nền
        backgroundSize: "cover", // Đảm bảo ảnh nền phủ kín khu vực
        height: "100vh", // Cài đặt chiều cao toàn màn hình
      }}
    >
      <Row justify="center">
        <Col
          xl={8}
          lg={8}
          md={12}
          sm={12}
          xs={18}
          style={{
            background: "transparent",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, .2)",
            marginTop: "12%",
            borderRadius: "10px",

            boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Row justify="center">
            <Col>
              <h1 style={{ color: "white", marginBottom: 0 }}>
                Đăng ký tài khoản mới
              </h1>
              <p style={{ color: "white", margin: "3px 0 20px" }}>
                Vui lòng nhập thông tin của bạn!
              </p>
            </Col>
          </Row>
          <Row justify="center">
            <Form
              name="login"
              initialValues={{
                remember: true,
              }}
              style={{
                maxWidth: 360,
              }}
              onFinish={onFinish}
            >
              <Form.Item
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Xin hãy nhập tên!",
                  },
                ]}
              >
                <Input prefix={<UserOutlined />} placeholder="Tên người dùng" />
              </Form.Item>
              <Form.Item
                name="email"
                rules={[
                  {
                    required: true,
                    message: "Xin hãy nhập email!",
                  },
                ]}
              >
                <Input prefix={<MailOutlined />} placeholder="Email" />
              </Form.Item>
              <Form.Item
                name="passWord"
                rules={[
                  {
                    required: true,
                    message: "Xin hãy nhập mật khẩu!",
                  },
                ]}
              >
                <Input
                  prefix={<LockOutlined />}
                  type="password"
                  placeholder="Mật khẩu"
                />
              </Form.Item>

              <Form.Item justify="center">
                <Button
                  block
                  htmlType="submit"
                  style={{ marginBottom: "10px" }}
                >
                  <b>Đăng ký</b>
                </Button>
                <span style={{ color: "white" }}>Đã có tài khoản?</span>{" "}
                <Link to="/login">
                  {" "}
                  <b style={{ color: "white" }}>Đăng nhâp ngay!</b>
                </Link>
              </Form.Item>
            </Form>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default Register;
