"use client"

import { useState, useEffect } from "react"
import {
  Layout,
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
  theme,
  Tooltip,
  Select,
  DatePicker,
  Spin,
} from "antd"
import {
  BarChartOutlined,
  CalendarOutlined,
  DownOutlined,
  FileTextOutlined,
  PieChartOutlined,
  SettingOutlined,
  ShopOutlined,
  UserOutlined,
  FilterOutlined,
  ReloadOutlined,
  DownloadOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  AppstoreOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons"
import webService from "../services/webService"

const { Header, Sider, Content } = Layout
const { Title, Text, Paragraph } = Typography
const { TabPane } = Tabs
const { useToken } = theme

// Replace the formatDate function with this improved version that handles invalid dates
const formatDate = (dateString) => {
  if (!dateString) return "N/A"

  try {
    const date = new Date(dateString)

    // Check if date is valid
    if (isNaN(date.getTime())) {
      return "Invalid date"
    }

    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  } catch (error) {
    console.error("Error formatting date:", dateString, error)
    return "Invalid date"
  }
}

// Modify the EnhancedBarChart component to support multiple data series
const EnhancedBarChart = ({ dataSeries, labels, title, description }) => {
  const { token } = useToken()
  return (
    <Card
      title={
        <div style={{ display: "flex", alignItems: "center" }}>
          <BarChartOutlined style={{ marginRight: 8, color: token.colorPrimary }} />
          <span>{title}</span>
        </div>
      }
      extra={
        <Space>
          <Text type="secondary">{description}</Text>
          <Tooltip title="Tải xuống dữ liệu">
            <Button type="text" icon={<DownloadOutlined />} size="small" />
          </Tooltip>
        </Space>
      }
      bordered={false}
      className="dashboard-card"
    >
      <div style={{ marginBottom: 16, display: "flex", justifyContent: "center" }}>
        <Space size="large">
          {dataSeries.map((series, i) => (
            <Space key={i}>
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  backgroundColor: series.color || token.colorPrimary,
                }}
              ></div>
              <Text>{series.name}</Text>
            </Space>
          ))}
        </Space>
      </div>
      <div
        style={{
          height: 300,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          padding: "0 20px",
        }}
      >
        {labels.map((label, index) => {
          return (
            <div key={index} style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "80px" }}>
              <div style={{ display: "flex", alignItems: "flex-end", marginBottom: 4 }}>
                {dataSeries.map((series, i) => {
                  const value = series.data[index]
                  const prevValue = series.previousPeriod ? series.previousPeriod[index] : null
                  const change = prevValue ? ((value - prevValue) / prevValue) * 100 : null
                  const isIncrease = prevValue ? value > prevValue : null
                  const maxValue = Math.max(...series.data, ...(series.previousPeriod || []))
                  const normalizedHeight = (value / series.maxValue) * 180

                  return (
                    <Tooltip
                      key={i}
                      title={
                        <>
                          <div>
                            {series.name}: {value.toLocaleString()}
                          </div>
                          {prevValue && (
                            <div>
                              Kỳ trước: {prevValue.toLocaleString()}, Thay đổi: {change.toFixed(1)}%
                            </div>
                          )}
                        </>
                      }
                    >
                      <div
                        style={{
                          backgroundColor: series.color || token.colorPrimary,
                          width: 20,
                          height: `${normalizedHeight}px`,
                          borderTopLeftRadius: 4,
                          borderTopRightRadius: 4,
                          marginRight: 4,
                        }}
                      ></div>
                    </Tooltip>
                  )
                })}
              </div>
              <Text style={{ marginTop: 8 }}>{label}</Text>
            </div>
          )
        })}
      </div>
    </Card>
  )
}

