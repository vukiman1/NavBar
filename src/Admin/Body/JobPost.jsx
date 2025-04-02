"use client"

import { useEffect, useState } from "react"
import {
  Card,
  Table,
  Tag,
  Space,
  Typography,
  Button,
  Flex,
  Modal,
  message,
  Select,
  Input,
  Popconfirm,
  Avatar,
  Badge,
  Drawer,
  Divider,
  Statistic,
  Row,
  Col,
  Tabs,
  Empty,
  Dropdown,
  Menu,
} from "antd"
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  EyeOutlined,
  FireOutlined,
  ClockCircleOutlined,
  UserOutlined,
  DollarOutlined,
  EnvironmentOutlined,
  FilterOutlined,
  ReloadOutlined,
  PlusOutlined,
  BankOutlined,
  TeamOutlined,
  BookOutlined,
  EditOutlined,
  MoreOutlined,
  ExclamationCircleOutlined,
  GlobalOutlined,
  HomeOutlined,
  DownOutlined,
  UpOutlined,
  FileTextOutlined,
  ShareAltOutlined,
} from "@ant-design/icons"
import { Link } from "react-router-dom"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import "dayjs/locale/vi"
import jobService from "../../services/jobService"

dayjs.extend(relativeTime)
dayjs.locale("vi")

const { Title, Text, Paragraph } = Typography
const { Option } = Select
const { TabPane } = Tabs

// Helper function to format currency
const formatCurrency = (value) => {
  if (!value && value !== 0) return "Thương lượng"
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value)
}

// Helper function to get workplace type label
const getWorkplaceTypeLabel = (type) => {
  switch (type) {
    case 1:
      return { label: "Tại văn phòng", icon: <HomeOutlined /> }
    case 2:
      return { label: "Làm từ xa", icon: <GlobalOutlined /> }
    case 3:
      return { label: "Hỗn hợp", icon: <EnvironmentOutlined /> }
    default:
      return { label: "Không xác định", icon: <EnvironmentOutlined /> }
  }
}

// Helper function to get position label
const getPositionLabel = (position) => {
  const positions = {
    1: "Nhân viên",
    2: "Trưởng nhóm",
    3: "Quản lý",
    4: "Phó giám đốc",
    5: "Giám đốc",
  }
  return positions[position] || "Không xác định"
}

// Helper function to get academic level label
const getAcademicLevelLabel = (level) => {
  const levels = {
    1: "Trung cấp",
    2: "Cao đẳng",
    3: "Đại học",
    4: "Thạc sĩ",
    5: "Tiến sĩ",
  }
  return levels[level] || "Không xác định"
}

// Helper function to get job type label
const getJobTypeLabel = (type) => {
  const types = {
    1: "Toàn thời gian",
    2: "Bán thời gian",
    3: "Thực tập",
  }
  return types[type] || "Không xác định"
}

// Helper function to get status label and color
const getStatusInfo = (status) => {
  switch (status) {
    case 1:
      return { label: "Chờ duyệt", color: "warning", icon: <ClockCircleOutlined /> }
    case 2:
      return { label: "Từ chối", color: "error", icon: <CloseCircleOutlined /> }
    case 3:
      return { label: "Đã duyệt", color: "success", icon: <CheckCircleOutlined /> }
    default:
      return { label: "Không xác định", color: "default", icon: <ExclamationCircleOutlined /> }
  }
}

// Helper function to calculate days remaining
const getDaysRemaining = (deadline) => {
  if (!deadline) return null
  const today = dayjs()
  const deadlineDate = dayjs(deadline)
  const daysRemaining = deadlineDate.diff(today, "day")

  return daysRemaining
}

