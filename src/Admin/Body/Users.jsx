"use client"

import { useEffect, useState } from "react"
import {
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
  DownloadOutlined,
  FilterOutlined,
  EyeOutlined,
  UserOutlined,
  MailOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  LockOutlined,
  UnlockOutlined,
  InfoCircleOutlined,
  TeamOutlined,
  SortAscendingOutlined,
  SortDescendingOutlined,
  CalendarOutlined,
  SettingOutlined,
  ExportOutlined,
  PlusOutlined,
  MoreOutlined,
  UnorderedListOutlined,
  AppstoreOutlined,
} from "@ant-design/icons"
import {
  Avatar,
  Button,
  Card,
  Input,
  message,
  Popconfirm,
  Space,
  Spin,
  Table,
  Tag,
  Tooltip,
  Typography,
  Select,
  Dropdown,
  Menu,
  Badge,
  Drawer,
  Form,
  DatePicker,
  Divider,
  Row,
  Col,
  Statistic,
  Empty,
  Tabs,
  Radio,
  Segmented,
  Progress,
} from "antd"
import { Link } from "react-router-dom"
import * as XLSX from "xlsx"
import userService from "../../services/userService"
import "./ui/users.css"

const { Title, Text } = Typography
const { Option } = Select
const { RangePicker } = DatePicker
const { TabPane } = Tabs