// Enhanced Pie Chart with better visualization
const EnhancedPieChart = ({ data, labels, title, description }) => {
  const { token } = useToken()
  const total = data.reduce((sum, value) => sum + value, 0)
  const colors = [
    token.colorPrimary,
    token.colorInfo,
    token.colorSuccess,
    token.colorWarning,
    token.colorError,
    token.colorTextSecondary,
  ]

  return (
    <Card
      title={
        <div style={{ display: "flex", alignItems: "center" }}>
          <PieChartOutlined style={{ marginRight: 8, color: token.colorPrimary }} />
          <span>{title}</span>
        </div>
      }
      extra={
        <Space>
          <Text type="secondary">{description}</Text>
          <Tooltip title="Tải xuống dữ liệu">
            <Button type="text" icon={<DownloadOutlined />} size="small" />
          </Tooltip>
        </Space>
      }
      bordered={false}
      className="dashboard-card"
    >
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
        <div style={{ position: "relative", width: 180, height: 180 }}>
          <div
            style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            <div style={{ textAlign: "center" }}>
              <Text strong style={{ fontSize: 24 }}>
                {total.toLocaleString()}
              </Text>
              <div>
                <Text type="secondary" style={{ fontSize: 14 }}>
                  Tổng số
                </Text>
              </div>
            </div>
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
                >
                  <title>
                    {labels[index]}: {value.toLocaleString()} ({percentage.toFixed(1)}%)
                  </title>
                </circle>
              )
            })}
          </svg>
        </div>
      </div>
      <Row gutter={[16, 16]}>
        {data.map((value, index) => {
          const percentage = (value / total) * 100

          return (
            <Col span={12} key={index}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "8px",
                  borderRadius: "4px",
                  backgroundColor: index % 2 === 0 ? token.colorBgContainer : token.colorBgElevated,
                }}
              >
                <div
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    backgroundColor: colors[index % colors.length],
                    marginRight: 8,
                  }}
                ></div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <Text>{labels[index]}</Text>
                    <Text strong>{value.toLocaleString()}</Text>
                  </div>
                  <Progress
                    percent={percentage}
                    size="small"
                    showInfo={false}
                    strokeColor={colors[index % colors.length]}
                    style={{ marginTop: 4 }}
                  />
                </div>
              </div>
            </Col>
          )
        })}
      </Row>
    </Card>
  )
}

// Enhanced Company performance table columns
const companyColumns = [
  {
    title: "Công ty",
    dataIndex: "companyName",
    key: "companyName",
    render: (text) => <Text strong>{text}</Text>,
  },
  {
    title: "Tin đăng",
    dataIndex: "jobPosts",
    key: "jobPosts",
    align: "right",
    render: (value) => (
      <Tooltip title={`${value} tin tuyển dụng`}>
        <Tag color="blue" style={{ minWidth: "60px", textAlign: "center" }}>
          {value}
        </Tag>
      </Tooltip>
    ),
  },
  {
    title: "Ứng tuyển",
    dataIndex: "applications",
    key: "applications",
    align: "right",
    render: (value) => (
      <Tooltip title={`${value} lượt ứng tuyển`}>
        <Tag color="green" style={{ minWidth: "60px", textAlign: "center" }}>
          {value}
        </Tag>
      </Tooltip>
    ),
  },
  {
    title: "Tỷ lệ tuyển",
    dataIndex: "hireRate",
    key: "hireRate",
    align: "right",
    render: (hireRate) => {
      let color = "green"
      if (hireRate < 30) color = "orange"
      if (hireRate < 20) color = "red"

      return (
        <Tooltip title={`Tỷ lệ tuyển dụng thành công: ${hireRate}%`}>
          <Tag color={color} style={{ minWidth: "60px", textAlign: "center" }}>
            {hireRate}%
          </Tag>
        </Tooltip>
      )
    },
  },
]

