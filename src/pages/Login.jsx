import React, { useContext, useState } from "react";
import {
  Alert,
  Button,
  Checkbox,
  Col,
  Flex,
  Form,
  Input,
  message,
  Row,
} from "antd";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import backgroundImg from "../Assets/images/img.jpg";
import { Link, useNavigate } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import { BASE_URL } from "../Config/config";
import { DataContext } from "../Context/DataContext";
const Login = () => {
  const navigate = useNavigate();
  const { data: user } = useFetch(`${BASE_URL}/users`);
  const [checkErr, setCheckErr] = useState(false);
  const { setIsLogin } = useContext(DataContext);

  const onFinish = (values) => {
    console.log("Received values of form: ", values);

    user.forEach((user) => {
      console.log(user);
      if (
        user.email === values.email &&
        user.passWord === values.passWord &&
        user.status === "active"
      ) {
        localStorage.setItem("user", JSON.stringify(user));
        setCheckErr(false);
        setIsLogin(true);
        message.success("Đăng nhập thành công").then(() => {
          navigate("/");
        });
      }
    });
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
                Chào mừng trở lại!
              </h1>
              <p style={{ color: "white", margin: "3px 0 20px" }}>
                Đăng nhập vào trang quản lý
              </p>
              {checkErr && (
                <Alert
                  message="Sai email hoặc mật khẩu, vui lòng nhập lại!"
                  type="error"
                  style={{ marginBottom: "10px" }}
                  showIcon
                />
              )}
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
              <Form.Item>
                <Flex justify="space-between" align="center">
                  <Form.Item name="remember" valuePropName="checked" noStyle>
                    <Checkbox style={{ color: "white" }}>Ghi nhớ</Checkbox>
                  </Form.Item>
                  <a href="/">
                    <b style={{ color: "white" }}>Quên mật khẩu?</b>
                  </a>
                </Flex>
              </Form.Item>

              <Form.Item justify="center">
                <Button
                  block
                  htmlType="submit"
                  style={{ marginBottom: "10px" }}
                >
                  <b>Đăng nhập</b>
                </Button>
                <span style={{ color: "white" }}>Chưa có tài khoản?</span>{" "}
                <Link to="/register">
                  {" "}
                  <Button
                    type="link"
                    onClick={() => {
                      navigate("/register");
                    }}
                  >
                    <b style={{ color: "white" }}>Đăng ký ngay!</b>
                  </Button>
                </Link>
              </Form.Item>
            </Form>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default Login;
