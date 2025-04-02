"use client"

import { useEffect, useState } from "react"
import {
  Space,
  Avatar,
  Button,
  Typography,
  Tooltip,
  Card,
  message,
  Switch,
  Modal,
  Form,
  Input,
  Rate,
  Flex,
  Tag,
  Divider,
  Row,
  Col,
  Statistic,
  Empty,
  Select,
  Badge,
  Tabs,
  List,
  Skeleton,
  Table,
} from "antd"
import {
  DeleteOutlined,
  EditOutlined,
  StarOutlined,
  StarFilled,
  CheckCircleOutlined,
  CloseCircleOutlined,
  UserOutlined,
  CalendarOutlined,
  MessageOutlined,
  FilterOutlined,
  ReloadOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons"
import feedbackService from "../../services/feedbackService"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import "dayjs/locale/vi"

dayjs.extend(relativeTime)
dayjs.locale("vi")

const { Text, Title, Paragraph } = Typography
const { Search } = Input
const { TabPane } = Tabs
const { Option } = Select

function Feedback() {
  const [feedbackList, setFeedbackList] = useState([])
  const [filteredFeedbackList, setFilteredFeedbackList] = useState([])
  const [tableLoading, setTableLoading] = useState(false)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false)
  const [currentFeedback, setCurrentFeedback] = useState(null)
  const [searchText, setSearchText] = useState("")
  const [ratingFilter, setRatingFilter] = useState(null)
  const [statusFilter, setStatusFilter] = useState(null)
  const [activeTab, setActiveTab] = useState("all")
  const [viewMode, setViewMode] = useState("card")
  const [form] = Form.useForm()

  // Statistics
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    averageRating: 0,
    fiveStars: 0,
    fourStars: 0,
    threeStars: 0,
    twoStars: 0,
    oneStars: 0,
  })

  const loadFeedbackList = async () => {
    setTableLoading(true)
    try {
      const resData = await feedbackService.getAllFeedback()
      setFeedbackList(resData.data)

      // Calculate statistics
      const total = resData.data.length
      const active = resData.data.filter((item) => item.isActive).length
      const inactive = total - active

      const totalRating = resData.data.reduce((sum, item) => sum + item.rating, 0)
      const averageRating = total > 0 ? (totalRating / total).toFixed(1) : 0

      const fiveStars = resData.data.filter((item) => item.rating === 5).length
      const fourStars = resData.data.filter((item) => item.rating === 4).length
      const threeStars = resData.data.filter((item) => item.rating === 3).length
      const twoStars = resData.data.filter((item) => item.rating === 2).length
      const oneStars = resData.data.filter((item) => item.rating === 1).length

      setStats({
        total,
        active,
        inactive,
        averageRating,
        fiveStars,
        fourStars,
        threeStars,
        twoStars,
        oneStars,
      })
    } catch (error) {
      console.error("Error fetching feedbacks:", error)
      message.error("Không thể tải danh sách phản hồi")
    } finally {
      setTableLoading(false)
    }
  }

  useEffect(() => {
    loadFeedbackList()
  }, [])

  // Filter feedbacks based on search, rating, status, and active tab
  useEffect(() => {
    let filtered = [...feedbackList]

    // Filter by active tab
    if (activeTab === "active") {
      filtered = filtered.filter((item) => item.isActive)
    } else if (activeTab === "inactive") {
      filtered = filtered.filter((item) => !item.isActive)
    }

    // Filter by search text
    if (searchText) {
      filtered = filtered.filter(
        (item) =>
          item.userDict.fullName.toLowerCase().includes(searchText.toLowerCase()) ||
          item.content.toLowerCase().includes(searchText.toLowerCase()),
      )
    }

    // Filter by rating
    if (ratingFilter !== null) {
      filtered = filtered.filter((item) => item.rating === ratingFilter)
    }

    // Filter by status
    if (statusFilter !== null) {
      filtered = filtered.filter((item) => item.isActive === statusFilter)
    }

    setFilteredFeedbackList(filtered)
  }, [feedbackList, searchText, ratingFilter, statusFilter, activeTab])

  const updateFeedbackStatus = async (id, isActive) => {
    try {
      await feedbackService.updateFeedbackStatus(id, isActive)
      setFeedbackList((prevList) =>
        prevList.map((feedback) => (feedback.id === id ? { ...feedback, isActive } : feedback)),
      )
      message.success(`Phản hồi đã được ${isActive ? "kích hoạt" : "vô hiệu hóa"} thành công.`)
    } catch (error) {
      console.error("Error updating feedback status:", error)
      message.error("Không thể cập nhật trạng thái phản hồi")
    }
  }

  const handleToggleFeedback = (checked, record) => {
    // Optimistically update UI
    setFeedbackList((prevList) =>
      prevList.map((feedback) => (feedback.id === record.id ? { ...feedback, isActive: checked } : feedback)),
    )
    updateFeedbackStatus(record.id, checked)
  }

  const handleEditFeedback = (record) => {
    setCurrentFeedback(record)
    form.setFieldsValue({
      content: record.content,
      rating: record.rating,
    })
    setIsModalVisible(true)
  }

  const handleUpdateFeedback = async (values) => {
    try {
      await feedbackService.updateFeedback(currentFeedback.id, values)
      setFeedbackList((prevList) =>
        prevList.map((feedback) => (feedback.id === currentFeedback.id ? { ...feedback, ...values } : feedback)),
      )
      message.success("Phản hồi đã được cập nhật thành công.")
      setIsModalVisible(false)
    } catch (error) {
      console.error("Error updating feedback:", error)
      message.error("Không thể cập nhật phản hồi")
    }
  }

  const handleDeleteFeedback = async () => {
    try {
      await feedbackService.deleteFeedback(currentFeedback.id)
      setFeedbackList((prevList) => prevList.filter((feedback) => feedback.id !== currentFeedback.id))
      message.success("Phản hồi đã được xóa thành công.")
      setIsDeleteModalVisible(false)
    } catch (error) {
      console.error("Error deleting feedback:", error)
      message.error("Không thể xóa phản hồi")
    }
  }

  const showDeleteConfirm = (record) => {
    setCurrentFeedback(record)
    setIsDeleteModalVisible(true)
  }

  const resetFilters = () => {
    setSearchText("")
    setRatingFilter(null)
    setStatusFilter(null)
    setActiveTab("all")
  }

  // Render rating stars
  const renderRating = (rating) => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      stars.push(
        i <= rating ? (
          <StarFilled key={i} style={{ color: "#fadb14", fontSize: 16 }} />
        ) : (
          <StarOutlined key={i} style={{ color: "#d9d9d9", fontSize: 16 }} />
        ),
      )
    }
    return <Space>{stars}</Space>
  }

  // Render feedback cards
  const renderFeedbackCards = () => {
    if (filteredFeedbackList.length === 0) {
      return (
        <Empty
          description="Không tìm thấy phản hồi nào"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          style={{ margin: "48px 0" }}
        />
      )
    }

    return (
      <List
        grid={{ gutter: 16, xs: 1, sm: 1, md: 2, lg: 3, xl: 3, xxl: 4 }}
        dataSource={filteredFeedbackList}
        renderItem={(item) => (
          <List.Item>
            <Card
              hoverable
              className={`feedback-card ${!item.isActive ? "inactive-card" : ""}`}
              actions={[
                <Tooltip title={item.isActive ? "Vô hiệu hóa" : "Kích hoạt"} key="toggle">
                  <Switch
                    checked={item.isActive}
                    onChange={(checked) => handleToggleFeedback(checked, item)}
                    size="small"
                  />
                </Tooltip>,
                <Tooltip title="Chỉnh sửa" key="edit">
                  <EditOutlined key="edit" onClick={() => handleEditFeedback(item)} />
                </Tooltip>,
                <Tooltip title="Xóa" key="delete">
                  <DeleteOutlined key="delete" onClick={() => showDeleteConfirm(item)} />
                </Tooltip>,
              ]}
            >
              <Skeleton loading={tableLoading} active avatar>
                <div className="feedback-card-header">
                  <Flex align="center" gap="small">
                    <Badge dot status={item.isActive ? "success" : "default"} offset={[-2, 32]}>
                      <Avatar src={item.userDict.avatarUrl} size={40} icon={<UserOutlined />} />
                    </Badge>
                    <div>
                      <Text strong>{item.userDict.fullName}</Text>
                      <div>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          <CalendarOutlined style={{ marginRight: 4 }} />
                          {dayjs(item.createAt).format("DD/MM/YYYY HH:mm")}
                        </Text>
                      </div>
                    </div>
                  </Flex>
                  <div className="feedback-rating">{renderRating(item.rating)}</div>
                </div>
                <Divider style={{ margin: "12px 0" }} />
                <Paragraph
                  ellipsis={{ rows: 3, expandable: true, symbol: "Xem thêm" }}
                  className={!item.isActive ? "inactive-text" : ""}
                >
                  {item.content}
                </Paragraph>
                {!item.isActive && (
                  <Tag color="error" icon={<CloseCircleOutlined />} style={{ marginTop: 8 }}>
                    Đã vô hiệu hóa
                  </Tag>
                )}
              </Skeleton>
            </Card>
          </List.Item>
        )}
      />
    )
  }

  // Render feedback table
  const renderFeedbackTable = () => {
    const columns = [
      {
        title: "Người dùng",
        dataIndex: "userDict",
        key: "user",
        render: (userDict) => (
          <Space size="middle">
            <Avatar src={userDict.avatarUrl} icon={<UserOutlined />} />
            <Text>{userDict.fullName}</Text>
          </Space>
        ),
      },
      {
        title: "Nội dung",
        dataIndex: "content",
        key: "content",
        render: (content) => (
          <Paragraph ellipsis={{ rows: 2, expandable: true, symbol: "Xem thêm" }}>{content}</Paragraph>
        ),
      },
      {
        title: "Đánh giá",
        dataIndex: "rating",
        key: "rating",
        render: (rating) => renderRating(rating),
      },
      {
        title: "Thời gian",
        dataIndex: "createAt",
        key: "createAt",
        render: (createAt) => (
          <Text>
            <CalendarOutlined style={{ marginRight: 4 }} />
            {dayjs(createAt).format("DD/MM/YYYY HH:mm")}
          </Text>
        ),
      },
      {
        title: "Trạng thái",
        dataIndex: "isActive",
        key: "status",
        render: (isActive) => (
          <Tag
            color={isActive ? "success" : "error"}
            icon={isActive ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
          >
            {isActive ? "Đang hiển thị" : "Đã ẩn"}
          </Tag>
        ),
      },
      {
        title: "Hành động",
        key: "action",
        render: (_, record) => (
          <Space size="middle">
            <Switch
              checked={record.isActive}
              onChange={(checked) => handleToggleFeedback(checked, record)}
              size="small"
            />
            <Tooltip title="Chỉnh sửa">
              <Button icon={<EditOutlined />} type="text" onClick={() => handleEditFeedback(record)} />
            </Tooltip>
            <Tooltip title="Xóa">
              <Button icon={<DeleteOutlined />} type="text" danger onClick={() => showDeleteConfirm(record)} />
            </Tooltip>
          </Space>
        ),
      },
    ]

    return (
      <Card className="feedback-table-card">
        <Table
          loading={tableLoading}
          columns={columns}
          dataSource={filteredFeedbackList}
          rowKey="id"
          pagination={{ pageSize: 10, showSizeChanger: true, showTotal: (total) => `Tổng cộng ${total} phản hồi` }}
          rowClassName={(record) => (!record.isActive ? "inactive-row" : "")}
        />
      </Card>
    )
  }

  return (
    <div className="feedback-container">
      <Card className="feedback-header-card">
        <Flex justify="space-between" align="center" wrap="wrap" gap={16}>
          <Space direction="vertical" size={4}>
            <Title level={3} style={{ margin: 0 }}>
              <MessageOutlined /> Quản lý phản hồi
            </Title>
            <Text type="secondary">Quản lý tất cả phản hồi từ người dùng</Text>
          </Space>
          <Space>
            <Button icon={<ReloadOutlined />} onClick={loadFeedbackList}>
              Làm mới
            </Button>
            <Select
              value={viewMode}
              onChange={setViewMode}
              style={{ width: 120 }}
              options={[
                { value: "card", label: "Dạng thẻ" },
                { value: "table", label: "Dạng bảng" },
              ]}
            />
          </Space>
        </Flex>
      </Card>

      <Row gutter={[16, 16]} className="stats-row">
        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card">
            <Statistic
              title="Tổng số phản hồi"
              value={stats.total}
              prefix={<MessageOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card">
            <Statistic
              title="Đang hiển thị"
              value={stats.active}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card">
            <Statistic
              title="Đã ẩn"
              value={stats.inactive}
              prefix={<CloseCircleOutlined />}
              valueStyle={{ color: "#ff4d4f" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card">
            <Statistic
              title="Đánh giá trung bình"
              value={stats.averageRating}
              prefix={<StarFilled />}
              suffix="/ 5"
              valueStyle={{ color: "#faad14" }}
            />
          </Card>
        </Col>
      </Row>

      <Card className="feedback-filter-card">
        <Flex justify="space-between" align="center" wrap="wrap" gap={16}>
          <Space wrap>
            <Search
              placeholder="Tìm kiếm theo tên hoặc nội dung..."
              allowClear
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 300 }}
            />
            <Select
              placeholder="Lọc theo đánh giá"
              allowClear
              value={ratingFilter}
              onChange={setRatingFilter}
              style={{ width: 150 }}
            >
              <Option value={5}>5 sao</Option>
              <Option value={4}>4 sao</Option>
              <Option value={3}>3 sao</Option>
              <Option value={2}>2 sao</Option>
              <Option value={1}>1 sao</Option>
            </Select>
            <Select
              placeholder="Lọc theo trạng thái"
              allowClear
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: 150 }}
            >
              <Option value={true}>Đang hiển thị</Option>
              <Option value={false}>Đã ẩn</Option>
            </Select>
          </Space>
          {(searchText || ratingFilter !== null || statusFilter !== null) && (
            <Button icon={<FilterOutlined />} onClick={resetFilters}>
              Xóa bộ lọc
            </Button>
          )}
        </Flex>
      </Card>

      <Tabs activeKey={activeTab} onChange={setActiveTab} className="feedback-tabs">
        <TabPane
          tab={
            <span>
              <MessageOutlined /> Tất cả ({stats.total})
            </span>
          }
          key="all"
        />
        <TabPane
          tab={
            <span>
              <CheckCircleOutlined /> Đang hiển thị ({stats.active})
            </span>
          }
          key="active"
        />
        <TabPane
          tab={
            <span>
              <CloseCircleOutlined /> Đã ẩn ({stats.inactive})
            </span>
          }
          key="inactive"
        />
      </Tabs>

      <div className="feedback-rating-distribution">
        <Card title="Phân bố đánh giá" className="rating-distribution-card">
          <Flex vertical gap="small">
            <Flex align="center" justify="space-between">
              <Space>
                <StarFilled style={{ color: "#fadb14" }} /> 5
              </Space>
              <div className="rating-bar-container">
                <div
                  className="rating-bar"
                  style={{
                    width: `${stats.total > 0 ? (stats.fiveStars / stats.total) * 100 : 0}%`,
                    backgroundColor: "#52c41a",
                  }}
                />
              </div>
              <Text>{stats.fiveStars}</Text>
            </Flex>
            <Flex align="center" justify="space-between">
              <Space>
                <StarFilled style={{ color: "#fadb14" }} /> 4
              </Space>
              <div className="rating-bar-container">
                <div
                  className="rating-bar"
                  style={{
                    width: `${stats.total > 0 ? (stats.fourStars / stats.total) * 100 : 0}%`,
                    backgroundColor: "#1890ff",
                  }}
                />
              </div>
              <Text>{stats.fourStars}</Text>
            </Flex>
            <Flex align="center" justify="space-between">
              <Space>
                <StarFilled style={{ color: "#fadb14" }} /> 3
              </Space>
              <div className="rating-bar-container">
                <div
                  className="rating-bar"
                  style={{
                    width: `${stats.total > 0 ? (stats.threeStars / stats.total) * 100 : 0}%`,
                    backgroundColor: "#faad14",
                  }}
                />
              </div>
              <Text>{stats.threeStars}</Text>
            </Flex>
            <Flex align="center" justify="space-between">
              <Space>
                <StarFilled style={{ color: "#fadb14" }} /> 2
              </Space>
              <div className="rating-bar-container">
                <div
                  className="rating-bar"
                  style={{
                    width: `${stats.total > 0 ? (stats.twoStars / stats.total) * 100 : 0}%`,
                    backgroundColor: "#fa8c16",
                  }}
                />
              </div>
              <Text>{stats.twoStars}</Text>
            </Flex>
            <Flex align="center" justify="space-between">
              <Space>
                <StarFilled style={{ color: "#fadb14" }} /> 1
              </Space>
              <div className="rating-bar-container">
                <div
                  className="rating-bar"
                  style={{
                    width: `${stats.total > 0 ? (stats.oneStars / stats.total) * 100 : 0}%`,
                    backgroundColor: "#ff4d4f",
                  }}
                />
              </div>
              <Text>{stats.oneStars}</Text>
            </Flex>
          </Flex>
        </Card>
      </div>

      {viewMode === "card" ? renderFeedbackCards() : renderFeedbackTable()}

      {/* Edit Modal */}
      <Modal
        title="Chỉnh sửa phản hồi"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleUpdateFeedback}>
          <Form.Item name="content" label="Nội dung" rules={[{ required: true, message: "Vui lòng nhập nội dung" }]}>
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item name="rating" label="Đánh giá" rules={[{ required: true, message: "Vui lòng nhập đánh giá" }]}>
            <Rate count={5} />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button onClick={() => setIsModalVisible(false)}>Hủy</Button>
              <Button type="primary" htmlType="submit">
                Cập nhật
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        title={
          <Space>
            <ExclamationCircleOutlined style={{ color: "#ff4d4f" }} />
            Xác nhận xóa
          </Space>
        }
        open={isDeleteModalVisible}
        onCancel={() => setIsDeleteModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsDeleteModalVisible(false)}>
            Hủy
          </Button>,
          <Button key="delete" danger type="primary" onClick={handleDeleteFeedback}>
            Xóa
          </Button>,
        ]}
      >
        <p>Bạn có chắc chắn muốn xóa phản hồi này? Hành động này không thể hoàn tác.</p>
        {currentFeedback && (
          <Card size="small" style={{ marginTop: 16 }}>
            <Flex align="center" gap="small">
              <Avatar src={currentFeedback.userDict.avatarUrl} icon={<UserOutlined />} />
              <Text strong>{currentFeedback.userDict.fullName}</Text>
            </Flex>
            <Paragraph ellipsis={{ rows: 2 }} style={{ margin: "8px 0" }}>
              {currentFeedback.content}
            </Paragraph>
            <div>{renderRating(currentFeedback.rating)}</div>
          </Card>
        )}
      </Modal>

      <style jsx global>{`
        .feedback-container {
          padding: 24px;
          background-color: #f0f2f5;
          min-height: 100vh;
        }

        .feedback-header-card,
        .feedback-filter-card,
        .feedback-table-card,
        .stat-card,
        .rating-distribution-card {
          border-radius: 8px;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px rgba(0, 0, 0, 0.02);
          margin-bottom: 16px;
        }

        .stats-row {
          margin-bottom: 16px;
        }

        .stat-card {
          height: 100%;
          transition: all 0.3s ease;
        }

        .stat-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .feedback-tabs {
          margin-bottom: 16px;
          background: white;
          padding: 8px 16px 0;
          border-radius: 8px;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px rgba(0, 0, 0, 0.02);
        }

        .feedback-rating-distribution {
          margin-bottom: 16px;
        }

        .rating-bar-container {
          flex: 1;
          height: 16px;
          background-color: #f0f0f0;
          border-radius: 8px;
          margin: 0 16px;
          overflow: hidden;
        }

        .rating-bar {
          height: 100%;
          border-radius: 8px;
          transition: width 0.5s ease;
        }

        .feedback-card {
          height: 100%;
          transition: all 0.3s ease;
        }

        .feedback-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .feedback-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .feedback-rating {
          margin-left: 8px;
        }

        .inactive-card {
          background-color: #f9f9f9;
          opacity: 0.7;
        }

        .inactive-text {
          color: rgba(0, 0, 0, 0.45);
        }

        .inactive-row {
          background-color: #f9f9f9;
          opacity: 0.7;
        }

        /* Dark mode support */
        body.dark .feedback-container {
          background-color: #141414;
        }

        body.dark .feedback-header-card,
        body.dark .feedback-filter-card,
        body.dark .feedback-table-card,
        body.dark .stat-card,
        body.dark .rating-distribution-card,
        body.dark .feedback-tabs {
          background-color: #1f1f1f;
          border-color: #303030;
        }

        body.dark .rating-bar-container {
          background-color: #303030;
        }

        body.dark .inactive-card {
          background-color: #141414;
        }

        body.dark .inactive-row {
          background-color: #141414;
        }

        body.dark .inactive-text {
          color: rgba(255, 255, 255, 0.45);
        }
      `}</style>
    </div>
  )
}

export default Feedback

