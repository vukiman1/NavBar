"use client"

import { useState } from "react"
import {
  Layout,
  Menu,
  Card,
  Statistic,
  Row,
  Col,
  Table,
  Badge,
  Avatar,
  Progress,
  Dropdown,
  Button,
  List,
  Tabs,
  Space,
  Typography,
  Tag,
} from "antd"
import {
  BarChartOutlined,
  BellOutlined,
  DownOutlined,
  FileTextOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PieChartOutlined,
  SettingOutlined,
  ShopOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons"

const { Header, Sider, Content } = Layout
const { Title, Text, Paragraph } = Typography
const { TabPane } = Tabs

// Mock data
const dashboardData = {
  overview: {
    totalJobPosts: 150,
    totalCompanies: 47,
    totalUsers: 9832,
    totalApplications: 6540,
    jobPostsPendingApproval: 12,
    jobPostsExpired: 34,
    newUsersThisWeek: 123,
  },
  notifications: [
    {
      id: 1,
      title: "Tin tuyển dụng mới cần duyệt",
      content: "Công ty TNHH ABC vừa đăng tin tuyển dụng mới.",
      createdAt: "2025-04-03T10:00:00Z",
      isRead: false,
    },
    {
      id: 2,
      title: "Hệ thống bảo trì",
      content: "Hệ thống sẽ bảo trì lúc 23h đêm nay.",
      createdAt: "2025-04-02T14:00:00Z",
      isRead: true,
    },
  ],
  jobPostTrends: {
    labels: ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4"],
    data: [120, 134, 156, 148],
  },
  applicationTrends: {
    labels: ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4"],
    data: [800, 950, 1050, 980],
  },
  conversionRate: {
    views: 12000,
    applies: 6540,
    rate: 54.5,
  },
  jobPostApprovalStats: {
    total: 150,
    approved: 120,
    rejected: 15,
    pending: 15,
  },
  companyPerformance: [
    {
      companyName: "FPT Software",
      jobPosts: 12,
      applications: 880,
      hireRate: 35.2,
    },
    {
      companyName: "VNG",
      jobPosts: 8,
      applications: 720,
      hireRate: 41.5,
    },
    {
      companyName: "Shopee Việt Nam",
      jobPosts: 10,
      applications: 500,
      hireRate: 25.0,
    },
  ],
  userGrowth: {
    labels: ["Tuần 1", "Tuần 2", "Tuần 3", "Tuần 4"],
    users: [120, 145, 160, 182],
    employers: [20, 18, 25, 30],
  },
  jobPostWithoutApplyRate: {
    totalExpiredPosts: 34,
    noApplicationPosts: 12,
    rate: 35.3,
  },
  applicationByAcademicLevel: [
    { level: "Trên đại học", count: 543 },
    { level: "Đại học", count: 4321 },
    { level: "Cao đẳng", count: 1298 },
    { level: "Trung cấp", count: 765 },
    { level: "Trung học", count: 789 },
    { level: "Chứng chỉ nghề", count: 212 },
  ],
  mostViewedJobs: [
    {
      jobTitle: "Lập trình viên Backend NodeJS",
      company: "TechABC",
      views: 1280,
      applies: 220,
    },
    {
      jobTitle: "Chuyên viên SEO Marketing",
      company: "SEOKing",
      views: 950,
      applies: 180,
    },
    {
      jobTitle: "Nhân viên Kế toán tổng hợp",
      company: "ACC Corp",
      views: 880,
      applies: 140,
    },
  ],
  topCompanies: [
    {
      id: 8599,
      slug: "hd-saison",
      companyName: "HD Saison",
      followers: 1234,
      logoUrl: "https://example.com/logo1.png",
    },
    {
      id: 8597,
      slug: "cbre-vn",
      companyName: "CBRE Việt Nam",
      followers: 998,
      logoUrl: "https://example.com/logo2.png",
    },
  ],
  popularJobFields: [
    { field: "Công nghệ thông tin", count: 245 },
    { field: "Marketing", count: 180 },
    { field: "Kế toán / Tài chính", count: 165 },
    { field: "Xây dựng", count: 120 },
  ],
  recentActivities: [
    {
      id: 1,
      type: "job_post_created",
      message: "Công ty ABC vừa đăng tin tuyển dụng mới.",
      createdAt: "2025-04-03T08:30:00Z",
    },
    {
      id: 2,
      type: "user_registered",
      message: "Người dùng Nguyễn Văn A vừa đăng ký tài khoản.",
      createdAt: "2025-04-03T09:00:00Z",
    },
    {
      id: 3,
      type: "application_submitted",
      message: "Ứng viên Trần Thị B đã ứng tuyển vào 'Chuyên viên tư vấn'.",
      createdAt: "2025-04-03T11:30:00Z",
    },
  ],
}

// Format date to Vietnamese format
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}