const JobPost = () => {
  const [jobList, setJobList] = useState([])
  const [tableLoading, setTableLoading] = useState(false)
  const [selectedJobId, setSelectedJobId] = useState(null)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isDetailDrawerVisible, setIsDetailDrawerVisible] = useState(false)
  const [selectedJob, setSelectedJob] = useState(null)
  const [filterDrawerVisible, setFilterDrawerVisible] = useState(false)
  const [activeFilters, setActiveFilters] = useState(0)
  const [expandedRowKeys, setExpandedRowKeys] = useState([])

  // Bộ lọc
  const [searchText, setSearchText] = useState("")
  const [approvalStatus, setApprovalStatus] = useState(null)
  const [recruitmentStatus, setRecruitmentStatus] = useState(null)
  const [positionFilter, setPositionFilter] = useState(null)
  const [workplaceTypeFilter, setWorkplaceTypeFilter] = useState(null)
  const [experienceFilter, setExperienceFilter] = useState(null)
  const [academicLevelFilter, setAcademicLevelFilter] = useState(null)
  const [jobTypeFilter, setJobTypeFilter] = useState(null)
  const [isHotFilter, setIsHotFilter] = useState(null)
  const [isUrgentFilter, setIsUrgentFilter] = useState(null)

  // Pagination
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  })

  const loadJobList = async () => {
    setTableLoading(true)
    try {
      const params = {
        search: searchText || undefined,
        approvalStatus: approvalStatus !== null ? approvalStatus : undefined,
        recruitmentStatus: recruitmentStatus !== null ? recruitmentStatus : undefined,
        position: positionFilter || undefined,
        typeOfWorkplace: workplaceTypeFilter || undefined,
        experience: experienceFilter || undefined,
        academicLevel: academicLevelFilter || undefined,
        jobType: jobTypeFilter || undefined,
        isHot: isHotFilter || undefined,
        isUrgent: isUrgentFilter || undefined,
        page: pagination.current,
        pageSize: pagination.pageSize,
      }

      // In a real application, you would use the API call with params:
      // const resData = await jobService.getAllJobPost(params);
      const resData = await jobService.getAllJobPost()

      // Apply filters manually since we're using mock data
      let filteredData = [...resData]

      if (searchText) {
        filteredData = filteredData.filter(
          (job) =>
            job.jobName.toLowerCase().includes(searchText.toLowerCase()) ||
            job.company?.companyName.toLowerCase().includes(searchText.toLowerCase()),
        )
      }

      if (approvalStatus !== null) {
        filteredData = filteredData.filter((job) => job.status === approvalStatus)
      }

      if (recruitmentStatus !== null) {
        filteredData = filteredData.filter((job) => job.isExpired === recruitmentStatus)
      }

      if (positionFilter) {
        filteredData = filteredData.filter((job) => job.position === positionFilter)
      }

      if (workplaceTypeFilter) {
        filteredData = filteredData.filter((job) => job.typeOfWorkplace === workplaceTypeFilter)
      }

      if (experienceFilter) {
        filteredData = filteredData.filter((job) => job.experience === experienceFilter)
      }

      if (academicLevelFilter) {
        filteredData = filteredData.filter((job) => job.academicLevel === academicLevelFilter)
      }

      if (jobTypeFilter) {
        filteredData = filteredData.filter((job) => job.jobType === jobTypeFilter)
      }

      if (isHotFilter !== null) {
        filteredData = filteredData.filter((job) => job.isHot === isHotFilter)
      }

      if (isUrgentFilter !== null) {
        filteredData = filteredData.filter((job) => job.isUrgent === isUrgentFilter)
      }

      setJobList(filteredData)

      // Count active filters
      let filterCount = 0
      if (searchText) filterCount++
      if (approvalStatus !== null) filterCount++
      if (recruitmentStatus !== null) filterCount++
      if (positionFilter) filterCount++
      if (workplaceTypeFilter) filterCount++
      if (experienceFilter) filterCount++
      if (academicLevelFilter) filterCount++
      if (jobTypeFilter) filterCount++
      if (isHotFilter !== null) filterCount++
      if (isUrgentFilter !== null) filterCount++
      setActiveFilters(filterCount)
    } catch (error) {
      console.error("Error fetching jobs:", error)
      message.error("Không thể tải danh sách tin tuyển dụng")
    } finally {
      setTableLoading(false)
    }
  }

  useEffect(() => {
    loadJobList()
  }, [
    searchText,
    approvalStatus,
    recruitmentStatus,
    positionFilter,
    workplaceTypeFilter,
    experienceFilter,
    academicLevelFilter,
    jobTypeFilter,
    isHotFilter,
    isUrgentFilter,
    pagination.current,
    pagination.pageSize,
  ])

  const handleTableChange = (pagination) => {
    setPagination(pagination)
  }

  const handleUpdateStatus = async (id, status) => {
    try {
      // In a real application, you would call an API
      // await jobService.updateJobStatus(id, status);

      // Update local state
      const updatedList = jobList.map((item) => {
        if (item.id === id) {
          return { ...item, status }
        }
        return item
      })

      setJobList(updatedList)
      message.success("Cập nhật trạng thái thành công")
    } catch (error) {
      console.error("Error updating status:", error)
      message.error("Không thể cập nhật trạng thái")
    }
  }

  const handleDelete = async () => {
    try {
      // In a real application, you would call an API
      // await jobService.deleteJobPost(selectedJobId);

      // Update local state
      const updatedList = jobList.filter((item) => item.id !== selectedJobId)
      setJobList(updatedList)

      setIsModalVisible(false)
      message.success("Xóa tin tuyển dụng thành công")
    } catch (error) {
      console.error("Error deleting job:", error)
      message.error("Không thể xóa tin tuyển dụng")
    }
  }

  const showDeleteConfirm = (id) => {
    setSelectedJobId(id)
    setIsModalVisible(true)
  }

  const handleStatusChange = (value, record) => {
    handleUpdateStatus(record.id, value)
  }

  const viewJobDetails = (record) => {
    setSelectedJob(record)
    setIsDetailDrawerVisible(true)
  }

  const resetFilters = () => {
    setSearchText("")
    setApprovalStatus(null)
    setRecruitmentStatus(null)
    setPositionFilter(null)
    setWorkplaceTypeFilter(null)
    setExperienceFilter(null)
    setAcademicLevelFilter(null)
    setJobTypeFilter(null)
    setIsHotFilter(null)
    setIsUrgentFilter(null)
    setPagination({
      current: 1,
      pageSize: 10,
    })
    message.success("Đã xóa tất cả bộ lọc")
  }

  const toggleRowExpand = (record) => {
    const key = record.id
    const expanded = expandedRowKeys.includes(key)
    const newExpandedKeys = expanded ? expandedRowKeys.filter((k) => k !== key) : [...expandedRowKeys, key]

    setExpandedRowKeys(newExpandedKeys)
  }

  const expandedRowRender = (record) => {
    return (
      <div style={{ padding: "16px 0" }}>
        <Row gutter={24}>
          <Col span={8}>
            <Card size="small" title="Thông tin cơ bản" bordered={false}>
              <Flex vertical gap="small">
                <div>
                  <Text type="secondary">Vị trí:</Text>
                  <div>
                    <Tag icon={<BankOutlined />}>{getPositionLabel(record.position)}</Tag>
                  </div>
                </div>
                <div>
                  <Text type="secondary">Kinh nghiệm:</Text>
                  <div>
                    <Tag icon={<TeamOutlined />}>{record.experience} năm</Tag>
                  </div>
                </div>
                <div>
                  <Text type="secondary">Học vấn:</Text>
                  <div>
                    <Tag icon={<BookOutlined />}>{getAcademicLevelLabel(record.academicLevel)}</Tag>
                  </div>
                </div>
                <div>
                  <Text type="secondary">Loại công việc:</Text>
                  <div>
                    <Tag icon={<ClockCircleOutlined />}>{getJobTypeLabel(record.jobType)}</Tag>
                  </div>
                </div>
              </Flex>
            </Card>
          </Col>
          <Col span={8}>
            <Card size="small" title="Thông tin liên hệ" bordered={false}>
              <Flex vertical gap="small">
                <div>
                  <Text type="secondary">Người liên hệ:</Text>
                  <div>
                    <Text strong>{record.contactPersonName}</Text>
                  </div>
                </div>
                <div>
                  <Text type="secondary">Email:</Text>
                  <div>
                    <a href={`mailto:${record.contactPersonEmail}`}>{record.contactPersonEmail}</a>
                  </div>
                </div>
                <div>
                  <Text type="secondary">Điện thoại:</Text>
                  <div>
                    <a href={`tel:${record.contactPersonPhone}`}>{record.contactPersonPhone}</a>
                  </div>
                </div>
              </Flex>
            </Card>
          </Col>
          <Col span={8}>
            <Card size="small" title="Thống kê" bordered={false}>
              <Flex vertical gap="small">
                <div>
                  <Text type="secondary">Lượt xem:</Text>
                  <div>
                    <Text strong>{record.views}</Text>
                  </div>
                </div>
                <div>
                  <Text type="secondary">Lượt chia sẻ:</Text>
                  <div>
                    <Text strong>{record.shares}</Text>
                  </div>
                </div>
                <div>
                  <Text type="secondary">Ngày tạo:</Text>
                  <div>
                    <Text>{dayjs(record.createAt).format("DD/MM/YYYY HH:mm")}</Text>
                  </div>
                </div>
                <div>
                  <Text type="secondary">Cập nhật lần cuối:</Text>
                  <div>
                    <Text>{dayjs(record.updateAt).format("DD/MM/YYYY HH:mm")}</Text>
                  </div>
                </div>
              </Flex>
            </Card>
          </Col>
        </Row>
        <div style={{ marginTop: 16, textAlign: "center" }}>
          <Space>
            <Link to={`/job-post/edit/${record.id}`}>
              <Button type="primary" icon={<EditOutlined />}>
                Chỉnh sửa chi tiết
              </Button>
            </Link>
            <Button type="default" icon={<EyeOutlined />} onClick={() => viewJobDetails(record)}>
              Xem chi tiết
            </Button>
            <Popconfirm
              title="Xoá tin tuyển dụng?"
              description="Bạn có chắc chắn muốn xoá tin này?"
              onConfirm={() => showDeleteConfirm(record.id)}
              okText="Xoá"
              cancelText="Huỷ"
              placement="top"
              okButtonProps={{ danger: true }}
            >
              <Button danger icon={<DeleteOutlined />}>
                Xóa tin
              </Button>
            </Popconfirm>
          </Space>
        </div>
      </div>
    )
  }

  const columns = [
    {
      title: "Tin tuyển dụng",
      key: "job",
      render: (_, record) => (
        <Flex align="center" gap="middle">
          <Avatar
            src={record.company?.companyImageUrl}
            size={64}
            shape="square"
            style={{ border: "1px solid #f0f0f0" }}
          />
          <Flex vertical>
            <Flex align="center" gap="small">
              <Text strong style={{ fontSize: 16, cursor: "pointer" }} onClick={() => toggleRowExpand(record)}>
                {record.jobName}
              </Text>
              {record.isHot && (
                <Tag icon={<FireOutlined />} color="volcano">
                  Hot
                </Tag>
              )}
              {record.isUrgent && (
                <Tag icon={<ClockCircleOutlined />} color="error">
                  Gấp
                </Tag>
              )}
            </Flex>

            <Text type="secondary" style={{ marginTop: 4 }}>
              {record.company?.companyName}
            </Text>

            <Space size={[0, 8]} wrap style={{ marginTop: 8 }}>
              <Tag icon={<UserOutlined />}>{record.quantity} người</Tag>
              <Tag icon={<DollarOutlined />}>
                {formatCurrency(record.salaryMin)} - {formatCurrency(record.salaryMax)}
              </Tag>
              <Tag icon={getWorkplaceTypeLabel(record.typeOfWorkplace).icon}>
                {getWorkplaceTypeLabel(record.typeOfWorkplace).label}
              </Tag>
            </Space>
          </Flex>
        </Flex>
      ),
      width: "40%",
    },
    {
      title: "Thời hạn",
      key: "deadline",
      render: (_, record) => {
        const daysRemaining = getDaysRemaining(record.deadline)
        const isExpired = record.isExpired || daysRemaining < 0

        return (
          <Flex vertical>
            <Text>{dayjs(record.deadline).format("DD/MM/YYYY")}</Text>
            {isExpired ? (
              <Tag color="error" style={{ marginTop: 4 }}>
                Đã hết hạn
              </Tag>
            ) : (
              <Tag color="success" style={{ marginTop: 4 }}>
                Còn {daysRemaining} ngày
              </Tag>
            )}
          </Flex>
        )
      },
      width: "15%",
      sorter: (a, b) => new Date(a.deadline) - new Date(b.deadline),
    },
    {
      title: "Trạng thái",
      key: "status",
      render: (_, record) => {
        const statusInfo = getStatusInfo(record.status)

        return (
          <Flex vertical>
            <Select
              value={record.status}
              style={{ width: "100%" }}
              onChange={(value) => handleStatusChange(value, record)}
              options={[
                { value: 1, label: "Chờ duyệt", icon: <ClockCircleOutlined /> },
                { value: 3, label: "Phê duyệt", icon: <CheckCircleOutlined /> },
                { value: 2, label: "Từ chối", icon: <CloseCircleOutlined /> },
              ]}
            />
            <Badge
              status={statusInfo.color === "success" ? "success" : statusInfo.color === "error" ? "error" : "warning"}
              text={statusInfo.label}
              style={{ marginTop: 8 }}
            />
          </Flex>
        )
      },
      width: "20%",
      filters: [
        { text: "Chờ duyệt", value: 1 },
        { text: "Đã duyệt", value: 3 },
        { text: "Từ chối", value: 2 },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            icon={expandedRowKeys.includes(record.id) ? <UpOutlined /> : <DownOutlined />}
            onClick={() => toggleRowExpand(record)}
          >
            {expandedRowKeys.includes(record.id) ? "Thu gọn" : "Mở rộng"}
          </Button>

          <Dropdown
            overlay={
              <Menu>
                <Menu.Item key="1" icon={<EyeOutlined />} onClick={() => viewJobDetails(record)}>
                  Xem chi tiết
                </Menu.Item>
                <Menu.Item key="2" icon={<EditOutlined />}>
                  <Link to={`/job-post/edit/${record.id}`}>Chỉnh sửa</Link>
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item key="3" icon={<DeleteOutlined />} danger onClick={() => showDeleteConfirm(record.id)}>
                  Xóa tin
                </Menu.Item>
              </Menu>
            }
            trigger={["click"]}
          >
            <Button type="text" icon={<MoreOutlined />} />
          </Dropdown>
        </Space>
      ),
      width: "25%",
    },
  ]

  return (
    <div style={{ padding: "24px", backgroundColor: "#f0f2f5", minHeight: "100vh" }}>
      <Card
        bordered={false}
        style={{
          borderRadius: 8,
          boxShadow: "0 1px 2px rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px rgba(0, 0, 0, 0.02)",
        }}
      >
        {/* Header */}
        <Flex align="center" justify="space-between" style={{ marginBottom: 24 }}>
          <Title level={3} style={{ margin: 0 }}>
            Quản lý tin tuyển dụng
          </Title>
          <Space>
            <Statistic
              title="Tổng số tin"
              value={jobList?.length || 0}
              prefix={<FileTextOutlined />}
              style={{ marginRight: 24 }}
            />
            {activeFilters > 0 && (
              <Badge count={activeFilters} offset={[0, 0]}>
                <Tag color="blue" style={{ padding: "6px 8px" }}>
                  Đang áp dụng {activeFilters} bộ lọc
                </Tag>
              </Badge>
            )}
          </Space>
        </Flex>

        <Divider style={{ margin: "12px 0 24px" }} />

        {/* Thanh tìm kiếm và bộ lọc */}
        <Flex justify="space-between" align="center" style={{ marginBottom: 24 }}>
          <Space size="middle">
            <Input.Search
              placeholder="Tìm kiếm tin tuyển dụng..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 300 }}
              allowClear
              enterButton
            />

            <Select
              placeholder="Trạng thái duyệt"
              allowClear
              onChange={(value) => setApprovalStatus(value)}
              value={approvalStatus}
              style={{ width: 180 }}
            >
              <Option value={1}>Chờ duyệt</Option>
              <Option value={3}>Phê duyệt</Option>
              <Option value={2}>Từ chối</Option>
            </Select>

            <Select
              placeholder="Trạng thái tuyển dụng"
              allowClear
              onChange={(value) => setRecruitmentStatus(value)}
              value={recruitmentStatus}
              style={{ width: 180 }}
            >
              <Option value={false}>Còn hạn</Option>
              <Option value={true}>Hết hạn</Option>
            </Select>
          </Space>

          <Space>
            <Button
              icon={<FilterOutlined />}
              onClick={() => setFilterDrawerVisible(true)}
              type={activeFilters > 0 ? "primary" : "default"}
            >
              Bộ lọc nâng cao
            </Button>

            {activeFilters > 0 && (
              <Button icon={<ReloadOutlined />} onClick={resetFilters}>
                Xóa bộ lọc
              </Button>
            )}

            <Link to="/job-post/create">
              <Button type="primary" icon={<PlusOutlined />}>
                Thêm tin mới
              </Button>
            </Link>
          </Space>
        </Flex>

        {/* Bảng dữ liệu */}
        {jobList.length > 0 ? (
          <Table
            loading={tableLoading}
            dataSource={jobList}
            columns={columns}
            rowKey="id"
            pagination={{
              ...pagination,
              total: jobList.length,
              showSizeChanger: true,
              showTotal: (total) => `Tổng cộng ${total} tin tuyển dụng`,
              pageSizeOptions: ["10", "20", "50"],
            }}
            onChange={handleTableChange}
            expandable={{
              expandedRowRender,
              expandedRowKeys,
              expandIcon: () => null,
            }}
            style={{ marginTop: 16 }}
          />
        ) : (
          <Empty
            description={
              <span>
                {activeFilters > 0
                  ? "Không tìm thấy tin tuyển dụng nào phù hợp với bộ lọc"
                  : "Chưa có tin tuyển dụng nào trong hệ thống"}
              </span>
            }
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            style={{ margin: "48px 0" }}
          />
        )}
      </Card>

      {/* Modal xác nhận xóa */}
      <Modal
        title={
          <>
            <ExclamationCircleOutlined style={{ color: "#ff4d4f", marginRight: 8 }} /> Xác nhận xóa
          </>
        }
        open={isModalVisible}
        onOk={handleDelete}
        onCancel={() => setIsModalVisible(false)}
        okText="Xóa"
        cancelText="Hủy"
        okButtonProps={{ danger: true }}
      >
        <p>Bạn có chắc chắn muốn xóa tin tuyển dụng này? Hành động này không thể hoàn tác.</p>
      </Modal>

      {/* Drawer xem chi tiết */}
      <Drawer
        title={selectedJob?.jobName}
        placement="right"
        onClose={() => setIsDetailDrawerVisible(false)}
        open={isDetailDrawerVisible}
        width={800}
        extra={
          <Space>
            <Link to={`/job-post/edit/${selectedJob?.id}`}>
              <Button type="primary" icon={<EditOutlined />}>
                Chỉnh sửa
              </Button>
            </Link>
          </Space>
        }
      >
        {selectedJob && (
          <>
            <Flex align="center" gap="middle" style={{ marginBottom: 24 }}>
              <Avatar src={selectedJob.company?.companyImageUrl} size={80} shape="square" />
              <Flex vertical>
                <Title level={4} style={{ margin: 0 }}>
                  {selectedJob.jobName}
                </Title>
                <Text>{selectedJob.company?.companyName}</Text>
                <Space style={{ marginTop: 8 }}>
                  {selectedJob.isHot && (
                    <Tag icon={<FireOutlined />} color="volcano">
                      Hot
                    </Tag>
                  )}
                  {selectedJob.isUrgent && (
                    <Tag icon={<ClockCircleOutlined />} color="error">
                      Gấp
                    </Tag>
                  )}
                  <Tag icon={<UserOutlined />}>{selectedJob.quantity} người</Tag>
                  <Tag icon={getWorkplaceTypeLabel(selectedJob.typeOfWorkplace).icon}>
                    {getWorkplaceTypeLabel(selectedJob.typeOfWorkplace).label}
                  </Tag>
                </Space>
              </Flex>
            </Flex>

            <Tabs defaultActiveKey="1">
              <TabPane tab="Thông tin cơ bản" key="1">
                <Row gutter={[24, 24]}>
                  <Col span={12}>
                    <Card title="Thông tin chung" bordered={false}>
                      <Flex vertical gap="middle">
                        <Flex justify="space-between">
                          <Text strong>Mức lương:</Text>
                          <Text>
                            {formatCurrency(selectedJob.salaryMin)} - {formatCurrency(selectedJob.salaryMax)}
                          </Text>
                        </Flex>
                        <Flex justify="space-between">
                          <Text strong>Vị trí:</Text>
                          <Text>{getPositionLabel(selectedJob.position)}</Text>
                        </Flex>
                        <Flex justify="space-between">
                          <Text strong>Kinh nghiệm:</Text>
                          <Text>{selectedJob.experience} năm</Text>
                        </Flex>
                        <Flex justify="space-between">
                          <Text strong>Học vấn:</Text>
                          <Text>{getAcademicLevelLabel(selectedJob.academicLevel)}</Text>
                        </Flex>
                        <Flex justify="space-between">
                          <Text strong>Loại công việc:</Text>
                          <Text>{getJobTypeLabel(selectedJob.jobType)}</Text>
                        </Flex>
                        <Flex justify="space-between">
                          <Text strong>Giới tính yêu cầu:</Text>
                          <Text>
                            {selectedJob.genderRequired === "M"
                              ? "Nam"
                              : selectedJob.genderRequired === "F"
                                ? "Nữ"
                                : "Không yêu cầu"}
                          </Text>
                        </Flex>
                      </Flex>
                    </Card>
                  </Col>
                  <Col span={12}>
                    <Card title="Thời gian" bordered={false}>
                      <Flex vertical gap="middle">
                        <Flex justify="space-between">
                          <Text strong>Hạn nộp hồ sơ:</Text>
                          <Text>{dayjs(selectedJob.deadline).format("DD/MM/YYYY")}</Text>
                        </Flex>
                        <Flex justify="space-between">
                          <Text strong>Trạng thái:</Text>
                          <Tag color={selectedJob.isExpired ? "error" : "success"}>
                            {selectedJob.isExpired ? "Đã hết hạn" : "Còn hạn"}
                          </Tag>
                        </Flex>
                        <Flex justify="space-between">
                          <Text strong>Ngày tạo:</Text>
                          <Text>{dayjs(selectedJob.createAt).format("DD/MM/YYYY HH:mm")}</Text>
                        </Flex>
                        <Flex justify="space-between">
                          <Text strong>Cập nhật lần cuối:</Text>
                          <Text>{dayjs(selectedJob.updateAt).format("DD/MM/YYYY HH:mm")}</Text>
                        </Flex>
                      </Flex>
                    </Card>
                  </Col>
                  <Col span={24}>
                    <Card title="Thông tin liên hệ" bordered={false}>
                      <Row gutter={24}>
                        <Col span={8}>
                          <Flex vertical gap="small">
                            <Text strong>Người liên hệ:</Text>
                            <Text>{selectedJob.contactPersonName}</Text>
                          </Flex>
                        </Col>
                        <Col span={8}>
                          <Flex vertical gap="small">
                            <Text strong>Email:</Text>
                            <Text>{selectedJob.contactPersonEmail}</Text>
                          </Flex>
                        </Col>
                        <Col span={8}>
                          <Flex vertical gap="small">
                            <Text strong>Điện thoại:</Text>
                            <Text>{selectedJob.contactPersonPhone}</Text>
                          </Flex>
                        </Col>
                      </Row>
                    </Card>
                  </Col>
                  <Col span={24}>
                    <Card title="Thống kê" bordered={false}>
                      <Row gutter={24}>
                        <Col span={12}>
                          <Statistic title="Lượt xem" value={selectedJob.views} prefix={<EyeOutlined />} />
                        </Col>
                        <Col span={12}>
                          <Statistic title="Lượt chia sẻ" value={selectedJob.shares} prefix={<ShareAltOutlined />} />
                        </Col>
                      </Row>
                    </Card>
                  </Col>
                </Row>
              </TabPane>
              <TabPane tab="Mô tả công việc" key="2">
                <Card bordered={false}>
                  <div dangerouslySetInnerHTML={{ __html: selectedJob.jobDescription }} />
                </Card>
              </TabPane>
              <TabPane tab="Yêu cầu công việc" key="3">
                <Card bordered={false}>
                  <div dangerouslySetInnerHTML={{ __html: selectedJob.jobRequirement }} />
                </Card>
              </TabPane>
              <TabPane tab="Quyền lợi" key="4">
                <Card bordered={false}>
                  <div dangerouslySetInnerHTML={{ __html: selectedJob.benefitsEnjoyed }} />
                </Card>
              </TabPane>
            </Tabs>
          </>
        )}
      </Drawer>

      {/* Drawer bộ lọc nâng cao */}
      <Drawer
        title="Bộ lọc nâng cao"
        placement="right"
        onClose={() => setFilterDrawerVisible(false)}
        open={filterDrawerVisible}
        width={400}
        extra={
          <Button type="primary" onClick={() => setFilterDrawerVisible(false)}>
            Áp dụng
          </Button>
        }
        footer={
          <Flex justify="space-between">
            <Button onClick={resetFilters}>Xóa tất cả</Button>
            <Button type="primary" onClick={() => setFilterDrawerVisible(false)}>
              Áp dụng bộ lọc
            </Button>
          </Flex>
        }
      >
        <Flex vertical gap="middle">
          <div>
            <Text strong>Vị trí</Text>
            <Select
              placeholder="Chọn vị trí"
              allowClear
              onChange={setPositionFilter}
              value={positionFilter}
              style={{ width: "100%", marginTop: 8 }}
            >
              <Option value={1}>Nhân viên</Option>
              <Option value={2}>Trưởng nhóm</Option>
              <Option value={3}>Quản lý</Option>
              <Option value={4}>Phó giám đốc</Option>
              <Option value={5}>Giám đốc</Option>
            </Select>
          </div>

          <div>
            <Text strong>Nơi làm việc</Text>
            <Select
              placeholder="Chọn nơi làm việc"
              allowClear
              onChange={setWorkplaceTypeFilter}
              value={workplaceTypeFilter}
              style={{ width: "100%", marginTop: 8 }}
            >
              <Option value={1}>Tại văn phòng</Option>
              <Option value={2}>Làm từ xa</Option>
              <Option value={3}>Hỗn hợp</Option>
            </Select>
          </div>

          <div>
            <Text strong>Kinh nghiệm</Text>
            <Select
              placeholder="Chọn kinh nghiệm"
              allowClear
              onChange={setExperienceFilter}
              value={experienceFilter}
              style={{ width: "100%", marginTop: 8 }}
            >
              <Option value={0}>Không yêu cầu</Option>
              <Option value={1}>1 năm</Option>
              <Option value={2}>2 năm</Option>
              <Option value={3}>3 năm</Option>
              <Option value={5}>5 năm</Option>
              <Option value={8}>8 năm trở lên</Option>
            </Select>
          </div>

          <div>
            <Text strong>Học vấn</Text>
            <Select
              placeholder="Chọn học vấn"
              allowClear
              onChange={setAcademicLevelFilter}
              value={academicLevelFilter}
              style={{ width: "100%", marginTop: 8 }}
            >
              <Option value={1}>Trung cấp</Option>
              <Option value={2}>Cao đẳng</Option>
              <Option value={3}>Đại học</Option>
              <Option value={4}>Thạc sĩ</Option>
              <Option value={5}>Tiến sĩ</Option>
            </Select>
          </div>

          <div>
            <Text strong>Loại công việc</Text>
            <Select
              placeholder="Chọn loại công việc"
              allowClear
              onChange={setJobTypeFilter}
              value={jobTypeFilter}
              style={{ width: "100%", marginTop: 8 }}
            >
              <Option value={1}>Toàn thời gian</Option>
              <Option value={2}>Bán thời gian</Option>
              <Option value={3}>Thực tập</Option>
            </Select>
          </div>

          <Divider />

          <div>
            <Text strong>Tin nổi bật</Text>
            <Select
              placeholder="Chọn loại tin"
              allowClear
              onChange={setIsHotFilter}
              value={isHotFilter}
              style={{ width: "100%", marginTop: 8 }}
            >
              <Option value={true}>Tin Hot</Option>
              <Option value={false}>Tin thường</Option>
            </Select>
          </div>

          <div>
            <Text strong>Tin khẩn cấp</Text>
            <Select
              placeholder="Chọn loại tin"
              allowClear
              onChange={setIsUrgentFilter}
              value={isUrgentFilter}
              style={{ width: "100%", marginTop: 8 }}
            >
              <Option value={true}>Tin gấp</Option>
              <Option value={false}>Tin thường</Option>
            </Select>
          </div>
        </Flex>
      </Drawer>

      <style jsx global>{`
        .ant-table-row-expand-icon-cell {
          width: 0;
          padding: 0 !important;
        }import jobService from './../../services/jobService';

        
        .ant-table-thead > tr > th {
          background-color: #fafafa;
          font-weight: 600;
        }
        
        .ant-drawer-body {
          padding: 24px;
        }
        
        .ant-statistic-title {
          font-size: 14px;
        }
      `}</style>
    </div>
  )
}

export default JobPost

