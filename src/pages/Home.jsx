"use client"

import { useState, useEffect } from "react"
import {
  Card,
  Col,
  Row,
  Statistic,
  Typography,
  Select,
  DatePicker,
  List,
  Tabs,
  Button,
  Tooltip,
  Dropdown,
  Space,
  Menu,
  Skeleton,
  Avatar,
  Tag,
} from "antd"
import {
  FileTextTwoTone,
  UserAddOutlined,
  ShopTwoTone,
  BarChartOutlined,
  EyeOutlined,
  ReloadOutlined,
  CalendarOutlined,
  RiseOutlined,
  FallOutlined,
  FilterOutlined,
  DownOutlined,
  BellOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  DashboardOutlined,
  DownloadOutlined,
  PieChartOutlined,
  LineChartOutlined,
  AreaChartOutlined,
  TeamOutlined,
  FireOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts"
import moment from "moment"
import "./Home.css"

const { Title, Text } = Typography
const { Option } = Select
const { RangePicker } = DatePicker
const { TabPane } = Tabs

function Home() {
  const [dateRange, setDateRange] = useState(null)
  const [industryFilter, setIndustryFilter] = useState("all")
  const [timeFrame, setTimeFrame] = useState("week")
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  const [showFilters, setShowFilters] = useState(false)

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
      console.log(dateRange, industryFilter, filterByDateRange)
    }, 1000)
    return () => clearTimeout(timer)
  }, [dateRange, industryFilter])

  // Dữ liệu mẫu
  const jobs = [
    {
      id: 1,
      title: "Frontend Developer",
      industry: "CNTT",
      status: "open",
      createAt: "2025-03-01",
      company: "FPT Software",
      applications: 12,
    },
    {
      id: 2,
      title: "Backend Developer",
      industry: "CNTT",
      status: "closed",
      createAt: "2025-02-15",
      company: "VNG Corporation",
      applications: 8,
    },
    {
      id: 3,
      title: "Data Engineer",
      industry: "CNTT",
      status: "open",
      createAt: "2025-03-10",
      company: "Tiki",
      applications: 5,
    },
    {
      id: 4,
      title: "UI/UX Designer",
      industry: "Thiết kế",
      status: "expired",
      createAt: "2025-01-20",
      company: "FPT Software",
      applications: 15,
    },
    {
      id: 5,
      title: "Marketing Manager",
      industry: "Marketing",
      status: "open",
      createAt: "2025-03-15",
      company: "VNG Corporation",
      applications: 7,
    },
  ]

  const candidates = [
    {
      id: 1,
      name: "Nguyen Van A",
      appliedIndustry: "CNTT",
      status: "accepted",
      createAt: "2025-03-30T10:00:00.000Z",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      id: 2,
      name: "Tran Thi B",
      appliedIndustry: "CNTT",
      status: "pending",
      createAt: "2025-03-30T12:00:00.000Z",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      id: 3,
      name: "Le Van C",
      appliedIndustry: "Marketing",
      status: "rejected",
      createAt: "2025-03-29T09:00:00.000Z",
      avatar: "https://randomuser.me/api/portraits/men/67.jpg",
    },
    {
      id: 4,
      name: "Pham Thi D",
      appliedIndustry: "Thiết kế",
      status: "accepted",
      createAt: "2025-03-28T14:00:00.000Z",
      avatar: "https://randomuser.me/api/portraits/women/17.jpg",
    },
  ]

  const companies = [
    {
      id: 1,
      name: "FPT Software",
      industry: "CNTT",
      createAt: "2025-03-01",
      logo: "https://logo.clearbit.com/fpt.com.vn",
    },
    {
      id: 2,
      name: "VNG Corporation",
      industry: "CNTT",
      createAt: "2025-03-15",
      logo: "https://logo.clearbit.com/vng.com.vn",
    },
    { id: 3, name: "Tiki", industry: "Thương mại", createAt: "2025-02-20", logo: "https://logo.clearbit.com/tiki.vn" },
  ]

  const users = [
    { id: 1, email: "user1@example.com", isActive: true, createAt: "2025-01-10", lastLogin: "2025-03-30" },
    { id: 2, email: "user2@example.com", isActive: false, createAt: "2025-02-05", lastLogin: "2025-03-25" },
    { id: 3, email: "user3@example.com", isActive: true, createAt: "2025-03-01", lastLogin: "2025-03-29" },
    { id: 4, email: "user4@example.com", isActive: true, createAt: "2025-03-15", lastLogin: "2025-03-30" },
  ]

  const pageViews = [
    { date: "27/03", views: 120, users: 80 },
    { date: "28/03", views: 150, users: 95 },
    { date: "29/03", views: 200, users: 120 },
    { date: "30/03", views: 180, users: 110 },
    { date: "31/03", views: 220, users: 140 },
    { date: "01/04", views: 250, users: 160 },
    { date: "02/04", views: 210, users: 130 },
  ]

  const notifications = [
    {
      id: 1,
      message: "Công việc 'Frontend Developer' vừa được đăng",
      time: "2025-03-30T09:00:00.000Z",
      type: "job",
      icon: <FileTextTwoTone twoToneColor="#1890ff" />,
    },
    {
      id: 2,
      message: "Ứng viên 'Nguyen Van A' ứng tuyển vào 'CNTT'",
      time: "2025-03-30T10:00:00.000Z",
      type: "candidate",
      icon: <UserAddOutlined style={{ color: "#52c41a" }} />,
    },
    {
      id: 3,
      message: "Công ty 'Tiki' vừa đăng ký",
      time: "2025-03-29T15:00:00.000Z",
      type: "company",
      icon: <ShopTwoTone twoToneColor="#fa8c16" />,
    },
    {
      id: 4,
      message: "Ứng viên 'Tran Thi B' được chấp nhận vào vị trí 'Backend Developer'",
      time: "2025-03-29T11:00:00.000Z",
      type: "success",
      icon: <CheckCircleOutlined style={{ color: "#52c41a" }} />,
    },
    {
      id: 5,
      message: "Công việc 'UI/UX Designer' sắp hết hạn",
      time: "2025-03-28T14:00:00.000Z",
      type: "warning",
      icon: <ClockCircleOutlined style={{ color: "#faad14" }} />,
    },
  ]

  // Dữ liệu mẫu cho biểu đồ
  const jobPostingData = [
    { month: "Tháng 1", CNTT: 10, "Thiết kế": 5, Marketing: 2 },
    { month: "Tháng 2", CNTT: 15, "Thiết kế": 8, Marketing: 3 },
    { month: "Tháng 3", CNTT: 25, "Thiết kế": 10, Marketing: 5 },
  ]

  const candidateTrendData = [
    { date: "27/03", CNTT: 3, "Thiết kế": 1, Marketing: 1 },
    { date: "28/03", CNTT: 5, "Thiết kế": 2, Marketing: 2 },
    { date: "29/03", CNTT: 8, "Thiết kế": 3, Marketing: 4 },
    { date: "30/03", CNTT: 10, "Thiết kế": 4, Marketing: 5 },
    { date: "31/03", CNTT: 12, "Thiết kế": 5, Marketing: 6 },
    { date: "01/04", CNTT: 15, "Thiết kế": 7, Marketing: 8 },
    { date: "02/04", CNTT: 18, "Thiết kế": 9, Marketing: 10 },
  ]

  const jobStatusData = [
    { name: "Đang mở", value: jobs.filter((j) => j.status === "open").length },
    { name: "Đã đóng", value: jobs.filter((j) => j.status === "closed").length },
    { name: "Hết hạn", value: jobs.filter((j) => j.status === "expired").length },
  ]

  const industryDemandData = [
    { name: "CNTT", value: candidates.filter((c) => c.appliedIndustry === "CNTT").length },
    { name: "Thiết kế", value: candidates.filter((c) => c.appliedIndustry === "Thiết kế").length },
    { name: "Marketing", value: candidates.filter((c) => c.appliedIndustry === "Marketing").length },
    { name: "Thương mại", value: candidates.filter((c) => c.appliedIndustry === "Thương mại").length },
  ]

  const userRegistrationData = [
    { month: "Tháng 1", users: 5 },
    { month: "Tháng 2", users: 8 },
    { month: "Tháng 3", users: 15 },
  ]

  const applicationSuccessData = [
    { name: "Thành công", value: candidates.filter((c) => c.status === "accepted").length },
    { name: "Đang chờ", value: candidates.filter((c) => c.status === "pending").length },
    { name: "Bị từ chối", value: candidates.filter((c) => c.status === "rejected").length },
  ]

  // Dữ liệu mới cho biểu đồ khu vực
  const applicationTrendData = [
    { date: "27/03", applications: 5, interviews: 2, hires: 1 },
    { date: "28/03", applications: 8, interviews: 3, hires: 1 },
    { date: "29/03", applications: 12, interviews: 5, hires: 2 },
    { date: "30/03", applications: 15, interviews: 7, hires: 3 },
    { date: "31/03", applications: 18, interviews: 8, hires: 4 },
    { date: "01/04", applications: 22, interviews: 10, hires: 5 },
    { date: "02/04", applications: 25, interviews: 12, hires: 6 },
  ]

  // Dữ liệu mới cho top công việc
  const topJobs = [
    { id: 1, title: "Frontend Developer", applications: 12, company: "FPT Software", trend: "up" },
    { id: 2, title: "UI/UX Designer", applications: 15, company: "FPT Software", trend: "up" },
    { id: 3, title: "Marketing Manager", applications: 7, company: "VNG Corporation", trend: "down" },
    { id: 4, title: "Data Engineer", applications: 5, company: "Tiki", trend: "up" },
    { id: 5, title: "Backend Developer", applications: 8, company: "VNG Corporation", trend: "down" },
  ]
    .sort((a, b) => b.applications - a.applications)
    .slice(0, 5)

  const COLORS = ["#1890ff", "#52c41a", "#ff4d4f", "#fa8c16", "#722ed1"]

  // Thống kê
  const stats = [
    {
      title: "Công việc đang mở",
      value: jobs.filter((job) => job.status === "open").length,
      icon: <FileTextTwoTone twoToneColor="#1890ff" style={{ fontSize: "32px" }} />,
      color: "#1890ff",
      change: "+15%",
      trend: "up",
      suffix: "việc làm",
    },
    {
      title: "Ứng viên mới hôm nay",
      value: candidates.filter((c) => new Date(c.createAt).toDateString() === new Date().toDateString()).length,
      icon: <UserAddOutlined style={{ fontSize: "32px", color: "#52c41a" }} />,
      color: "#52c41a",
      change: "+8%",
      trend: "up",
      suffix: "ứng viên",
    },
    {
      title: "Công ty đăng ký",
      value: companies.length,
      icon: <ShopTwoTone twoToneColor="#fa8c16" style={{ fontSize: "32px" }} />,
      color: "#fa8c16",
      change: "+5%",
      trend: "up",
      suffix: "công ty",
    },
    {
      title: "Người dùng hoạt động",
      value: users.filter((user) => user.isActive).length,
      icon: <TeamOutlined style={{ fontSize: "32px", color: "#722ed1" }} />,
      color: "#722ed1",
      change: "+12%",
      trend: "up",
      suffix: "người dùng",
    },
  ]

  // Thống kê bổ sung
  const additionalStats = [
    {
      title: "Tổng lượt xem",
      value: pageViews.reduce((sum, item) => sum + item.views, 0),
      icon: <EyeOutlined style={{ fontSize: "32px", color: "#13c2c2" }} />,
      color: "#13c2c2",
      change: "+20%",
      trend: "up",
      suffix: "lượt xem",
    },
    {
      title: "Tỷ lệ chuyển đổi",
      value: 4.8,
      icon: <ThunderboltOutlined style={{ fontSize: "32px", color: "#eb2f96" }} />,
      color: "#eb2f96",
      change: "+2.5%",
      trend: "up",
      suffix: "%",
    },
    {
      title: "Tỷ lệ tuyển dụng",
      value: 35,
      icon: <FireOutlined style={{ fontSize: "32px", color: "#f5222d" }} />,
      color: "#f5222d",
      change: "-3%",
      trend: "down",
      suffix: "%",
    },
    {
      title: "Thời gian tuyển dụng TB",
      value: 18,
      icon: <ClockCircleOutlined style={{ fontSize: "32px", color: "#faad14" }} />,
      color: "#faad14",
      change: "-2 ngày",
      trend: "up",
      suffix: "ngày",
    },
  ]

  // Hàm lọc dữ liệu theo thời gian
  const filterByDateRange = (dates, data, key) => {
    if (!dates) return data
    const [start, end] = dates
    return data.filter((item) => moment(item[key]).isBetween(start, end, null, "[]"))
  }

  // Hàm xử lý thay đổi khung thời gian
  const handleTimeFrameChange = (value) => {
    setTimeFrame(value)
    // Ở đây có thể thêm logic để cập nhật dữ liệu biểu đồ dựa trên khung thời gian
  }

  // Hàm làm mới dữ liệu
  const handleRefresh = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }

  // Menu cho dropdown
  const timeFrameMenu = (
    <Menu onClick={({ key }) => handleTimeFrameChange(key)} selectedKeys={[timeFrame]}>
      <Menu.Item key="day">Hôm nay</Menu.Item>
      <Menu.Item key="week">Tuần này</Menu.Item>
      <Menu.Item key="month">Tháng này</Menu.Item>
      <Menu.Item key="quarter">Quý này</Menu.Item>
      <Menu.Item key="year">Năm nay</Menu.Item>
    </Menu>
  )

  // Render biểu đồ cột
  const renderBarChart = (data, dataKeys, colors, title) => (
    <Card
      title={
        <Space>
          <BarChartOutlined style={{ color: "#1890ff" }} />
          <span>{title}</span>
        </Space>
      }
      bordered={false}
      className="dashboard-card"
      extra={
        <Tooltip title="Tải xuống dữ liệu">
          <Button type="text" icon={<DownloadOutlined />} />
        </Tooltip>
      }
    >
      {loading ? (
        <Skeleton active paragraph={{ rows: 6 }} />
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <RechartsTooltip formatter={(value) => `${value} công việc`} />
            <Legend />
            {dataKeys.map((key, index) => (
              <Bar key={key} dataKey={key} fill={colors[index % colors.length]} name={key} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      )}
    </Card>
  )

  // Render biểu đồ đường
  const renderLineChart = (data, dataKeys, colors, title, tooltipFormatter) => (
    <Card
      title={
        <Space>
          <LineChartOutlined style={{ color: "#1890ff" }} />
          <span>{title}</span>
        </Space>
      }
      bordered={false}
      className="dashboard-card"
      extra={
        <Tooltip title="Tải xuống dữ liệu">
          <Button type="text" icon={<DownloadOutlined />} />
        </Tooltip>
      }
    >
      {loading ? (
        <Skeleton active paragraph={{ rows: 6 }} />
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <RechartsTooltip formatter={tooltipFormatter} />
            <Legend />
            {dataKeys.map((key, index) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={colors[index % colors.length]}
                name={key}
                activeDot={{ r: 8 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      )}
    </Card>
  )

  // Render biểu đồ khu vực
  const renderAreaChart = (data, dataKeys, colors, title, tooltipFormatter) => (
    <Card
      title={
        <Space>
          <AreaChartOutlined style={{ color: "#1890ff" }} />
          <span>{title}</span>
        </Space>
      }
      bordered={false}
      className="dashboard-card"
      extra={
        <Tooltip title="Tải xuống dữ liệu">
          <Button type="text" icon={<DownloadOutlined />} />
        </Tooltip>
      }
    >
      {loading ? (
        <Skeleton active paragraph={{ rows: 6 }} />
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <RechartsTooltip formatter={tooltipFormatter} />
            <Legend />
            {dataKeys.map((key, index) => (
              <Area
                key={key}
                type="monotone"
                dataKey={key}
                stackId="1"
                stroke={colors[index % colors.length]}
                fill={colors[index % colors.length]}
                name={key}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      )}
    </Card>
  )

  // Render biểu đồ tròn
  const renderPieChart = (data, title) => (
    <Card
      title={
        <Space>
          <PieChartOutlined style={{ color: "#1890ff" }} />
          <span>{title}</span>
        </Space>
      }
      bordered={false}
      className="dashboard-card"
      extra={
        <Tooltip title="Tải xuống dữ liệu">
          <Button type="text" icon={<DownloadOutlined />} />
        </Tooltip>
      }
    >
      {loading ? (
        <Skeleton active paragraph={{ rows: 6 }} />
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <RechartsTooltip
              formatter={(value, name) => [
                `${value} ${name === "Thành công" || name === "Đang chờ" || name === "Bị từ chối" ? "ứng viên" : name === "Đang mở" || name === "Đã đóng" || name === "Hết hạn" ? "công việc" : "ứng viên"}`,
                name,
              ]}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      )}
    </Card>
  )

  // Render danh sách thông báo
  const renderNotifications = () => (
    <Card
      title={
        <Space>
          <BellOutlined style={{ color: "#1890ff" }} />
          <span>Thông báo mới</span>
        </Space>
      }
      bordered={false}
      className="dashboard-card"
      extra={
        <Button type="link" size="small">
          Xem tất cả
        </Button>
      }
    >
      {loading ? (
        <Skeleton active avatar paragraph={{ rows: 2 }} />
      ) : (
        <List
          className="notification-list"
          itemLayout="horizontal"
          dataSource={notifications}
          renderItem={(item) => (
            <List.Item className="notification-item">
              <List.Item.Meta
                avatar={<Avatar icon={item.icon} className="notification-avatar" />}
                title={item.message}
                description={moment(item.time).fromNow()}
              />
            </List.Item>
          )}
        />
      )}
    </Card>
  )

  // Render danh sách top công việc
  const renderTopJobs = () => (
    <Card
      title={
        <Space>
          <FireOutlined style={{ color: "#ff4d4f" }} />
          <span>Top công việc được ứng tuyển</span>
        </Space>
      }
      bordered={false}
      className="dashboard-card"
      extra={
        <Button type="link" size="small">
          Xem tất cả
        </Button>
      }
    >
      {loading ? (
        <Skeleton active paragraph={{ rows: 5 }} />
      ) : (
        <List
          className="top-jobs-list"
          itemLayout="horizontal"
          dataSource={topJobs}
          renderItem={(item, index) => (
            <List.Item className="top-job-item">
              <List.Item.Meta
                avatar={
                  <Avatar className="rank-avatar" style={{ backgroundColor: index < 3 ? COLORS[index] : "#d9d9d9" }}>
                    {index + 1}
                  </Avatar>
                }
                title={
                  <Space>
                    <Text strong>{item.title}</Text>
                    {item.trend === "up" ? (
                      <Tag color="success" icon={<RiseOutlined />}>
                        Tăng
                      </Tag>
                    ) : (
                      <Tag color="error" icon={<FallOutlined />}>
                        Giảm
                      </Tag>
                    )}
                  </Space>
                }
                description={
                  <Space>
                    <Text type="secondary">{item.company}</Text>
                    <Text type="secondary">•</Text>
                    <Text type="secondary">{item.applications} ứng viên</Text>
                  </Space>
                }
              />
            </List.Item>
          )}
        />
      )}
    </Card>
  )

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="dashboard-title">
          <Title level={2}>
            <DashboardOutlined /> Dashboard Tuyển Dụng
          </Title>
          <Text type="secondary">Tổng quan về hoạt động tuyển dụng và ứng viên</Text>
        </div>
        <div className="dashboard-actions">
          <Space>
            <Tooltip title="Làm mới dữ liệu">
              <Button icon={<ReloadOutlined />} onClick={handleRefresh} loading={loading} />
            </Tooltip>
            <Tooltip title={showFilters ? "Ẩn bộ lọc" : "Hiện bộ lọc"}>
              <Button
                icon={<FilterOutlined />}
                type={showFilters ? "primary" : "default"}
                onClick={() => setShowFilters(!showFilters)}
              />
            </Tooltip>
            <Dropdown overlay={timeFrameMenu}>
              <Button>
                <Space>
                  <CalendarOutlined />
                  {timeFrame === "day" && "Hôm nay"}
                  {timeFrame === "week" && "Tuần này"}
                  {timeFrame === "month" && "Tháng này"}
                  {timeFrame === "quarter" && "Quý này"}
                  {timeFrame === "year" && "Năm nay"}
                  <DownOutlined />
                </Space>
              </Button>
            </Dropdown>
          </Space>
        </div>
      </div>

      {/* Bộ lọc */}
      {showFilters && (
        <Card className="filters-card">
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} md={8}>
              <Text strong>Khoảng thời gian:</Text>
              <RangePicker format="DD/MM/YYYY" onChange={setDateRange} style={{ width: "100%", marginTop: 8 }} />
            </Col>
            <Col xs={24} md={8}>
              <Text strong>Ngành nghề:</Text>
              <Select defaultValue="all" style={{ width: "100%", marginTop: 8 }} onChange={setIndustryFilter}>
                <Option value="all">Tất cả ngành nghề</Option>
                <Option value="CNTT">CNTT</Option>
                <Option value="Thiết kế">Thiết kế</Option>
                <Option value="Marketing">Marketing</Option>
                <Option value="Thương mại">Thương mại</Option>
              </Select>
            </Col>
            <Col xs={24} md={8} style={{ textAlign: "right" }}>
              <Button type="primary" style={{ marginRight: 8 }}>
                Áp dụng
              </Button>
              <Button
                onClick={() => {
                  setDateRange(null)
                  setIndustryFilter("all")
                }}
              >
                Đặt lại
              </Button>
            </Col>
          </Row>
        </Card>
      )}

      {/* Tabs */}
      <Tabs activeKey={activeTab} onChange={setActiveTab} className="dashboard-tabs">
        <TabPane
          tab={
            <span>
              <DashboardOutlined /> Tổng quan
            </span>
          }
          key="overview"
        >
          {/* Thẻ thống kê */}
          <Row gutter={[16, 16]} className="stats-row">
            {stats.map((stat, index) => (
              <Col xs={24} sm={12} md={6} key={index}>
                <Card hoverable bordered={false} className="stat-card">
                  <div className="stat-card-content">
                    <div className="stat-info">
                      <Statistic
                        title={stat.title}
                        value={stat.value}
                        valueStyle={{ color: stat.color }}
                        suffix={stat.suffix}
                      />
                      <div className="stat-trend">
                        {stat.trend === "up" ? (
                          <Text type="success">
                            <RiseOutlined /> {stat.change}
                          </Text>
                        ) : (
                          <Text type="danger">
                            <FallOutlined /> {stat.change}
                          </Text>
                        )}
                      </div>
                    </div>
                    <div className="stat-icon">{stat.icon}</div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>

          {/* Biểu đồ */}
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={12}>
              {renderAreaChart(
                applicationTrendData,
                ["applications", "interviews", "hires"],
                ["#1890ff", "#52c41a", "#fa8c16"],
                "Xu hướng ứng tuyển và tuyển dụng",
                (value) => `${value} người`,
              )}
            </Col>
            <Col xs={24} lg={12}>
              {renderLineChart(
                pageViews,
                ["views", "users"],
                ["#1890ff", "#722ed1"],
                "Lượt truy cập trang web",
                (value) => `${value} lượt`,
              )}
            </Col>
            <Col xs={24} lg={12}>
              {renderBarChart(
                jobPostingData,
                ["CNTT", "Thiết kế", "Marketing"],
                ["#1890ff", "#52c41a", "#ff4d4f"],
                "Xu hướng đăng việc theo ngành nghề",
              )}
            </Col>
            <Col xs={24} lg={12}>
              {renderPieChart(jobStatusData, "Phân bố trạng thái công việc")}
            </Col>
          </Row>

          {/* Danh sách và thông báo */}
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={12}>
              {renderTopJobs()}
            </Col>
            <Col xs={24} lg={12}>
              {renderNotifications()}
            </Col>
          </Row>
        </TabPane>

        <TabPane
          tab={
            <span>
              <FileTextTwoTone twoToneColor="#1890ff" /> Công việc
            </span>
          }
          key="jobs"
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={12}>
              {renderBarChart(
                jobPostingData,
                ["CNTT", "Thiết kế", "Marketing"],
                ["#1890ff", "#52c41a", "#ff4d4f"],
                "Xu hướng đăng việc theo ngành nghề",
              )}
            </Col>
            <Col xs={24} lg={12}>
              {renderPieChart(jobStatusData, "Phân bố trạng thái công việc")}
            </Col>
            <Col xs={24}>{renderTopJobs()}</Col>
          </Row>
        </TabPane>

        <TabPane
          tab={
            <span>
              <UserAddOutlined style={{ color: "#52c41a" }} /> Ứng viên
            </span>
          }
          key="candidates"
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={12}>
              {renderLineChart(
                candidateTrendData,
                ["CNTT", "Thiết kế", "Marketing"],
                ["#1890ff", "#52c41a", "#ff4d4f"],
                "Xu hướng ứng viên theo ngành nghề",
                (value) => `${value} ứng viên`,
              )}
            </Col>
            <Col xs={24} lg={12}>
              {renderPieChart(applicationSuccessData, "Tỷ lệ ứng tuyển thành công")}
            </Col>
            <Col xs={24} lg={12}>
              {renderAreaChart(
                applicationTrendData,
                ["applications", "interviews", "hires"],
                ["#1890ff", "#52c41a", "#fa8c16"],
                "Xu hướng ứng tuyển và tuyển dụng",
                (value) => `${value} người`,
              )}
            </Col>
            <Col xs={24} lg={12}>
              {renderPieChart(industryDemandData, "Nhu cầu ngành nghề của ứng viên")}
            </Col>
          </Row>
        </TabPane>

        <TabPane
          tab={
            <span>
              <BarChartOutlined /> Phân tích
            </span>
          }
          key="analytics"
        >
          {/* Thẻ thống kê bổ sung */}
          <Row gutter={[16, 16]} className="stats-row">
            {additionalStats.map((stat, index) => (
              <Col xs={24} sm={12} md={6} key={index}>
                <Card hoverable bordered={false} className="stat-card">
                  <div className="stat-card-content">
                    <div className="stat-info">
                      <Statistic
                        title={stat.title}
                        value={stat.value}
                        valueStyle={{ color: stat.color }}
                        suffix={stat.suffix}
                      />
                      <div className="stat-trend">
                        {stat.trend === "up" ? (
                          <Text type={stat.title === "Thời gian tuyển dụng TB" ? "danger" : "success"}>
                            <RiseOutlined /> {stat.change}
                          </Text>
                        ) : (
                          <Text type={stat.title === "Tỷ lệ tuyển dụng" ? "danger" : "success"}>
                            <FallOutlined /> {stat.change}
                          </Text>
                        )}
                      </div>
                    </div>
                    <div className="stat-icon">{stat.icon}</div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>

          <Row gutter={[16, 16]}>
            <Col xs={24} lg={12}>
              {renderLineChart(
                pageViews,
                ["views", "users"],
                ["#1890ff", "#722ed1"],
                "Lượt truy cập trang web",
                (value) => `${value} lượt`,
              )}
            </Col>
            <Col xs={24} lg={12}>
              {renderBarChart(userRegistrationData, ["users"], ["#722ed1"], "Số người đăng ký theo tháng")}
            </Col>
          </Row>
        </TabPane>
      </Tabs>
    </div>
  )
}

export default Home