// Chart components using Ant Design
const SimpleBarChart = ({ data, labels, title, description }) => {
  return (
    <Card title={title} extra={<Text type="secondary">{description}</Text>}>
      <div
        style={{
          height: 300,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          padding: "0 20px",
        }}
      >
        {data.map((value, index) => (
          <div key={index} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div
              style={{
                backgroundColor: "#1890ff",
                width: 40,
                height: `${(value / Math.max(...data)) * 200}px`,
                borderTopLeftRadius: 4,
                borderTopRightRadius: 4,
              }}
            ></div>
            <Text style={{ marginTop: 8 }}>{labels[index]}</Text>
          </div>
        ))}
      </div>
    </Card>
  )
}

const SimplePieChart = ({ data, labels, title, description }) => {
  const total = data.reduce((sum, value) => sum + value, 0)
  const colors = ["#1890ff", "#36cfc9", "#73d13d", "#ffc53d", "#ff7a45", "#ff4d4f"]

  return (
    <Card title={title} extra={<Text type="secondary">{description}</Text>}>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
        <div style={{ position: "relative", width: 160, height: 160 }}>
          <div
            style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            <Text strong style={{ fontSize: 20 }}>
              {total}
            </Text>
          </div>
          <svg width="100%" height="100%" viewBox="0 0 100 100">
            {data.map((value, index) => {
              const percentage = (value / total) * 100
              const previousPercentages = data.slice(0, index).reduce((sum, v) => sum + (v / total) * 100, 0)

              return (
                <circle
                  key={index}
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke={colors[index % colors.length]}
                  strokeWidth="20"
                  strokeDasharray={`${percentage} ${100 - percentage}`}
                  strokeDashoffset={`${-previousPercentages}`}
                  transform="rotate(-90 50 50)"
                />
              )
            })}
          </svg>
        </div>
      </div>
      <Row gutter={[16, 8]}>
        {data.map((value, index) => (
          <Col span={12} key={index}>
            <Space>
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  backgroundColor: colors[index % colors.length],
                }}
              ></div>
              <Text>{labels[index]}</Text>
              <Text strong style={{ marginLeft: "auto" }}>
                {value}
              </Text>
            </Space>
          </Col>
        ))}
      </Row>
    </Card>
  )
}

// Company performance table columns
const companyColumns = [
  {
    title: "Công ty",
    dataIndex: "companyName",
    key: "companyName",
  },
  {
    title: "Tin đăng",
    dataIndex: "jobPosts",
    key: "jobPosts",
    align: "right",
  },
  {
    title: "Ứng tuyển",
    dataIndex: "applications",
    key: "applications",
    align: "right",
  },
  {
    title: "Tỷ lệ tuyển",
    dataIndex: "hireRate",
    key: "hireRate",
    align: "right",
    render: (hireRate) => `${hireRate}%`,
  },
]

// Most viewed jobs table columns
const jobsColumns = [
  {
    title: "Vị trí",
    dataIndex: "jobTitle",
    key: "jobTitle",
  },
  {
    title: "Công ty",
    dataIndex: "company",
    key: "company",
  },
  {
    title: "Lượt xem",
    dataIndex: "views",
    key: "views",
    align: "right",
  },
  {
    title: "Ứng tuyển",
    dataIndex: "applies",
    key: "applies",
    align: "right",
  },
]

