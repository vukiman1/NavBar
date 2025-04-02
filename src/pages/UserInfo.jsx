"use client"

import { useState, useEffect } from "react"
import { Card, Avatar, Typography, Descriptions, Button, Tag, Space, Spin, Alert, Modal, Divider } from "antd"
import {
  UserOutlined,
  MailOutlined,
  CalendarOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  ArrowLeftOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons"
import { useParams, useNavigate } from "react-router-dom"
import "./css/UserInfo.css"

const { Title, Text } = Typography
const { confirm } = Modal

const UserInfo = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true)
      try {
        const userStr = localStorage.getItem("user")
      if (userStr) {
        try {
          const user = JSON.parse(userStr)
          setTimeout(() => {
            setUser(user)
            setLoading(false)
          }, 800)
        } catch (error) {
          console.error("Error parsing user data from localStorage:", error)
        }
      }
        // Mock data for demonstration
        // const mockUser = {
        //   id: id || "1",
        //   fullName: "Nguyễn Văn A",
        //   email: "nguyenvana@example.com",
        //   createdAt: "2023-05-15T08:30:00.000Z",
        //   lastLogin: "2023-06-10T14:45:00.000Z",
        // }

        // Simulate API delay
        
      } catch (error) {
        console.error("Error fetching user data:", error)
        setLoading(false)
      }
    }

    fetchUserData()
  }, [id])

  // Handle user deletion
  const handleDeleteUser = () => {
    confirm({
      title: "Bạn có chắc chắn muốn xóa người dùng này?",
      icon: <ExclamationCircleOutlined style={{ color: "red" }} />,
      content: "Hành động này không thể hoàn tác. Tất cả dữ liệu liên quan đến người dùng này sẽ bị xóa vĩnh viễn.",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk() {
        // In a real app, you would call your API to delete the user
        // await deleteUser(id);

        // Navigate back to users list
        navigate("/users")
      },
    })
  }

  // Render loading state
  if (loading) {
    return (
      <div className="user-info-loading">
        <Spin size="large" />
        <Text>Đang tải thông tin người dùng...</Text>
      </div>
    )
  }

  // Render error state if user not found
  if (!user) {
    return (
      <div className="user-info-error">
        <Alert
          message="Không tìm thấy người dùng"
          description="Không thể tìm thấy thông tin người dùng với ID đã cung cấp."
          type="error"
          showIcon
          action={
            <Button type="primary" onClick={() => navigate("/users")}>
              Quay lại danh sách
            </Button>
          }
        />
      </div>
    )
  }

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // Format time
  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="user-info-container">
      {/* Header with back button */}
      <div className="user-info-header">
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate("/users")} className="back-button">
          Quay lại danh sách
        </Button>
        <Title level={2} className="page-title">
          <UserOutlined /> Thông tin người dùng
        </Title>
      </div>

      {/* User profile card */}
      <Card className="user-profile-card">
        <div className="user-profile-header">
          <div className="user-avatar-container">
            <Avatar icon={<UserOutlined />} src={user.avatarUrl} size={80} className="user-avatar" />
          </div>

          <div className="user-info-content">
            <div className="user-name-container">
              <Title level={3} className="user-name">
                {user.fullName}
              </Title>
              <Tag color="blue">ID: {user.id}</Tag>
            </div>

            <div className="user-contact">
              <Space direction="vertical" size={4}>
                <Text>
                  <MailOutlined className="icon" /> {user.email}
                </Text>
                <Text>
                  <CalendarOutlined className="icon" /> Tham gia: {formatDate(user.createAt)}
                </Text>
                <Text>
                  <ClockCircleOutlined className="icon" /> Đăng nhập cuối: {formatDateTime(user.lastLogin)}
                </Text>
              </Space>
            </div>
          </div>

          <div className="user-actions">
            <Space>
              <Button type="primary" icon={<EditOutlined />} onClick={() => navigate(`/users/edit/${user.id}`)}>
                Chỉnh sửa
              </Button>
              <Button danger icon={<DeleteOutlined />} onClick={handleDeleteUser}>
                Xóa
              </Button>
            </Space>
          </div>
        </div>
      </Card>

      {/* User details */}
      <Card className="user-details-card">
        <Title level={4}>Chi tiết người dùng</Title>
        <Divider />

        <Descriptions bordered column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }} className="user-descriptions">
          <Descriptions.Item label="ID người dùng">{user.id}</Descriptions.Item>
          <Descriptions.Item label="Họ và tên">{user.fullName}</Descriptions.Item>
          <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
          <Descriptions.Item label="Ngày tham gia">{formatDate(user.createAt)}</Descriptions.Item>
          <Descriptions.Item label="Đăng nhập cuối" span={2}>
            {formatDateTime(user.lastLogin)}
          </Descriptions.Item>
        </Descriptions>

        <div className="action-buttons">
          <Space>
            <Button type="primary" icon={<EditOutlined />} onClick={() => navigate(`/users/edit/${user.id}`)}>
              Chỉnh sửa thông tin
            </Button>
            <Button danger icon={<DeleteOutlined />} onClick={handleDeleteUser}>
              Xóa người dùng
            </Button>
          </Space>
        </div>
      </Card>
    </div>
  )
}

export default UserInfo

