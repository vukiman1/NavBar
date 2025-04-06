"use client"

import { useEffect, useState, useContext } from "react"
import {
  Card,
  Table,
  Input,
  Select,
  Tag,
  Space,
  DatePicker,
  Statistic,
  Row,
  Col,
  message,
  Tabs,
  Button,
  List,
  Avatar,
  Badge,
  Typography,
  Tooltip,
  Empty,
  Skeleton,
  Popconfirm,
  Radio,
} from "antd"
import {
  BellOutlined,
  SearchOutlined,
  CheckCircleOutlined,
  InfoCircleOutlined,
  WarningOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  EyeOutlined,
  CheckOutlined,
  FilterOutlined,
  ClockCircleOutlined,
  ReloadOutlined,
} from "@ant-design/icons"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import { DataContext } from "../../Context/DataContext"
import { fetchNotifications, markAsRead, markAsUnread, deleteNotification } from "./ui/notificationApi"
import "./notification.css"
import webService from "../../services/webService"

// Extend dayjs with relative time plugin
dayjs.extend(relativeTime)

const { Option } = Select
const { RangePicker } = DatePicker
const { Text } = Typography
const { TabPane } = Tabs

function Notification() {
  // const { themeStyle } = useContext(DataContext)
  const [notifications, setNotifications] = useState([])
  const [filteredNotifications, setFilteredNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)
  const [activeTab, setActiveTab] = useState("all")

  // State for search and filters
  const [globalSearch, setGlobalSearch] = useState("")
  const [filterType, setFilterType] = useState("")
  const [filterStatus, setFilterStatus] = useState("")
  const [dateRange, setDateRange] = useState([])
  const [showFilters, setShowFilters] = useState(false)

  // Load notifications from API
  const loadNotifications = async () => {
    try {
      setLoading(true)
      const resData = await webService.getAllNotification()
      const data = await fetchNotifications()
      // console.log(resData.data)
      // console.log(data)
      setNotifications(resData.data)
    } catch (error) {
      console.error("Error fetching notifications:", error)
      message.error("Không thể tải danh sách thông báo")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadNotifications()
  }, [refreshKey])

  // Filter notifications based on search and filters
  useEffect(() => {
    let filtered = [...notifications]

    // Filter by active tab
    if (activeTab === "unread") {
      filtered = filtered.filter((notif) => !notif.read)
    } else if (activeTab === "read") {
      filtered = filtered.filter((notif) => notif.read)
    }

    // Search by title or content
    if (globalSearch) {
      filtered = filtered.filter(
        (notif) =>
          notif.title.toLowerCase().includes(globalSearch.toLowerCase()) ||
          notif.message.toLowerCase().includes(globalSearch.toLowerCase()),
      )
    }

    // Filter by notification type
    if (filterType) {
      filtered = filtered.filter((notif) => notif.type === filterType)
    }

    // Filter by read status
    if (filterStatus) {
      const isRead = filterStatus === "read"
      filtered = filtered.filter((notif) => notif.read === isRead)
    }

    // Filter by date range
    if (dateRange && dateRange.length === 2) {
      const [start, end] = dateRange
      filtered = filtered.filter((notif) => dayjs(notif.date).isBetween(start, end, null, "[]"))
    }

    setFilteredNotifications(filtered)
  }, [notifications, globalSearch, filterType, filterStatus, dateRange, activeTab])

  // Handle mark as read
  const handleMarkAsRead = async (id) => {
    try {
      // await markAsRead(id)
      await webService.markAsReadNotification(id)
      setNotifications((prev) => prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)))
      message.success("Đã đánh dấu là đã đọc")
    } catch (error) {
      console.error("Error marking notification as read:", error)
      message.error("Không thể đánh dấu thông báo")
    }
  }

  // Handle mark as unread
  const handleMarkAsUnread = async (id) => {
    try {
      await webService.markAsReadNotification(id)
      setNotifications((prev) => prev.map((notif) => (notif.id === id ? { ...notif, read: false } : notif)))
      message.success("Đã đánh dấu là chưa đọc")
    } catch (error) {
      console.error("Error marking notification as unread:", error)
      message.error("Không thể đánh dấu thông báo")
    }
  }

  // Handle delete notification
  const handleDeleteNotification = async (id) => {
    try {
      await deleteNotification(id)
      setNotifications((prev) => prev.filter((notif) => notif.id !== id))
      message.success("Đã xóa thông báo")
    } catch (error) {
      console.error("Error deleting notification:", error)
      message.error("Không thể xóa thông báo")
    }
  }

  // Handle refresh
  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1)
  }

  // Reset all filters
  const resetFilters = () => {
    setGlobalSearch("")
    setFilterType("")
    setFilterStatus("")
    setDateRange([])
  }

  // Statistics
  const totalNotifications = notifications.length
  const unreadNotifications = notifications.filter((notif) => !notif.read).length
  const readNotifications = notifications.filter((notif) => notif.read).length

  // Get icon for notification type
  const getNotificationTypeIcon = (type) => {
    switch (type) {
      case "info":
        return <InfoCircleOutlined style={{ color: "#1890ff" }} />
      case "warning":
        return <WarningOutlined style={{ color: "#faad14" }} />
      case "error":
        return <CloseCircleOutlined style={{ color: "#f5222d" }} />
      case "success":
        return <CheckCircleOutlined style={{ color: "#52c41a" }} />
      default:
        return <InfoCircleOutlined style={{ color: "#1890ff" }} />
    }
  }

  // Get color for notification type
  const getNotificationTypeColor = (type) => {
    switch (type) {
      case "info":
        return "#1890ff"
      case "warning":
        return "#faad14"
      case "error":
        return "#f5222d"
      case "success":
        return "#52c41a"
      default:
        return "#1890ff"
    }
  }

  // Get label for notification type
  const getNotificationTypeLabel = (type) => {
    switch (type) {
      case "info":
        return "Thông tin"
      case "warning":
        return "Cảnh báo"
      case "error":
        return "Lỗi"
      case "success":
        return "Thành công"
      default:
        return "Thông tin"
    }
  }

  // Table columns
  const columns = [
    {
      title: "Hình ảnh",
      dataIndex: "imageUrl",
      key: "imageUrl",
      width: 80,
      render: (url) =>
        url ? (
          <Avatar shape="square" size={50} src={url} alt="notification" />
        ) : (
          <Avatar
            shape="square"
            size={50}
            icon={getNotificationTypeIcon("info")}
            style={{ backgroundColor: "#f0f2f5" }}
          />
        ),
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
      render: (title, record) => (
        <Space direction="vertical" size={0}>
          <Space>
            {!record.read && <Badge status="processing" color="#1890ff" />}
            <Text strong>{title}</Text>
          </Space>
          <Text type="secondary" style={{ fontSize: "12px" }}>
            <ClockCircleOutlined style={{ marginRight: 4 }} />
            {dayjs(record.date).fromNow()}
          </Text>
        </Space>
      ),
    },
    {
      title: "Loại",
      dataIndex: "type",
      key: "type",
      width: 120,
      render: (type) => (
        <Tag icon={getNotificationTypeIcon(type)} color={getNotificationTypeColor(type)}>
          {getNotificationTypeLabel(type)}
        </Tag>
      ),
    },
    {
      title: "Nội dung",
      dataIndex: "message",
      key: "message",
      ellipsis: true,
    },
    {
      title: "Ngày",
      dataIndex: "date",
      key: "date",
      width: 150,
      render: (date) => dayjs(date).format("DD/MM/YYYY HH:mm"),
    },
    {
      title: "Trạng thái",
      dataIndex: "read",
      key: "read",
      width: 120,
      render: (read) =>
        read ? (
          <Tag color="success" icon={<CheckOutlined />}>
            Đã đọc
          </Tag>
        ) : (
          <Tag color="error">Chưa đọc</Tag>
        ),
    },
    {
      title: "Hành động",
      key: "action",
      width: 150,
      render: (_, record) => (
        <Space size="small">
          {record.read ? (
            <Tooltip title="Đánh dấu chưa đọc">
              <Button type="text" icon={<EyeOutlined />} size="small" onClick={() => handleMarkAsUnread(record.id)} />
            </Tooltip>
          ) : (
            <Tooltip title="Đánh dấu đã đọc">
              <Button type="text" icon={<CheckOutlined />} size="small" onClick={() => handleMarkAsRead(record.id)} />
            </Tooltip>
          )}
          <Tooltip title="Xóa">
            <Popconfirm
              title="Bạn có chắc chắn muốn xóa thông báo này?"
              onConfirm={() => handleDeleteNotification(record.id)}
              okText="Có"
              cancelText="Không"
            >
              <Button type="text" danger icon={<DeleteOutlined />} size="small" />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ]

  return (
    <Card
      title={
        <Space>
          <BellOutlined style={{ fontSize: "20px", color: "#1890ff" }} />
          <span>Quản lý thông báo</span>
        </Space>
      }
      extra={
        <Space>
          <Tooltip title="Làm mới">
            <Button icon={<ReloadOutlined />} onClick={handleRefresh} loading={loading} />
          </Tooltip>
          <Tooltip title={showFilters ? "Ẩn bộ lọc" : "Hiện bộ lọc"}>
            <Button
              icon={<FilterOutlined />}
              type={showFilters ? "primary" : "default"}
              onClick={() => setShowFilters(!showFilters)}
            />
          </Tooltip>
        </Space>
      }
      className="notification-card"
    >
      {/* Statistics */}
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={8}>
          <Card className="statistic-card">
            <Statistic
              title="Tổng số thông báo"
              value={totalNotifications}
              prefix={<BellOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card className="statistic-card">
            <Statistic
              title="Thông báo chưa đọc"
              value={unreadNotifications}
              valueStyle={{ color: "#f5222d" }}
              prefix={<Badge status="error" />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card className="statistic-card">
            <Statistic
              title="Thông báo đã đọc"
              value={readNotifications}
              valueStyle={{ color: "#52c41a" }}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      {showFilters && (
        <Card className="filters-card" style={{ marginBottom: 16 }}>
          <Space wrap style={{ width: "100%", justifyContent: "space-between" }}>
            <Space wrap>
              <Input
                placeholder="Tìm kiếm theo tiêu đề hoặc nội dung..."
                prefix={<SearchOutlined />}
                allowClear
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                style={{ width: 300 }}
              />
              <Select
                placeholder="Lọc theo loại thông báo"
                allowClear
                value={filterType || undefined}
                onChange={(value) => setFilterType(value)}
                style={{ width: 180 }}
              >
                <Option value="info">Thông tin</Option>
                <Option value="warning">Cảnh báo</Option>
                <Option value="error">Lỗi</Option>
                <Option value="success">Thành công</Option>
              </Select>
              <Select
                placeholder="Lọc trạng thái"
                allowClear
                value={filterStatus || undefined}
                onChange={(value) => setFilterStatus(value)}
                style={{ width: 150 }}
              >
                <Option value="read">Đã đọc</Option>
                <Option value="unread">Chưa đọc</Option>
              </Select>
              <RangePicker
                placeholder={["Ngày bắt đầu", "Ngày kết thúc"]}
                value={dateRange}
                onChange={(dates) => setDateRange(dates)}
              />
            </Space>
            <Button onClick={resetFilters}>Xóa bộ lọc</Button>
          </Space>
        </Card>
      )}

      {/* Tabs and Notification List */}
      <Tabs activeKey={activeTab} onChange={setActiveTab} className="notification-tabs">
        <TabPane
          tab={
            <span>
              <BellOutlined /> Tất cả ({totalNotifications})
            </span>
          }
          key="all"
        >
          <NotificationList
            notifications={filteredNotifications}
            loading={loading}
            columns={columns}
            onMarkAsRead={handleMarkAsRead}
            onMarkAsUnread={handleMarkAsUnread}
            onDelete={handleDeleteNotification}
          />
        </TabPane>
        <TabPane
          tab={
            <span>
              <Badge status="error" /> Chưa đọc ({unreadNotifications})
            </span>
          }
          key="unread"
        >
          <NotificationList
            notifications={filteredNotifications}
            loading={loading}
            columns={columns}
            onMarkAsRead={handleMarkAsRead}
            onMarkAsUnread={handleMarkAsUnread}
            onDelete={handleDeleteNotification}
          />
        </TabPane>
        <TabPane
          tab={
            <span>
              <CheckCircleOutlined /> Đã đọc ({readNotifications})
            </span>
          }
          key="read"
        >
          <NotificationList
            notifications={filteredNotifications}
            loading={loading}
            columns={columns}
            onMarkAsRead={handleMarkAsRead}
            onMarkAsUnread={handleMarkAsUnread}
            onDelete={handleDeleteNotification}
          />
        </TabPane>
      </Tabs>
    </Card>
  )
}

// Notification List Component
function NotificationList({ notifications, loading, columns, onMarkAsRead, onMarkAsUnread, onDelete }) {
  const [viewMode, setViewMode] = useState("card") // 'card' or 'table'

  const getNotificationTypeIcon = (type) => {
    switch (type) {
      case "info":
        return <InfoCircleOutlined style={{ color: "#1890ff" }} />
      case "warning":
        return <WarningOutlined style={{ color: "#faad14" }} />
      case "error":
        return <CloseCircleOutlined style={{ color: "#f5222d" }} />
      case "success":
        return <CheckCircleOutlined style={{ color: "#52c41a" }} />
      default:
        return <InfoCircleOutlined style={{ color: "#1890ff" }} />
    }
  }

  const getNotificationTypeColor = (type) => {
    switch (type) {
      case "info":
        return "#1890ff"
      case "warning":
        return "#faad14"
      case "error":
        return "#f5222d"
      case "success":
        return "#52c41a"
      default:
        return "#1890ff"
    }
  }

  const getNotificationTypeLabel = (type) => {
    switch (type) {
      case "info":
        return "Thông tin"
      case "warning":
        return "Cảnh báo"
      case "error":
        return "Lỗi"
      case "success":
        return "Thành công"
      default:
        return "Thông tin"
    }
  }

  if (loading) {
    return (
      <div style={{ padding: "20px 0" }}>
        <Skeleton active avatar paragraph={{ rows: 4 }} />
        <Skeleton active avatar paragraph={{ rows: 4 }} style={{ marginTop: 20 }} />
      </div>
    )
  }

  if (notifications.length === 0) {
    return (
      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Không có thông báo nào" style={{ margin: "40px 0" }} />
    )
  }

  return (
    <div className="notification-list-container">
      <div className="view-mode-toggle" style={{ marginBottom: 16, textAlign: "right" }}>
        <Space>
          <Text type="secondary">Chế độ xem:</Text>
          <Radio.Group value={viewMode} onChange={(e) => setViewMode(e.target.value)}>
            <Radio.Button value="card">Thẻ</Radio.Button>
            <Radio.Button value="table">Bảng</Radio.Button>
          </Radio.Group>
        </Space>
      </div>

      {viewMode === "card" ? (
        <List
          itemLayout="horizontal"
          dataSource={notifications}
          renderItem={(item) => (
            <List.Item
              key={item.id}
              className={`notification-item ${!item.read ? "unread" : ""}`}
              actions={[
                item.read ? (
                  <Button type="text" icon={<EyeOutlined />} size="small" onClick={() => onMarkAsUnread(item.id)}>
                    Đánh dấu chưa đọc
                  </Button>
                ) : (
                  <Button type="text" icon={<CheckOutlined />} size="small" onClick={() => onMarkAsRead(item.id)}>
                    Đánh dấu đã đọc
                  </Button>
                ),
                <Popconfirm
                  title="Bạn có chắc chắn muốn xóa thông báo này?"
                  onConfirm={() => onDelete(item.id)}
                  okText="Có"
                  cancelText="Không"
                >
                  <Button type="text" danger icon={<DeleteOutlined />} size="small">
                    Xóa
                  </Button>
                </Popconfirm>,
              ]}
            >
              <List.Item.Meta
                avatar={
                  item.imageUrl ? (
                    <Avatar size={48} src={item.imageUrl} />
                  ) : (
                    <Avatar
                      size={48}
                      icon={getNotificationTypeIcon(item.type)}
                      style={{
                        backgroundColor: `${getNotificationTypeColor(item.type)}15`,
                        color: getNotificationTypeColor(item.type),
                      }}
                    />
                  )
                }
                title={
                  <Space>
                    {!item.read && <Badge status="processing" color="#1890ff" />}
                    <Text strong>{item.title}</Text>
                    <Tag icon={getNotificationTypeIcon(item.type)} color={getNotificationTypeColor(item.type)}>
                      {getNotificationTypeLabel(item.type)}
                    </Tag>
                  </Space>
                }
                description={
                  <div>
                    <div className="notification-message">{item.message}</div>
                    <div className="notification-time">
                      <ClockCircleOutlined style={{ marginRight: 4 }} />
                      {dayjs(item.date).fromNow()} ({dayjs(item.date).format("DD/MM/YYYY HH:mm")})
                    </div>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      ) : (
        <Table
          columns={columns}
          dataSource={notifications}
          rowKey="id"
          rowClassName={(record) => (!record.read ? "unread-row" : "")}
          pagination={{
            defaultPageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50"],
            showTotal: (total) => `Tổng cộng ${total} thông báo`,
          }}
        />
      )}
    </div>
  )
}

export default Notification

