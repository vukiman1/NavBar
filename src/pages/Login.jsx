"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Form, Input, Button, Checkbox, Typography, message, Spin, Divider, Alert } from "antd"
import { UserOutlined, LockOutlined, LoginOutlined, EyeInvisibleOutlined, EyeTwoTone, CopyOutlined } from "@ant-design/icons"
import userService from "../services/userService"
import "./css/login.css"

const { Title, Text} = Typography

const Login = () => {
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [rememberMe, setRememberMe] = useState(true)

  // Check if user is already logged in
  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      navigate("/")
    }
  }, [navigate])

  const onFinish = async (values) => {
    setLoading(true)
    setError(null)

    try {
      const { email, password } = values
      const response = await userService.login(email, password)

      // Store user data
      if (rememberMe) {
        localStorage.setItem("user", JSON.stringify(response))
        localStorage.setItem("auth", true)
      } else {
        sessionStorage.setItem("user", JSON.stringify(response))
        localStorage.setItem("auth", true)

      }

      message.success("Đăng nhập thành công!")

      // Redirect to dashboard
      setTimeout(() => {
        navigate("/")
      }, 500)
    } catch (err) {
      console.error("Login error:", err)
      setError(err.response?.data?.message || "Đăng nhập thất bại. Vui lòng kiểm tra lại email và mật khẩu.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-background"></div>

      <div className="login-content">
        <div className="login-form-container">
          <div className="login-header">
            {/* <div className="logo-container">
              <div className="logo-circle">
                <LoginOutlined className="logo-icon" />
              </div>
            </div> */}
            <Title level={2} className="login-title">
              Đăng nhập
            </Title>
            <Text className="login-subtitle">Chào mừng trở lại! Vui lòng đăng nhập để tiếp tục.</Text>
          </div>
          <Alert
              message="Tài khoản mặc định"
              description={
                <div className="credential-container">
                  <div className="credential-row">
                    <span>
                      <strong>Email:</strong> admin@365.com
                    </span>
                    <Button
                      type="text"
                      icon={<CopyOutlined />}
                      size="small"
                      onClick={() => {
                        navigator.clipboard.writeText("admin@365.com")
                        message.success("Đã sao chép email")
                      }}
                    />
                  </div>
                  <div className="credential-row">
                    <span>
                      <strong>Password:</strong> admin
                    </span>
                    <Button
                      type="text"
                      icon={<CopyOutlined />}
                      size="small"
                      onClick={() => {
                        navigator.clipboard.writeText("admin")
                        message.success("Đã sao chép mật khẩu")
                      }}
                    />
                  </div>
                </div>
              }
              type="info"
              showIcon
              className="login-alert"
              style={{ marginBottom: 24, textAlign: "left" }}
            />
          
          {error && (
            <Alert
              message="Đăng nhập thất bại"
              description={error}
              type="error"
              showIcon
              closable
              className="login-alert"
            />
          )}

          <Form
            form={form}
            name="login"
            className="login-form"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            size="large"
          >
            <Form.Item
              name="email"
              rules={[
                { required: true, message: "Vui lòng nhập email!" },
                { type: "email", message: "Email không hợp lệ!" },
              ]}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Email"
                autoComplete="email"
                className="login-input"
              />
            </Form.Item>

            <Form.Item name="password" rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}>
              <Input.Password
                prefix={<LockOutlined className="site-form-item-icon" />}
                placeholder="Mật khẩu"
                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                className="login-input"
              />
            </Form.Item>

            <Form.Item className="login-options">
              <div className="login-remember-forgot">
                <Checkbox
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="remember-checkbox"
                >
                  Ghi nhớ đăng nhập
                </Checkbox>
                {/* <AntLink href="/forgot-password" className="forgot-link">
                  Quên mật khẩu?
                </AntLink> */}
              </div>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="login-button"
                loading={loading}
                icon={<LoginOutlined />}
                block
              >
                Đăng nhập
              </Button>
            </Form.Item>

            <Divider plain>
              <Text type="secondary">Hoặc</Text>
            </Divider>

            <div className="login-footer">
              <Text className="register-text">
                Liên hệ admin để lấy tài khoản
              </Text>
            </div>
          </Form>
        </div>

        <div className="login-image-container">
          <div className="login-welcome">
            <Title level={2} className="welcome-title">
              Trang quản lý
              Việc làm 365
            </Title>
            <Text className="welcome-text">
              Đăng nhập để truy cập vào hệ thống quản lý và bắt đầu làm việc với các tính năng mạnh mẽ.
            </Text>
            <div className="welcome-features">
              <div className="feature-item">
                <div className="feature-icon">
                  <UserOutlined />
                </div>
                <div className="feature-text">Quản lý người dùng</div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">
                  <LockOutlined />
                </div>
                <div className="feature-text">Bảo mật cao</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {loading && (
        <div className="login-loading-overlay">
          <Spin size="large" tip="Đang đăng nhập..." />
        </div>
      )}
    </div>
  )
}

export default Login