// Main Dashboard Component
const Home = () => {
  const [collapsed, setCollapsed] = useState(false)
  const unreadNotifications = dashboardData.notifications.filter((n) => !n.isRead).length

  // User dropdown menu items
  const userMenuItems = [
    {
      key: "1",
      label: "Hồ sơ",
    },
    {
      key: "2",
      label: "Cài đặt",
    },
    {
      type: "divider",
    },
    {
      key: "3",
      label: "Đăng xuất",
    },
  ]

  // Activity icon mapping
  const getActivityIcon = (type) => {
    switch (type) {
      case "job_post_created":
        return <FileTextOutlined style={{ color: "#1890ff" }} />
      case "user_registered":
        return <UserOutlined style={{ color: "#1890ff" }} />
      case "application_submitted":
        return <FileTextOutlined style={{ color: "#1890ff" }} />
      default:
        return <FileTextOutlined style={{ color: "#1890ff" }} />
    }
  }

  return (
    <Layout >
      {/* Sidebar */}


      <Layout>
 

        {/* Main Content */}
        <Content style={{ margin: "24px", overflow: "initial" }}>
          {/* Overview Stats */}
          <Row gutter={[24, 24]}>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Tin tuyển dụng"
                  value={dashboardData.overview.totalJobPosts}
                  prefix={<FileTextOutlined />}
                />
                <Text type="secondary">{dashboardData.overview.jobPostsPendingApproval} tin đang chờ duyệt</Text>
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic title="Công ty" value={dashboardData.overview.totalCompanies} prefix={<ShopOutlined />} />
                <Text type="secondary">Đang hoạt động trên hệ thống</Text>
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic title="Người dùng" value={dashboardData.overview.totalUsers} prefix={<UserOutlined />} />
                <Text type="secondary">+{dashboardData.overview.newUsersThisWeek} người dùng mới tuần này</Text>
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Lượt ứng tuyển"
                  value={dashboardData.overview.totalApplications}
                  prefix={<FileTextOutlined />}
                />
                <Text type="secondary">Tỷ lệ chuyển đổi: {dashboardData.conversionRate.rate}%</Text>
              </Card>
            </Col>
          </Row>

          {/* Charts Section */}
          <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
            <Col xs={24} lg={8}>
              <SimpleBarChart
                data={dashboardData.jobPostTrends.data}
                labels={dashboardData.jobPostTrends.labels}
                title="Xu hướng đăng tin"
                description="Số lượng tin đăng theo tháng"
              />
            </Col>
            <Col xs={24} lg={8}>
              <SimpleBarChart
                data={dashboardData.applicationTrends.data}
                labels={dashboardData.applicationTrends.labels}
                title="Xu hướng ứng tuyển"
                description="Số lượng ứng tuyển theo tháng"
              />
            </Col>
            <Col xs={24} lg={8}>
              <SimplePieChart
                data={dashboardData.applicationByAcademicLevel.map((item) => item.count)}
                labels={dashboardData.applicationByAcademicLevel.map((item) => item.level)}
                title="Ứng tuyển theo trình độ học vấn"
                description="Phân bố ứng viên theo trình độ"
              />
            </Col>
          </Row>

          {/* Job Post Approval Stats */}
          <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
            <Col span={24}>
              <Card
                title="Thống kê phê duyệt tin tuyển dụng"
                extra={<Text type="secondary">Tổng số: {dashboardData.jobPostApprovalStats.total} tin</Text>}
              >
                <Row gutter={[16, 16]}>
                  <Col span={24}>
                    <Space direction="vertical" style={{ width: "100%" }}>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <Text>Đã duyệt</Text>
                        <Text>
                          {dashboardData.jobPostApprovalStats.approved} (
                          {Math.round(
                            (dashboardData.jobPostApprovalStats.approved / dashboardData.jobPostApprovalStats.total) *
                              100,
                          )}
                          %)
                        </Text>
                      </div>
                      <Progress
                        percent={Math.round(
                          (dashboardData.jobPostApprovalStats.approved / dashboardData.jobPostApprovalStats.total) *
                            100,
                        )}
                        showInfo={false}
                        strokeColor="#1890ff"
                      />
                    </Space>
                  </Col>
                  <Col span={24}>
                    <Space direction="vertical" style={{ width: "100%" }}>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <Text>Từ chối</Text>
                        <Text>
                          {dashboardData.jobPostApprovalStats.rejected} (
                          {Math.round(
                            (dashboardData.jobPostApprovalStats.rejected / dashboardData.jobPostApprovalStats.total) *
                              100,
                          )}
                          %)
                        </Text>
                      </div>
                      <Progress
                        percent={Math.round(
                          (dashboardData.jobPostApprovalStats.rejected / dashboardData.jobPostApprovalStats.total) *
                            100,
                        )}
                        showInfo={false}
                        strokeColor="#ff4d4f"
                      />
                    </Space>
                  </Col>
                  <Col span={24}>
                    <Space direction="vertical" style={{ width: "100%" }}>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <Text>Đang chờ</Text>
                        <Text>
                          {dashboardData.jobPostApprovalStats.pending} (
                          {Math.round(
                            (dashboardData.jobPostApprovalStats.pending / dashboardData.jobPostApprovalStats.total) *
                              100,
                          )}
                          %)
                        </Text>
                      </div>
                      <Progress
                        percent={Math.round(
                          (dashboardData.jobPostApprovalStats.pending / dashboardData.jobPostApprovalStats.total) * 100,
                        )}
                        showInfo={false}
                        strokeColor="#faad14"
                      />
                    </Space>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>

          {/* Tables Section */}
          <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
            <Col xs={24} lg={12}>
              <Card title="Hiệu suất công ty" extra={<Text type="secondary">Các công ty có hiệu suất tốt nhất</Text>}>
                <Table
                  dataSource={dashboardData.companyPerformance}
                  columns={companyColumns}
                  pagination={false}
                  rowKey="companyName"
                  size="middle"
                />
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card
                title="Tin tuyển dụng xem nhiều nhất"
                extra={<Text type="secondary">Các tin có lượt xem và ứng tuyển cao nhất</Text>}
              >
                <Table
                  dataSource={dashboardData.mostViewedJobs}
                  columns={jobsColumns}
                  pagination={false}
                  rowKey="jobTitle"
                  size="middle"
                />
              </Card>
            </Col>
          </Row>

          {/* Popular Job Fields and Recent Activities */}
          <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
            <Col xs={24} lg={12}>
              <Card
                title="Lĩnh vực phổ biến"
                extra={<Text type="secondary">Các lĩnh vực có nhiều tin tuyển dụng nhất</Text>}
              >
                <Space direction="vertical" style={{ width: "100%" }}>
                  {dashboardData.popularJobFields.map((field) => (
                    <div key={field.field}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                        <Text>{field.field}</Text>
                        <Text strong>{field.count} tin</Text>
                      </div>
                      <Progress
                        percent={Math.round(
                          (field.count / Math.max(...dashboardData.popularJobFields.map((f) => f.count))) * 100,
                        )}
                        showInfo={false}
                      />
                    </div>
                  ))}
                </Space>
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card
                title="Hoạt động gần đây"
                extra={<Text type="secondary">Các hoạt động mới nhất trên hệ thống</Text>}
              >
                <List
                  itemLayout="horizontal"
                  dataSource={dashboardData.recentActivities}
                  renderItem={(activity) => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={<Avatar icon={getActivityIcon(activity.type)} style={{ backgroundColor: "#f0f5ff" }} />}
                        title={activity.message}
                        description={formatDate(activity.createdAt)}
                      />
                    </List.Item>
                  )}
                />
              </Card>
            </Col>
          </Row>

          {/* Notifications */}
          <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
            <Col span={24}>
              <Card title="Thông báo" extra={<Text type="secondary">Các thông báo mới nhất</Text>}>
                <List
                  itemLayout="horizontal"
                  dataSource={dashboardData.notifications}
                  renderItem={(notification) => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={
                          <Avatar
                            icon={<BellOutlined />}
                            style={{
                              backgroundColor: notification.isRead ? "#f5f5f5" : "#e6f7ff",
                            }}
                          />
                        }
                        title={
                          <Space>
                            {notification.title}
                            {!notification.isRead && <Tag color="blue">Mới</Tag>}
                          </Space>
                        }
                        description={
                          <>
                            <Paragraph>{notification.content}</Paragraph>
                            <Text type="secondary">{formatDate(notification.createdAt)}</Text>
                          </>
                        }
                      />
                    </List.Item>
                  )}
                />
              </Card>
            </Col>
          </Row>

          {/* User Growth and Conversion Rate */}
          <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
            <Col xs={24} lg={12}>
              <Card
                title="Tăng trưởng người dùng"
                extra={<Text type="secondary">Số lượng người dùng mới theo tuần</Text>}
              >
                <div style={{ height: 300, position: "relative" }}>
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      display: "flex",
                      alignItems: "flex-end",
                      justifyContent: "space-between",
                      padding: "0 20px",
                    }}
                  >
                    {dashboardData.userGrowth.labels.map((label, index) => (
                      <div
                        key={index}
                        style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}
                      >
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                          <div
                            style={{
                              backgroundColor: "#1890ff",
                              width: 32,
                              height: `${(dashboardData.userGrowth.users[index] / Math.max(...dashboardData.userGrowth.users)) * 150}px`,
                              borderTopLeftRadius: 4,
                              borderTopRightRadius: 4,
                            }}
                          ></div>
                          <div
                            style={{
                              backgroundColor: "#91d5ff",
                              width: 32,
                              height: `${(dashboardData.userGrowth.employers[index] / Math.max(...dashboardData.userGrowth.employers)) * 150}px`,
                              borderTopLeftRadius: 4,
                              borderTopRightRadius: 4,
                            }}
                          ></div>
                        </div>
                        <Text>{label}</Text>
                      </div>
                    ))}
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 20,
                      display: "flex",
                      alignItems: "center",
                      gap: 16,
                    }}
                  >
                    <Space>
                      <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#1890ff" }}></div>
                      <Text>Ứng viên</Text>
                    </Space>
                    <Space>
                      <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#91d5ff" }}></div>
                      <Text>Nhà tuyển dụng</Text>
                    </Space>
                  </div>
                </div>
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card title="Tỷ lệ chuyển đổi" extra={<Text type="secondary">Tỷ lệ ứng tuyển trên lượt xem</Text>}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    height: 250,
                  }}
                >
                  <div
                    style={{
                      position: "relative",
                      width: 160,
                      height: 160,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <svg width="100%" height="100%" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="45" fill="transparent" stroke="#f0f0f0" strokeWidth="10" />
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="transparent"
                        stroke="#1890ff"
                        strokeWidth="10"
                        strokeDasharray={`${dashboardData.conversionRate.rate * 2.83} ${283 - dashboardData.conversionRate.rate * 2.83}`}
                        strokeDashoffset="0"
                        transform="rotate(-90 50 50)"
                      />
                    </svg>
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Title level={2} style={{ margin: 0 }}>
                        {dashboardData.conversionRate.rate}%
                      </Title>
                      <Text type="secondary">Tỷ lệ chuyển đổi</Text>
                    </div>
                  </div>
                  <Row gutter={16} style={{ marginTop: 24, width: "100%" }}>
                    <Col span={12}>
                      <Card size="small">
                        <Statistic
                          title="Lượt xem"
                          value={dashboardData.conversionRate.views}
                          valueStyle={{ color: "#1890ff" }}
                        />
                      </Card>
                    </Col>
                    <Col span={12}>
                      <Card size="small">
                        <Statistic
                          title="Lượt ứng tuyển"
                          value={dashboardData.conversionRate.applies}
                          valueStyle={{ color: "#1890ff" }}
                        />
                      </Card>
                    </Col>
                  </Row>
                </div>
              </Card>
            </Col>
          </Row>
        </Content>
      </Layout>
    </Layout>
  )
}

export default Home