// Enhanced Most viewed jobs table columns
const jobsColumns = [
  {
    title: "Vị trí",
    dataIndex: "jobTitle",
    key: "jobTitle",
    render: (text) => <Text strong>{text}</Text>,
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
    render: (value) => (
      <Space>
        <EyeOutlined style={{ color: "#1890ff" }} />
        <span>{value.toLocaleString()}</span>
      </Space>
    ),
  },
  {
    title: "Ứng tuyển",
    dataIndex: "applies",
    key: "applies",
    align: "right",
    render: (value, record) => {
      const rate = ((value / record.views) * 100).toFixed(1)
      return (
        <Tooltip title={`Tỷ lệ chuyển đổi: ${rate}%`}>
          <Space>
            <FileTextOutlined style={{ color: "#52c41a" }} />
            <span>{value.toLocaleString()}</span>
            <Tag color="green" style={{ fontSize: "11px" }}>
              {rate}%
            </Tag>
          </Space>
        </Tooltip>
      )
    },
  },
]

// Main Dashboard Component
const Home = () => {
  const { token } = useToken()
  const [collapsed, setCollapsed] = useState(false)
  const [viewMode, setViewMode] = useState("card")
  const [timeRange, setTimeRange] = useState("month")
  const [loading, setLoading] = useState(true)
  const [dashboardData, setDashboardData] = useState(null)
  const [error, setError] = useState(null)

  // Function to fetch dashboard data from API
  const fetchDashboardData = async () => {
    setLoading(true)
    setError(null)

    try {
      // Replace with your actual API endpoint
      const response = await webService.getDashBoardData()
      setDashboardData(response)
    } catch (err) {
      console.error("Error fetching dashboard data:", err)
      setError("Không thể tải dữ liệu. Vui lòng thử lại sau.")
    } finally {
      setLoading(false)
    }
  }

  // Fetch data on component mount and when timeRange changes
  useEffect(() => {
    fetchDashboardData()
  }, [timeRange])

  // User dropdown menu items
  const userMenuItems = [
    {
      key: "1",
      label: "Hồ sơ",
      icon: <UserOutlined />,
    },
    {
      key: "2",
      label: "Cài đặt",
      icon: <SettingOutlined />,
    },
    {
      type: "divider",
    },
    {
      key: "3",
      label: "Đăng xuất",
      icon: <UserOutlined />,
    },
  ]

  // Activity icon mapping
  const getActivityIcon = (type) => {
    switch (type) {
      case "job_post_created":
        return <FileTextOutlined style={{ color: token.colorPrimary }} />
      case "user_registered":
        return <UserOutlined style={{ color: token.colorSuccess }} />
      case "application_submitted":
        return <FileTextOutlined style={{ color: token.colorInfo }} />
      default:
        return <FileTextOutlined style={{ color: token.colorPrimary }} />
    }
  }

  // Filter options
  const filterItems = [
    {
      key: "1",
      label: "Tất cả dữ liệu",
    },
    {
      key: "2",
      label: "Dữ liệu trong tháng",
    },
    {
      key: "3",
      label: "Dữ liệu trong quý",
    },
  ]

  // If there's an error, display error message
  if (error) {
    return (
      <div style={{ padding: "24px", textAlign: "center" }}>
        <Title level={4} style={{ color: token.colorError }}>
          {error}
        </Title>
        <Button type="primary" onClick={fetchDashboardData} icon={<ReloadOutlined />} style={{ marginTop: "16px" }}>
          Thử lại
        </Button>
      </div>
    )
  }

  // If data is still loading and no data is available yet, show loading spinner
  if (loading && !dashboardData) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <Spin size="large" tip="Đang tải dữ liệu..." />
      </div>
    )
  }


  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Layout>
        {/* Main Content */}
        <Content style={{ padding: "24px", backgroundColor: token.colorBgLayout }}>
          {/* Dashboard Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 24,
              flexWrap: "wrap",
              gap: "16px",
            }}
          >
            <div>
              <Title level={3} style={{ margin: 0 }}>
                Tổng quan hệ thống
              </Title>
              <Text type="secondary">Thống kê và phân tích dữ liệu tuyển dụng</Text>
            </div>

            <Space wrap>
              <DatePicker.RangePicker placeholder={["Từ ngày", "Đến ngày"]} style={{ width: "280px" }} />

              <Select
                defaultValue="month"
                style={{ width: 140 }}
                onChange={setTimeRange}
                options={[
                  { value: "week", label: "Tuần này" },
                  { value: "month", label: "Tháng này" },
                  { value: "quarter", label: "Quý này" },
                  { value: "year", label: "Năm nay" },
                ]}
              />

              <Dropdown menu={{ items: filterItems }}>
                <Button icon={<FilterOutlined />}>
                  Bộ lọc <DownOutlined />
                </Button>
              </Dropdown>

              <Tooltip title="Làm mới dữ liệu">
                <Button icon={<ReloadOutlined />} onClick={fetchDashboardData} loading={loading} />
              </Tooltip>

              <Space.Compact>
                <Button
                  type={viewMode === "card" ? "primary" : "default"}
                  icon={<AppstoreOutlined />}
                  onClick={() => setViewMode("card")}
                />
                <Button
                  type={viewMode === "list" ? "primary" : "default"}
                  icon={<UnorderedListOutlined />}
                  onClick={() => setViewMode("list")}
                />
              </Space.Compact>
            </Space>
          </div>

          {/* Overview Stats */}
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={8} lg={6} xl={4}>
              <Card loading={loading} bordered={false} className="dashboard-card" bodyStyle={{ padding: "24px" }}>
                <Statistic
                  title={
                    <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
                      <FileTextOutlined style={{ marginRight: 8, color: token.colorPrimary }} />
                      <span>Tin tuyển dụng</span>
                    </div>
                  }
                  value={dashboardData?.overview.totalJobPosts}
                  valueStyle={{ color: token.colorPrimary, fontSize: "28px" }}
                />
                <div style={{ marginTop: 12 }}>
                  <Space align="center">
                    <Badge status="processing" />
                    <Text type="secondary">{dashboardData?.overview.jobPostsPendingApproval} tin đang chờ duyệt</Text>
                  </Space>
                </div>
                {/* <div style={{ marginTop: 16 }}>
                  <Progress
                    percent={Math.round(
                      ((dashboardData?.overview.totalJobPosts - dashboardData?.overview.jobPostsExpired) /
                        dashboardData?.overview.totalJobPosts) *
                        100,
                    )}
                    size="small"
                    status="active"
                  />
                </div> */}
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6} xl={4}>
              <Card loading={loading} bordered={false} className="dashboard-card" bodyStyle={{ padding: "24px" }}>
                <Statistic
                  title={
                    <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
                      <ShopOutlined style={{ marginRight: 8, color: token.colorInfo }} />
                      <span>Công ty</span>
                    </div>
                  }
                  value={dashboardData?.overview.totalCompanies}
                  valueStyle={{ color: token.colorInfo, fontSize: "28px" }}
                />
                <div style={{ marginTop: 12 }}>
                  <Space align="center">
                    <Badge status="success" />
                    <Text type="secondary">Đang hoạt động trên hệ thống</Text>
                  </Space>
                </div>
                {/* <div style={{ marginTop: 16 }}>
                  <Progress percent={95} size="small" status="active" strokeColor={token.colorInfo} />
                </div> */}
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6} xl={4}>
              <Card loading={loading} bordered={false} className="dashboard-card" bodyStyle={{ padding: "24px" }}>
                <Statistic
                  title={
                    <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
                      <UserOutlined style={{ marginRight: 8, color: token.colorSuccess }} />
                      <span>Người dùng</span>
                    </div>
                  }
                  value={dashboardData?.overview.totalUsers}
                  valueStyle={{ color: token.colorSuccess, fontSize: "28px" }}
                />
                <div style={{ marginTop: 12 }}>
                  <Space align="center">
                    <Badge status="processing" />
                    <Text type="secondary">+{dashboardData?.overview.newUsersThisWeek} người dùng mới tuần này</Text>
                  </Space>
                </div>
                {/* <div style={{ marginTop: 16 }}>
                  <Progress
                    percent={Math.round((dashboardData?.overview.newUsersThisWeek / 200) * 100)}
                    size="small"
                    status="active"
                    strokeColor={token.colorSuccess}
                  />
                </div> */}
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6} xl={4}>
              <Card loading={loading} bordered={false} className="dashboard-card" bodyStyle={{ padding: "24px" }}>
                <Statistic
                  title={
                    <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
                      <FileTextOutlined style={{ marginRight: 8, color: token.colorWarning }} />
                      <span>Lượt ứng tuyển</span>
                    </div>
                  }
                  value={dashboardData?.overview.totalApplications}
                  valueStyle={{ color: token.colorWarning, fontSize: "28px" }}
                />
                <div style={{ marginTop: 12 }}>
                  <Space align="center">
                    <Badge status="success" />
                    <Text type="secondary">Tỷ lệ chuyển đổi: {dashboardData?.conversionRate.rate}%</Text>
                  </Space>
                </div>
                {/* <div style={{ marginTop: 16 }}>
                  <Progress
                    percent={dashboardData?.conversionRate.rate}
                    size="small"
                    status="active"
                    strokeColor={token.colorWarning}
                  />
                </div> */}
              </Card>
            </Col>
             <Col xs={24} sm={12} md={8} lg={6} xl={4}>
              <Card loading={loading} bordered={false} className="dashboard-card" bodyStyle={{ padding: "24px" }}>
                <Statistic
                  title={
                    <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
                      <ShopOutlined style={{ marginRight: 8, color: token.colorInfo }} />
                      <span>Lượt truy cập</span>
                    </div>
                  }
                  value={dashboardData?.overview.totalWebViews}
                  valueStyle={{ color: token.colorInfo, fontSize: "28px" }}
                />
                <div style={{ marginTop: 12 }}>
                  <Space align="center">
                    <Badge status="success" />
                    <Text type="secondary">Đã truy câp vào trên hệ thống</Text>
                  </Space>
                </div>
                {/* <div style={{ marginTop: 16 }}>
                  <Progress percent={95} size="small" status="active" strokeColor={token.colorInfo} />
                </div> */}
              </Card>
            </Col>
          </Row>

          {/* Charts Section */}
          {dashboardData && (
            <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
              <Col xs={24} lg={16}>
                <EnhancedBarChart
                  dataSeries={[
                    {
                      name: "Tin tuyển dụng",
                      data: dashboardData.jobPostTrends.data,
                      previousPeriod: dashboardData.jobPostTrends.previousPeriod,
                      color: token.colorPrimary,
                      maxValue: Math.max(...dashboardData.jobPostTrends.data) * 1.2,
                    },
                    {
                      name: "Lượt ứng tuyển",
                      data: dashboardData.applicationTrends.data.map((value) => value / 8), // Scale down for comparison
                      previousPeriod: dashboardData.applicationTrends.previousPeriod.map((value) => value / 8),
                      color: token.colorSuccess,
                      maxValue: (Math.max(...dashboardData.applicationTrends.data) / 8) * 1.2,
                    },
                  ]}
                  labels={dashboardData.jobPostTrends.labels}
                  title="Xu hướng đăng tin và ứng tuyển"
                  description="So sánh số lượng tin đăng và ứng tuyển theo tháng"
                />
              </Col>
              <Col xs={24} lg={8}>
                <EnhancedPieChart
                  data={dashboardData.applicationByAcademicLevel.map((item) => item.count)}
                  labels={dashboardData.applicationByAcademicLevel.map((item) => item.level)}
                  title="Ứng tuyển theo trình độ học vấn"
                  description="Phân bố ứng viên theo trình độ"
                />
              </Col>
            </Row>
          )}

          {/* Job Post Approval Stats */}
          {dashboardData && (
            <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
              <Col span={24}>
                <Card
                  loading={loading}
                  title={
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <FileTextOutlined style={{ marginRight: 8, color: token.colorPrimary }} />
                      <span>Thống kê phê duyệt tin tuyển dụng</span>
                    </div>
                  }
                  extra={
                    <Space>
                      <Text type="secondary">Tổng số: {dashboardData.jobPostApprovalStats.total} tin</Text>
                      <Tooltip title="Tải xuống dữ liệu">
                        <Button type="text" icon={<DownloadOutlined />} size="small" />
                      </Tooltip>
                    </Space>
                  }
                  bordered={false}
                  className="dashboard-card"
                >
                  <Row gutter={[24, 24]}>
                    <Col xs={24} md={8}>
                      <Card bordered={false} style={{ backgroundColor: token.colorBgElevated }}>
                        <Space direction="vertical" style={{ width: "100%" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <Space>
                              <CheckCircleOutlined style={{ color: token.colorSuccess }} />
                              <Text strong>Đã duyệt</Text>
                            </Space>
                            <Text strong>
                              {dashboardData.jobPostApprovalStats.approved} (
                              {Math.round(
                                (dashboardData.jobPostApprovalStats.approved /
                                  dashboardData.jobPostApprovalStats.total) *
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
                            strokeColor={token.colorSuccess}
                            size="large"
                          />
                        </Space>
                      </Card>
                    </Col>
                    <Col xs={24} md={8}>
                      <Card bordered={false} style={{ backgroundColor: token.colorBgElevated }}>
                        <Space direction="vertical" style={{ width: "100%" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <Space>
                              <CloseCircleOutlined style={{ color: token.colorError }} />
                              <Text strong>Từ chối</Text>
                            </Space>
                            <Text strong>
                              {dashboardData.jobPostApprovalStats.rejected} (
                              {Math.round(
                                (dashboardData.jobPostApprovalStats.rejected /
                                  dashboardData.jobPostApprovalStats.total) *
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
                            strokeColor={token.colorError}
                            size="large"
                          />
                        </Space>
                      </Card>
                    </Col>
                    <Col xs={24} md={8}>
                      <Card bordered={false} style={{ backgroundColor: token.colorBgElevated }}>
                        <Space direction="vertical" style={{ width: "100%" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <Space>
                              <ClockCircleOutlined style={{ color: token.colorWarning }} />
                              <Text strong>Đang chờ</Text>
                            </Space>
                            <Text strong>
                              {dashboardData.jobPostApprovalStats.pending} (
                              {Math.round(
                                (dashboardData.jobPostApprovalStats.pending /
                                  dashboardData.jobPostApprovalStats.total) *
                                  100,
                              )}
                              %)
                            </Text>
                          </div>
                          <Progress
                            percent={Math.round(
                              (dashboardData.jobPostApprovalStats.pending / dashboardData.jobPostApprovalStats.total) *
                                100,
                            )}
                            showInfo={false}
                            strokeColor={token.colorWarning}
                            size="large"
                          />
                        </Space>
                      </Card>
                    </Col>
                  </Row>
                </Card>
              </Col>
            </Row>
          )}

          {/* Tables Section */}
          {dashboardData && (
            <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
              <Col xs={24} lg={12}>
                <Card
                  loading={loading}
                  title={
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <ShopOutlined style={{ marginRight: 8, color: token.colorPrimary }} />
                      <span>Hiệu suất công ty</span>
                    </div>
                  }
                  extra={
                    <Space>
                      <Text type="secondary">Các công ty có hiệu suất tốt nhất</Text>
                      <Tooltip title="Tải xuống dữ liệu">
                        <Button type="text" icon={<DownloadOutlined />} size="small" />
                      </Tooltip>
                    </Space>
                  }
                  bordered={false}
                  className="dashboard-card"
                >
                  <Table
                    dataSource={dashboardData.companyPerformance}
                    columns={companyColumns}
                    pagination={false}
                    rowKey="companyName"
                    size="middle"
                    loading={loading}
                  />
                </Card>
              </Col>
              <Col xs={24} lg={12}>
                <Card
                  loading={loading}
                  title={
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <EyeOutlined style={{ marginRight: 8, color: token.colorPrimary }} />
                      <span>Tin tuyển dụng xem nhiều nhất</span>
                    </div>
                  }
                  extra={
                    <Space>
                      <Text type="secondary">Các tin có lượt xem và ứng tuyển cao nhất</Text>
                      <Tooltip title="Tải xuống dữ liệu">
                        <Button type="text" icon={<DownloadOutlined />} size="small" />
                      </Tooltip>
                    </Space>
                  }
                  bordered={false}
                  className="dashboard-card"
                >
                  <Table
                    dataSource={dashboardData.mostViewedJobs}
                    columns={jobsColumns}
                    pagination={false}
                    rowKey="jobTitle"
                    size="middle"
                    loading={loading}
                  />
                </Card>
              </Col>
            </Row>
          )}

          {/* Popular Job Fields and Recent Activities */}
          {dashboardData && (
            <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
              <Col xs={24} lg={12}>
                <Card
                  loading={loading}
                  title={
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <BarChartOutlined style={{ marginRight: 8, color: token.colorPrimary }} />
                      <span>Lĩnh vực phổ biến</span>
                    </div>
                  }
                  extra={
                    <Space>
                      <Text type="secondary">Các lĩnh vực có nhiều tin tuyển dụng nhất</Text>
                      <Tooltip title="Tải xuống dữ liệu">
                        <Button type="text" icon={<DownloadOutlined />} size="small" />
                      </Tooltip>
                    </Space>
                  }
                  bordered={false}
                  className="dashboard-card"
                >
                  <Space direction="vertical" style={{ width: "100%" }}>
                    {dashboardData.popularJobFields.map((field, index) => (
                      <div key={field.field}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                          <Space>
                            <div
                              style={{
                                width: 16,
                                height: 16,
                                borderRadius: "4px",
                                backgroundColor:
                                  index === 0
                                    ? token.colorPrimary
                                    : index === 1
                                      ? token.colorInfo
                                      : index === 2
                                        ? token.colorSuccess
                                        : token.colorWarning,
                              }}
                            ></div>
                            <Text strong>{field.field}</Text>
                          </Space>
                          <Text strong>{field.count} tin</Text>
                        </div>
                        <Progress
                          percent={Math.round(
                            (field.count / Math.max(...dashboardData.popularJobFields.map((f) => f.count))) * 100,
                          )}
                          showInfo={false}
                          strokeColor={
                            index === 0
                              ? token.colorPrimary
                              : index === 1
                                ? token.colorInfo
                                : index === 2
                                  ? token.colorSuccess
                                  : token.colorWarning
                          }
                          size="large"
                        />
                      </div>
                    ))}
                  </Space>
                </Card>
              </Col>
              <Col xs={24} lg={12}>
                <Card
                  loading={loading}
                  title={
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <CalendarOutlined style={{ marginRight: 8, color: token.colorPrimary }} />
                      <span>Hoạt động gần đây</span>
                    </div>
                  }
                  extra={
                    <Space>
                      <Text type="secondary">Các hoạt động mới nhất trên hệ thống</Text>
                      <Tooltip title="Tải xuống dữ liệu">
                        <Button type="text" icon={<DownloadOutlined />} size="small" />
                      </Tooltip>
                    </Space>
                  }
                  bordered={false}
                  className="dashboard-card"
                >
                  <List
                    itemLayout="horizontal"
                    dataSource={dashboardData.recentActivities}
                    renderItem={(activity) => (
                      <List.Item>
                        <List.Item.Meta
                          avatar={
                            <Avatar
                              icon={getActivityIcon(activity.type)}
                              style={{ backgroundColor: token.colorBgElevated }}
                            />
                          }
                          title={<Text strong>{activity.message}</Text>}
                          description={
                            <Space>
                              <CalendarOutlined style={{ fontSize: "12px" }} />
                              <Text type="secondary">{formatDate(activity.createAt)}</Text>
                            </Space>
                          }
                        />
                      </List.Item>
                    )}
                  />
                </Card>
              </Col>
            </Row>
          )}
        </Content>
      </Layout>

      {/* Add custom styles */}
      <style jsx global>{`
        .dashboard-card {
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
          border-radius: 8px;
          transition: all 0.3s ease;
        }
        
        .dashboard-card:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }
      `}</style>
    </Layout>
  )
}

export default Home