const Users = () => {
  const [userList, setUserList] = useState([])
  const [filteredUserList, setFilteredUserList] = useState([])
  const [tableLoading, setTableLoading] = useState(false)
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [viewMode, setViewMode] = useState("table")
  const [sortField, setSortField] = useState("fullName")
  const [sortOrder, setSortOrder] = useState("ascend")
  const [advancedFilterVisible, setAdvancedFilterVisible] = useState(false)
  const [userDetailVisible, setUserDetailVisible] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [refreshKey, setRefreshKey] = useState(0)

  // State cho thanh tìm kiếm & bộ lọc
  const [globalSearch, setGlobalSearch] = useState("")
  const [filterRole, setFilterRole] = useState("")
  const [filterActive, setFilterActive] = useState("")
  const [filterEmailVerified, setFilterEmailVerified] = useState("")
  const [dateRange, setDateRange] = useState(null)
  const [form] = Form.useForm()

  // Thống kê
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    verified: 0,
    jobSeekers: 0,
    employers: 0,
  })

  useEffect(() => {
    loadUserList()
  }, [refreshKey])

  const loadUserList = async () => {
    setTableLoading(true)
    try {
      const resData = await userService.getUserList()
      setUserList(resData.data)

      // Tính toán thống kê
      const total = resData.data.length
      const active = resData.data.filter((user) => user.isActive).length
      const inactive = total - active
      const verified = resData.data.filter((user) => user.isVerifyEmail).length
      const jobSeekers = resData.data.filter((user) => user.roleName === "JOB_SEEKER").length
      const employers = resData.data.filter((user) => user.roleName === "EMPLOYER").length

      setStats({
        total,
        active,
        inactive,
        verified,
        jobSeekers,
        employers,
      })
    } catch (error) {
      console.error("Error fetching users:", error)
      message.error("Không thể tải danh sách người dùng")
    } finally {
      setTableLoading(false)
    }
  }

  // Lọc danh sách người dùng dựa trên tìm kiếm và các bộ lọc
  useEffect(() => {
    let filtered = [...userList]

    if (globalSearch) {
      filtered = filtered.filter(
        (user) =>
          user.fullName?.toLowerCase().includes(globalSearch.toLowerCase()) ||
          user.email?.toLowerCase().includes(globalSearch.toLowerCase()),
      )
    }

    if (filterRole) {
      filtered = filtered.filter((user) => user.roleName === filterRole)
    }

    if (filterActive !== "") {
      const isActive = filterActive === "active"
      filtered = filtered.filter((user) => user.isActive === isActive)
    }

    if (filterEmailVerified !== "") {
      const isVerified = filterEmailVerified === "verified"
      filtered = filtered.filter((user) => user.isVerifyEmail === isVerified)
    }

    if (dateRange && dateRange.length === 2) {
      const [start, end] = dateRange
      filtered = filtered.filter((user) => {
        const createdDate = new Date(user.createAt)
        return createdDate >= start.startOf("day").toDate() && createdDate <= end.endOf("day").toDate()
      })
    }

    // Sắp xếp
    if (sortField && sortOrder) {
      filtered.sort((a, b) => {
        let compareA = a[sortField] || ""
        let compareB = b[sortField] || ""

        // Xử lý trường hợp so sánh chuỗi
        if (typeof compareA === "string") {
          compareA = compareA.toLowerCase()
          compareB = compareB.toLowerCase()
        }

        if (sortOrder === "ascend") {
          return compareA > compareB ? 1 : -1
        } else {
          return compareA < compareB ? 1 : -1
        }
      })
    }

    setFilteredUserList(filtered)
  }, [userList, globalSearch, filterRole, filterActive, filterEmailVerified, dateRange, sortField, sortOrder])

  const handleExportExcel = () => {
    const dataToExport =
      selectedRowKeys.length > 0
        ? filteredUserList.filter((user) => selectedRowKeys.includes(user.id))
        : filteredUserList

    const worksheet = XLSX.utils.json_to_sheet(
      dataToExport.map((item) => ({
        ID: item.id,
        "Tên đầy đủ": item.fullName,
        Email: item.email,
        "Trạng thái": item.isActive ? "Hoạt động" : "Khoá",
        "Xác nhận Email": item.isVerifyEmail ? "Đã xác nhận" : "Chưa xác nhận",
        Role: item.roleName,
        "Ngày tạo": item.createAt ? new Date(item.createAt).toLocaleDateString() : "",
        "Đăng nhập cuối": item.lastLogin ? new Date(item.lastLogin).toLocaleDateString() : "",
      })),
    )

    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users")
    XLSX.writeFile(workbook, "users.xlsx")
    message.success("Xuất file Excel thành công")
  }

  const handleDeleteUser = async (id) => {
    try {
      await userService.deleteUser(id)
      message.success("Xóa người dùng thành công")
      setRefreshKey((prev) => prev + 1)
    } catch (error) {
      message.error("Xóa người dùng thất bại")
    }
  }

  const handleBatchDelete = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning("Vui lòng chọn ít nhất một người dùng")
      return
    }

    try {
      // Giả định API hỗ trợ xóa hàng loạt
      await Promise.all(selectedRowKeys.map((id) => userService.deleteUser(id)))
      message.success(`Đã xóa ${selectedRowKeys.length} người dùng thành công`)
      setSelectedRowKeys([])
      setRefreshKey((prev) => prev + 1)
    } catch (error) {
      message.error("Xóa người dùng thất bại")
    }
  }

  const handleToggleUserStatus = async (id, currentStatus) => {
    try {
      // Giả định API hỗ trợ cập nhật trạng thái
      await userService.blockUser(id)
      message.success(`Đã ${currentStatus ? "khóa" : "kích hoạt"} tài khoản thành công`)
      setRefreshKey((prev) => prev + 1)
    } catch (error) {
      message.error(`Không thể ${currentStatus ? "khóa" : "kích hoạt"} tài khoản`)
    }
  }

  const handleViewUserDetail = (user) => {
    setSelectedUser(user)
    setUserDetailVisible(true)
  }

  const handleResetFilters = () => {
    setGlobalSearch("")
    setFilterRole("")
    setFilterActive("")
    setFilterEmailVerified("")
    setDateRange(null)
    form.resetFields()
  }

  const handleTableChange = (pagination, filters, sorter) => {
    if (sorter.field && sorter.order) {
      setSortField(sorter.field)
      setSortOrder(sorter.order)
    }
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: (keys) => setSelectedRowKeys(keys),
    selections: [
      Table.SELECTION_ALL,
      Table.SELECTION_INVERT,
      {
        key: "active",
        text: "Chọn tất cả người dùng đang hoạt động",
        onSelect: () => {
          const activeUserIds = filteredUserList.filter((user) => user.isActive).map((user) => user.id)
          setSelectedRowKeys(activeUserIds)
        },
      },
      {
        key: "inactive",
        text: "Chọn tất cả người dùng đã khóa",
        onSelect: () => {
          const inactiveUserIds = filteredUserList.filter((user) => !user.isActive).map((user) => user.id)
          setSelectedRowKeys(inactiveUserIds)
        },
      },
    ],
  }

  const columns = [
    {
      title: (
        <Space>
          <UserOutlined />
          <span>Tên</span>
        </Space>
      ),
      key: "name",
      dataIndex: "fullName",
      sorter: true,
      sortOrder: sortField === "fullName" ? sortOrder : null,
      render: (_, record) => (
        <Space>
          <Avatar
            size={40}
            src={record.avatarUrl}
            icon={!record.avatarUrl && <UserOutlined />}
            className={!record.isActive ? "inactive-avatar" : ""}
          />
          <div className="user-info">
            <Text
              strong
              className={!record.isActive ? "inactive-text" : ""}
              onClick={() => handleViewUserDetail(record)}
              style={{ cursor: "pointer" }}
            >
              {record.fullName}
            </Text>
            <div className="user-meta">
              <Text type="secondary" style={{ fontSize: "12px" }}>
                <CalendarOutlined /> {record.createAt ? new Date(record.createAt).toLocaleDateString() : "N/A"}
              </Text>
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: (
        <Space>
          <MailOutlined />
          <span>Email</span>
        </Space>
      ),
      dataIndex: "email",
      key: "email",
      sorter: true,
      sortOrder: sortField === "email" ? sortOrder : null,
      render: (email, record) => (
        <Text copyable className={!record.isActive ? "inactive-text" : ""}>
          {email}
        </Text>
      ),
    },
    {
      title: (
        <Space>
          <TeamOutlined />
          <span>Role</span>
        </Space>
      ),
      dataIndex: "roleName",
      key: "roleName",
      sorter: true,
      sortOrder: sortField === "roleName" ? sortOrder : null,
      render: (role) => {
        let color, icon
        if (role === "JOB_SEEKER") {
          color = "blue"
          icon = <UserOutlined />
        } else if (role === "EMPLOYER") {
          color = "green"
          icon = <TeamOutlined />
        } else {
          color = "purple"
          icon = <SettingOutlined />
        }

        return (
          <Tag color={color} icon={icon}>
            {role === "JOB_SEEKER" ? "Ứng viên" : role === "EMPLOYER" ? "Nhà tuyển dụng" : role}
          </Tag>
        )
      },
    },
    {
      title: (
        <Space>
          <CheckCircleOutlined />
          <span>Trạng thái</span>
        </Space>
      ),
      key: "status",
      dataIndex: "isActive",
      sorter: true,
      sortOrder: sortField === "isActive" ? sortOrder : null,
      render: (isActive) => (
        <Tag color={isActive ? "success" : "error"} icon={isActive ? <CheckCircleOutlined /> : <CloseCircleOutlined />}>
          {isActive ? "Hoạt động" : "Khoá"}
        </Tag>
      ),
    },
    {
      title: (
        <Space>
          <MailOutlined />
          <span>Email</span>
        </Space>
      ),
      key: "isVerifyEmail",
      dataIndex: "isVerifyEmail",
      sorter: true,
      sortOrder: sortField === "isVerifyEmail" ? sortOrder : null,
      render: (isVerified) => (
        <Tag
          color={isVerified ? "blue" : "warning"}
          icon={isVerified ? <CheckCircleOutlined /> : <InfoCircleOutlined />}
        >
          {isVerified ? "Đã xác nhận" : "Chưa xác nhận"}
        </Tag>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      fixed: "right",
      width: 180,
      render: (_, record) => (
        <Space size="small" className="action-buttons">
          <Tooltip title="Xem chi tiết">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => handleViewUserDetail(record)}
              className="action-button"
            />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Link to={`/users/edit/${record.id}`}>
              <Button type="text" icon={<EditOutlined />} className="action-button" />
            </Link>
          </Tooltip>
          <Tooltip title={record.isActive ? "Khóa tài khoản" : "Kích hoạt tài khoản"}>
            <Button
              type="text"
              icon={record.isActive ? <LockOutlined /> : <UnlockOutlined />}
              onClick={() => handleToggleUserStatus(record.id, record.isActive)}
              className="action-button"
            />
          </Tooltip>
          <Tooltip title="Xoá người dùng">
            <Popconfirm
              title="Xoá người dùng?"
              description="Bạn có chắc chắn muốn xoá người dùng này?"
              onConfirm={() => handleDeleteUser(record.id)}
              okText="Xoá"
              cancelText="Huỷ"
              placement="left"
              okButtonProps={{ danger: true }}
            >
              <Button type="text" danger icon={<DeleteOutlined />} className="action-button" />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ]

  // Menu cho các hành động hàng loạt
  const batchActionMenu = (
    <Menu>
      <Menu.Item key="export" icon={<ExportOutlined />} onClick={handleExportExcel}>
        Xuất Excel
      </Menu.Item>
      <Menu.Item key="delete" icon={<DeleteOutlined />} danger onClick={handleBatchDelete}>
        Xóa đã chọn
      </Menu.Item>
    </Menu>
  )

  // Render card view cho người dùng
  const renderUserCards = () => {
    if (filteredUserList.length === 0) {
      return <Empty description="Không tìm thấy người dùng nào" />
    }

    return (
      <Row gutter={[16, 16]}>
        {filteredUserList.map((user) => (
          <Col xs={24} sm={12} md={8} lg={6} key={user.id}>
            <Card
              hoverable
              className={`user-card ${!user.isActive ? "inactive-card" : ""}`}
              actions={[
                <Tooltip title="Xem chi tiết" key="view-tooltip">
                  <EyeOutlined key="view" onClick={() => handleViewUserDetail(user)} />
                </Tooltip>,
                <Tooltip title="Chỉnh sửa" key="edit-tooltip">
                  <Link to={`/users/edit/${user.id}`} key="edit-link">
                    <EditOutlined key="edit" />
                  </Link>
                </Tooltip>,
                <Tooltip title={user.isActive ? "Khóa tài khoản" : "Kích hoạt tài khoản"} key="status-tooltip">
                  {user.isActive ? (
                    <LockOutlined key="lock" onClick={() => handleToggleUserStatus(user.id, user.isActive)} />
                  ) : (
                    <UnlockOutlined key="unlock" onClick={() => handleToggleUserStatus(user.id, user.isActive)} />
                  )}
                </Tooltip>,
                <Popconfirm
                  title="Xoá người dùng?"
                  description="Bạn có chắc chắn muốn xoá người dùng này?"
                  onConfirm={() => handleDeleteUser(user.id)}
                  okText="Xoá"
                  cancelText="Huỷ"
                  okButtonProps={{ danger: true }}
                  key="delete-confirm"
                >
                  <DeleteOutlined key="delete" />
                </Popconfirm>,
              ]}
            >
              <div className="user-card-content">
                <div className="user-card-avatar">
                  <Badge dot status={user.isActive ? "success" : "error"} offset={[-5, 35]}>
                    <Avatar size={64} src={user.avatarUrl} icon={!user.avatarUrl && <UserOutlined />} />
                  </Badge>
                </div>
                <div className="user-card-info">
                  <Text strong ellipsis style={{ fontSize: "16px" }}>
                    {user.fullName}
                  </Text>
                  <Text type="secondary" ellipsis>
                    {user.email}
                  </Text>
                  <div className="user-card-tags">
                    <Tag
                      color={user.roleName === "JOB_SEEKER" ? "blue" : "green"}
                      icon={user.roleName === "JOB_SEEKER" ? <UserOutlined /> : <TeamOutlined />}
                    >
                      {user.roleName === "JOB_SEEKER" ? "Ứng viên" : "Nhà tuyển dụng"}
                    </Tag>
                    <Tag
                      color={user.isVerifyEmail ? "blue" : "warning"}
                      icon={user.isVerifyEmail ? <CheckCircleOutlined /> : <InfoCircleOutlined />}
                    >
                      {user.isVerifyEmail ? "Đã xác nhận" : "Chưa xác nhận"}
                    </Tag>
                  </div>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    )
  }

  return (
    <div className="users-container">
      <Card className="users-card">
        <Space direction="vertical" style={{ width: "100%" }} size="middle">
          {/* Header và các thao tác chung */}
          <div className="users-header">
            <div className="users-title">
              <Title level={4}>
                <TeamOutlined /> Quản lý người dùng
              </Title>
              <Text type="secondary">Quản lý tất cả người dùng trong hệ thống</Text>
            </div>
            <div className="users-actions">
              <Space wrap>
                <Tooltip title="Làm mới dữ liệu">
                  <Button
                    icon={<ReloadOutlined />}
                    onClick={() => setRefreshKey((prev) => prev + 1)}
                    loading={tableLoading}
                  />
                </Tooltip>
                <Tooltip title="Xuất Excel">
                  <Button icon={<DownloadOutlined />} onClick={handleExportExcel} />
                </Tooltip>
                <Tooltip title="Bộ lọc nâng cao">
                  <Button
                    icon={<FilterOutlined />}
                    type={advancedFilterVisible ? "primary" : "default"}
                    onClick={() => setAdvancedFilterVisible(!advancedFilterVisible)}
                  />
                </Tooltip>
                <Button type="primary">
                  <Link to="/users/add">
                    <Space>
                      <PlusOutlined /> Thêm mới
                    </Space>
                  </Link>
                </Button>
              </Space>
            </div>
          </div>

          {/* Thống kê */}
          <Row gutter={[16, 16]} className="stats-row">
            <Col xs={24} sm={12} md={8} lg={4}>
              <Card className="stat-card">
                <Statistic
                  title="Tổng người dùng"
                  value={stats.total}
                  prefix={<TeamOutlined />}
                  valueStyle={{ color: "#1890ff" }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8} lg={4}>
              <Card className="stat-card">
                <Statistic
                  title="Đang hoạt động"
                  value={stats.active}
                  prefix={<CheckCircleOutlined />}
                  valueStyle={{ color: "#52c41a" }}
                />
                <Progress
                  percent={stats.total ? Math.round((stats.active / stats.total) * 100) : 0}
                  size="small"
                  showInfo={false}
                  strokeColor="#52c41a"
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8} lg={4}>
              <Card className="stat-card">
                <Statistic
                  title="Đã khóa"
                  value={stats.inactive}
                  prefix={<CloseCircleOutlined />}
                  valueStyle={{ color: "#ff4d4f" }}
                />
                <Progress
                  percent={stats.total ? Math.round((stats.inactive / stats.total) * 100) : 0}
                  size="small"
                  showInfo={false}
                  strokeColor="#ff4d4f"
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8} lg={4}>
              <Card className="stat-card">
                <Statistic
                  title="Đã xác nhận email"
                  value={stats.verified}
                  prefix={<MailOutlined />}
                  valueStyle={{ color: "#722ed1" }}
                />
                <Progress
                  percent={stats.total ? Math.round((stats.verified / stats.total) * 100) : 0}
                  size="small"
                  showInfo={false}
                  strokeColor="#722ed1"
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8} lg={4}>
              <Card className="stat-card">
                <Statistic
                  title="Ứng viên"
                  value={stats.jobSeekers}
                  prefix={<UserOutlined />}
                  valueStyle={{ color: "#1890ff" }}
                />
                <Progress
                  percent={stats.total ? Math.round((stats.jobSeekers / stats.total) * 100) : 0}
                  size="small"
                  showInfo={false}
                  strokeColor="#1890ff"
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8} lg={4}>
              <Card className="stat-card">
                <Statistic
                  title="Nhà tuyển dụng"
                  value={stats.employers}
                  prefix={<TeamOutlined />}
                  valueStyle={{ color: "#52c41a" }}
                />
                <Progress
                  percent={stats.total ? Math.round((stats.employers / stats.total) * 100) : 0}
                  size="small"
                  showInfo={false}
                  strokeColor="#52c41a"
                />
              </Card>
            </Col>
          </Row>

          {/* Thanh tìm kiếm cơ bản */}
          <div className="search-bar">
            <Input
              placeholder="Tìm kiếm theo tên hoặc email..."
              prefix={<SearchOutlined />}
              allowClear
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              className="search-input"
            />
            <Space>
              <Select
                placeholder="Lọc theo Role"
                allowClear
                value={filterRole || undefined}
                onChange={(value) => setFilterRole(value)}
                style={{ minWidth: 150 }}
              >
                <Option value="JOB_SEEKER">Ứng viên</Option>
                <Option value="EMPLOYER">Nhà tuyển dụng</Option>
              </Select>
              <Select
                placeholder="Trạng thái"
                allowClear
                value={filterActive || undefined}
                onChange={(value) => setFilterActive(value)}
                style={{ minWidth: 150 }}
              >
                <Option value="active">Hoạt động</Option>
                <Option value="inactive">Khoá</Option>
              </Select>
              <Button type="link" onClick={handleResetFilters}>
                Đặt lại
              </Button>
            </Space>
          </div>

          {/* Thông tin kết quả và chế độ xem */}
          <div className="result-info">
            <Text>
              Hiển thị {filteredUserList.length} trên {userList.length} người dùng
            </Text>
            <Space>
              {selectedRowKeys.length > 0 && (
                <Space>
                  <Badge count={selectedRowKeys.length} />
                  <Text>đã chọn</Text>
                  <Dropdown overlay={batchActionMenu} placement="bottomRight">
                    <Button>
                      Hành động <MoreOutlined />
                    </Button>
                  </Dropdown>
                </Space>
              )}
              <Segmented
                options={[
                  {
                    value: "table",
                    icon: <UnorderedListOutlined />,
                    key: "table-view",
                  },
                  {
                    value: "card",
                    icon: <AppstoreOutlined />,
                    key: "card-view",
                  },
                ]}
                value={viewMode}
                onChange={setViewMode}
              />
            </Space>
          </div>

          {/* Bảng danh sách hoặc card view */}
          {tableLoading ? (
            <div className="loading-container">
              <Spin size="large" />
              <Text style={{ marginTop: 16 }}>Đang tải dữ liệu...</Text>
            </div>
          ) : filteredUserList.length === 0 ? (
            <Empty description="Không tìm thấy người dùng nào" image={Empty.PRESENTED_IMAGE_SIMPLE} />
          ) : viewMode === "table" ? (
            <Table
              columns={columns}
              dataSource={filteredUserList}
              rowKey="id"
              rowSelection={rowSelection}
              onChange={handleTableChange}
              scroll={{ x: 1200 }}
              pagination={{
                defaultPageSize: 10,
                showSizeChanger: true,
                pageSizeOptions: ["10", "20", "50", "100"],
                showTotal: (total) => `Tổng cộng ${total} người dùng`,
                showQuickJumper: true,
              }}
              className="users-table"
            />
          ) : (
            renderUserCards()
          )}
        </Space>
      </Card>

      {/* Drawer bộ lọc nâng cao */}
      <Drawer
        title="Bộ lọc nâng cao"
        placement="right"
        onClose={() => setAdvancedFilterVisible(false)}
        open={advancedFilterVisible}
        width={360}
        footer={
          <Space style={{ width: "100%", justifyContent: "flex-end" }}>
            <Button onClick={handleResetFilters}>Đặt lại</Button>
            <Button
              type="primary"
              onClick={() => {
                form.submit()
                setAdvancedFilterVisible(false)
              }}
            >
              Áp dụng
            </Button>
          </Space>
        }
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={(values) => {
            setFilterRole(values.role)
            setFilterActive(values.status)
            setFilterEmailVerified(values.emailVerified)
            setDateRange(values.dateRange)
          }}
        >
          <Form.Item name="role" label="Vai trò">
            <Select placeholder="Chọn vai trò" allowClear>
              <Option value="JOB_SEEKER">Ứng viên</Option>
              <Option value="EMPLOYER">Nhà tuyển dụng</Option>
            </Select>
          </Form.Item>
          <Form.Item name="status" label="Trạng thái">
            <Select placeholder="Chọn trạng thái" allowClear>
              <Option value="active">Hoạt động</Option>
              <Option value="inactive">Khoá</Option>
            </Select>
          </Form.Item>
          <Form.Item name="emailVerified" label="Xác nhận email">
            <Select placeholder="Chọn trạng thái xác nhận" allowClear>
              <Option value="verified">Đã xác nhận</Option>
              <Option value="unverified">Chưa xác nhận</Option>
            </Select>
          </Form.Item>
          <Form.Item name="dateRange" label="Ngày đăng ký">
            <RangePicker style={{ width: "100%" }} />
          </Form.Item>
          <Divider />
          <Form.Item label="Sắp xếp theo">
            <Select value={sortField} onChange={(value) => setSortField(value)} style={{ width: "100%" }}>
              <Option value="fullName">Tên</Option>
              <Option value="email">Email</Option>
              <Option value="roleName">Vai trò</Option>
              <Option value="isActive">Trạng thái</Option>
              <Option value="isVerifyEmail">Xác nhận email</Option>
              <Option value="createAt">Ngày đăng ký</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Thứ tự">
            <Radio.Group value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
              <Radio.Button value="ascend">
                <SortAscendingOutlined /> Tăng dần
              </Radio.Button>
              <Radio.Button value="descend">
                <SortDescendingOutlined /> Giảm dần
              </Radio.Button>
            </Radio.Group>
          </Form.Item>
        </Form>
      </Drawer>

      {/* Drawer chi tiết người dùng */}
      <Drawer
        title="Chi tiết người dùng"
        placement="right"
        onClose={() => setUserDetailVisible(false)}
        open={userDetailVisible}
        width={480}
        extra={
          <Space>
            <Link to={`/users/edit/${selectedUser?.id}`}>
              <Button type="primary" icon={<EditOutlined />}>
                Chỉnh sửa
              </Button>
            </Link>
          </Space>
        }
      >
        {selectedUser && (
          <div className="user-detail">
            <div className="user-detail-header">
              <Avatar size={80} src={selectedUser.avatarUrl} icon={!selectedUser.avatarUrl && <UserOutlined />} />
              <div className="user-detail-title">
                <Title level={4}>{selectedUser.fullName}</Title>
                <Tag
                  color={selectedUser.roleName === "JOB_SEEKER" ? "blue" : "green"}
                  icon={selectedUser.roleName === "JOB_SEEKER" ? <UserOutlined /> : <TeamOutlined />}
                >
                  {selectedUser.roleName === "JOB_SEEKER" ? "Ứng viên" : "Nhà tuyển dụng"}
                </Tag>
                <Tag
                  color={selectedUser.isActive ? "success" : "error"}
                  icon={selectedUser.isActive ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
                >
                  {selectedUser.isActive ? "Hoạt động" : "Khoá"}
                </Tag>
              </div>
            </div>

            <Divider />

            <Tabs defaultActiveKey="info">
              <TabPane
                tab={
                  <span>
                    <InfoCircleOutlined /> Thông tin cơ bản
                  </span>
                }
                key="info"
              >
                <div className="detail-item">
                  <Text type="secondary">Email:</Text>
                  <Text copyable>{selectedUser.email}</Text>
                </div>
                <div className="detail-item">
                  <Text type="secondary">Xác nhận email:</Text>
                  <Tag
                    color={selectedUser.isVerifyEmail ? "blue" : "warning"}
                    icon={selectedUser.isVerifyEmail ? <CheckCircleOutlined /> : <InfoCircleOutlined />}
                  >
                    {selectedUser.isVerifyEmail ? "Đã xác nhận" : "Chưa xác nhận"}
                  </Tag>
                </div>
                <div className="detail-item">
                  <Text type="secondary">Ngày đăng ký:</Text>
                  <Text>{selectedUser.createAt ? new Date(selectedUser.createAt).toLocaleDateString() : "N/A"}</Text>
                </div>
                <div className="detail-item">
                  <Text type="secondary">Đăng nhập cuối:</Text>
                  <Text>{selectedUser.lastLogin ? new Date(selectedUser.lastLogin).toLocaleDateString() : "N/A"}</Text>
                </div>
                <div className="detail-item">
                  <Text type="secondary">Số điện thoại:</Text>
                  <Text>{selectedUser.phone || "Chưa cập nhật"}</Text>
                </div>
                <div className="detail-item">
                  <Text type="secondary">Địa chỉ:</Text>
                  <Text>{selectedUser.address || "Chưa cập nhật"}</Text>
                </div>
              </TabPane>
              <TabPane
                tab={
                  <span>
                    <SettingOutlined /> Hành động
                  </span>
                }
                key="actions"
              >
                <Space direction="vertical" style={{ width: "100%" }}>
                  <Button
                    block
                    icon={selectedUser.isActive ? <LockOutlined /> : <UnlockOutlined />}
                    onClick={() => handleToggleUserStatus(selectedUser.id, selectedUser.isActive)}
                  >
                    {selectedUser.isActive ? "Khóa tài khoản" : "Kích hoạt tài khoản"}
                  </Button>
                  <Button block icon={<MailOutlined />}>
                    Gửi email xác nhận
                  </Button>
                  <Button block icon={<ReloadOutlined />}>
                    Đặt lại mật khẩu
                  </Button>
                  <Popconfirm
                    title="Xoá người dùng?"
                    description="Bạn có chắc chắn muốn xoá người dùng này?"
                    onConfirm={() => {
                      handleDeleteUser(selectedUser.id)
                      setUserDetailVisible(false)
                    }}
                    okText="Xoá"
                    cancelText="Huỷ"
                    okButtonProps={{ danger: true }}
                  >
                    <Button block danger icon={<DeleteOutlined />}>
                      Xóa người dùng
                    </Button>
                  </Popconfirm>
                </Space>
              </TabPane>
            </Tabs>
          </div>
        )}
      </Drawer>
    </div>
  )
}

export default Users

