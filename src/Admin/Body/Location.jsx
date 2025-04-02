"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  Table,
  Button,
  message,
  Card,
  Space,
  Input,
  Tooltip,
  Modal,
  Form,
  Flex,
  Typography,
  Row,
  Col,
  Statistic,
  Empty,
  Skeleton,
  Avatar,
  Dropdown,
  Menu,
  Badge,
  Select,
} from "antd"
import {
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  ExclamationCircleOutlined,
  EnvironmentOutlined,
  GlobalOutlined,
  ReloadOutlined,
  EllipsisOutlined,
  EyeOutlined,
  SortAscendingOutlined,
  SortDescendingOutlined,
  DownloadOutlined,
  CheckCircleOutlined,
  BuildOutlined,
} from "@ant-design/icons"
import locationService from "../../services/locationService"

const { Title, Text, Paragraph } = Typography
const { confirm } = Modal
const { Search } = Input
const { Option } = Select

function Location() {
  const [locationList, setLocationList] = useState([])
  const [filteredLocations, setFilteredLocations] = useState([])
  const [tableLoading, setTableLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [editingCity, setEditingCity] = useState(null)
  const [searchText, setSearchText] = useState("")
  const [sortOrder, setSortOrder] = useState("ascend")
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [viewMode, setViewMode] = useState("table")
  const [form] = Form.useForm()
  const navigate = useNavigate()

  // Load danh sách thành phố
  const loadLocationList = async () => {
    setTableLoading(true)
    try {
      const resData = await locationService.getAllLocation()
      setLocationList(resData)
      setFilteredLocations(resData)
    } catch (error) {
      console.error("Error fetching locations:", error)
      message.error("Không thể tải danh sách thành phố")
    } finally {
      setTableLoading(false)
    }
  }

  useEffect(() => {
    loadLocationList()
  }, [])

  // Xử lý tìm kiếm
  const handleSearch = (value) => {
    setSearchText(value)
    if (!value.trim()) {
      setFilteredLocations(locationList)
      return
    }

    const filtered = locationList.filter((location) => location.name.toLowerCase().includes(value.toLowerCase()))
    setFilteredLocations(filtered)
  }

  // Mở modal thêm/sửa
  const openModal = (city = null) => {
    setEditingCity(city)
    setModalVisible(true)
    form.setFieldsValue(city || { name: "" })
  }

  // Đóng modal
  const closeModal = () => {
    setModalVisible(false)
    form.resetFields()
  }

  // Xử lý lưu thành phố (Thêm/Sửa)
  const handleSave = async () => {
    try {
      const values = await form.validateFields()
      if (editingCity) {
        await locationService.updateLocation(editingCity.id, values)
        message.success("Cập nhật thành phố thành công!")
      } else {
        await locationService.createLocation(values)
        message.success("Thêm thành phố mới thành công!")
      }
      closeModal()
      loadLocationList()
    } catch (error) {
      console.error("Error saving city:", error)
      message.error("Lưu thất bại!")
    }
  }

  // Xác nhận xoá thành phố
  const confirmDelete = (id) => {
    confirm({
      title: "Bạn có chắc chắn muốn xoá?",
      icon: <ExclamationCircleOutlined style={{ color: "#ff4d4f" }} />,
      content: "Hành động này không thể hoàn tác!",
      okText: "Xoá",
      okType: "danger",
      cancelText: "Hủy",
      async onOk() {
        try {
          await locationService.deleteLocation(id)
          message.success("Xoá thành phố thành công!")
          loadLocationList()
        } catch (error) {
          console.error("Error deleting city:", error)
          message.error("Xoá thất bại!")
        }
      },
    })
  }

  // Xử lý xoá nhiều thành phố
  const handleBatchDelete = () => {
    if (selectedRowKeys.length === 0) {
      message.warning("Vui lòng chọn ít nhất một thành phố để xoá")
      return
    }

    confirm({
      title: `Bạn có chắc chắn muốn xoá ${selectedRowKeys.length} thành phố đã chọn?`,
      icon: <ExclamationCircleOutlined style={{ color: "#ff4d4f" }} />,
      content: "Hành động này không thể hoàn tác!",
      okText: "Xoá",
      okType: "danger",
      cancelText: "Hủy",
      async onOk() {
        try {
          // Trong thực tế, bạn có thể gọi API để xoá hàng loạt
          await Promise.all(selectedRowKeys.map((id) => locationService.deleteLocation(id)))
          message.success(`Đã xoá ${selectedRowKeys.length} thành phố thành công!`)
          setSelectedRowKeys([])
          loadLocationList()
        } catch (error) {
          console.error("Error batch deleting cities:", error)
          message.error("Xoá hàng loạt thất bại!")
        }
      },
    })
  }

  // Xử lý thay đổi thứ tự sắp xếp
  const handleSortOrderChange = () => {
    const newOrder = sortOrder === "ascend" ? "descend" : "ascend"
    setSortOrder(newOrder)

    const sorted = [...filteredLocations].sort((a, b) => {
      if (newOrder === "ascend") {
        return a.name.localeCompare(b.name)
      } else {
        return b.name.localeCompare(a.name)
      }
    })

    setFilteredLocations(sorted)
  }

  // Cấu hình cột Table
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
    },
    {
      title: (
        <Space>
          <EnvironmentOutlined />
          <span>Tên tỉnh/thành phố</span>
          <Button
            type="text"
            icon={sortOrder === "ascend" ? <SortAscendingOutlined /> : <SortDescendingOutlined />}
            onClick={handleSortOrderChange}
            size="small"
          />
        </Space>
      ),
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <Space>
          <Button type="link" onClick={() => navigate(`/cities/${record.id}`)}>
            {text}
          </Button>
          {record.districts && record.districts.length > 0 && (
            <Badge count={record.districts.length} overflowCount={99} style={{ backgroundColor: "#52c41a" }} />
          )}
        </Space>
      ),
      sorter: (a, b) => a.name.localeCompare(b.name),
      sortOrder: sortOrder,
    },
    {
      title: "Hành động",
      key: "actions",
      width: 150,
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Xem chi tiết">
            <Button icon={<EyeOutlined />} type="text" onClick={() => navigate(`/cities/${record.id}`)} />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button icon={<EditOutlined />} type="text" onClick={() => openModal(record)} />
          </Tooltip>
          <Tooltip title="Xóa">
            <Button icon={<DeleteOutlined />} type="text" danger onClick={() => confirmDelete(record.id)} />
          </Tooltip>
        </Space>
      ),
    },
  ]

  // Cấu hình chọn hàng
  const rowSelection = {
    selectedRowKeys,
    onChange: (keys) => setSelectedRowKeys(keys),
    selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT, Table.SELECTION_NONE],
  }

  // Menu cho dropdown hành động hàng loạt
  const batchActionMenu = (
    <Menu>
      <Menu.Item key="delete" icon={<DeleteOutlined />} danger onClick={handleBatchDelete}>
        Xoá đã chọn
      </Menu.Item>
      <Menu.Item key="export" icon={<DownloadOutlined />}>
        Xuất Excel
      </Menu.Item>
    </Menu>
  )

  // Render card view
  const renderCardView = () => {
    if (filteredLocations.length === 0) {
      return <Empty description="Không tìm thấy thành phố nào" image={Empty.PRESENTED_IMAGE_SIMPLE} />
    }

    return (
      <Row gutter={[16, 16]}>
        {filteredLocations.map((city) => (
          <Col xs={24} sm={12} md={8} lg={6} key={city.id}>
            <Card
              hoverable
              className="city-card"
              actions={[
                <Tooltip title="Xem chi tiết" key="view">
                  <EyeOutlined key="view" onClick={() => navigate(`/cities/${city.id}`)} />
                </Tooltip>,
                <Tooltip title="Chỉnh sửa" key="edit">
                  <EditOutlined key="edit" onClick={() => openModal(city)} />
                </Tooltip>,
                <Tooltip title="Xoá" key="delete">
                  <DeleteOutlined key="delete" onClick={() => confirmDelete(city.id)} />
                </Tooltip>,
              ]}
            >
              <Skeleton loading={tableLoading} active avatar>
                <Card.Meta
                  avatar={<Avatar icon={<EnvironmentOutlined />} style={{ backgroundColor: "#1890ff" }} size="large" />}
                  title={
                    <Space>
                      <Text strong>{city.name}</Text>
                      {city.districts && city.districts.length > 0 && (
                        <Badge
                          count={city.districts.length}
                          overflowCount={99}
                          style={{ backgroundColor: "#52c41a" }}
                        />
                      )}
                    </Space>
                  }
                  description={
                    <Space direction="vertical" size={0}>
                      <Text type="secondary">ID: {city.id}</Text>
                      {city.districts && <Text type="secondary">{city.districts.length} quận/huyện</Text>}
                    </Space>
                  }
                />
              </Skeleton>
            </Card>
          </Col>
        ))}
      </Row>
    )
  }

  return (
    <div className="location-container">
      <Card className="location-header-card">
        <Flex justify="space-between" align="center" wrap="wrap" gap={16}>
          <Space direction="vertical" size={4}>
            <Title level={3} style={{ margin: 0 }}>
              <GlobalOutlined /> Quản lý Tỉnh/Thành phố
            </Title>
            <Text type="secondary">Quản lý danh sách các tỉnh thành trên toàn quốc</Text>
          </Space>
          <Space wrap>
            <Button icon={<ReloadOutlined />} onClick={loadLocationList}>
              Làm mới
            </Button>
            <Select
              value={viewMode}
              onChange={setViewMode}
              style={{ width: 120 }}
              options={[
                { value: "table", label: "Dạng bảng" },
                { value: "card", label: "Dạng thẻ" },
              ]}
            />
            <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal()}>
              Thêm Tỉnh/Thành phố
            </Button>
          </Space>
        </Flex>
      </Card>

      <Row gutter={[16, 16]} className="stats-row">
        <Col xs={24} sm={8}>
          <Card className="stat-card">
            <Statistic
              title="Tổng số tỉnh/thành phố"
              value={locationList.length}
              prefix={<GlobalOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card className="stat-card">
            <Statistic
              title="Đã chọn"
              value={selectedRowKeys.length}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card className="stat-card">
            <Statistic
              title="Kết quả tìm kiếm"
              value={filteredLocations.length}
              prefix={<SearchOutlined />}
              valueStyle={{ color: "#722ed1" }}
            />
          </Card>
        </Col>
      </Row>

      <Card className="location-filter-card">
        <Flex justify="space-between" align="center" wrap="wrap" gap={16}>
          <Search
            placeholder="Tìm kiếm theo tên..."
            allowClear
            enterButton
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onSearch={handleSearch}
            style={{ width: 300 }}
          />

          {selectedRowKeys.length > 0 && (
            <Dropdown overlay={batchActionMenu} placement="bottomRight">
              <Button>
                Hành động hàng loạt <EllipsisOutlined />
              </Button>
            </Dropdown>
          )}
        </Flex>
      </Card>

      {viewMode === "table" ? (
        <Card className="location-table-card">
          <Table
            loading={tableLoading}
            dataSource={filteredLocations}
            columns={columns}
            rowKey="id"
            rowSelection={rowSelection}
            pagination={{
              pageSize: 10,
              pageSizeOptions: ["5", "10", "20", "50"],
              showSizeChanger: true,
              showTotal: (total) => `Tổng cộng ${total} tỉnh/thành phố`,
            }}
          />
        </Card>
      ) : (
        renderCardView()
      )}

      {/* Modal Thêm/Sửa */}
      <Modal
        title={
          <Space>
            {editingCity ? <EditOutlined /> : <PlusOutlined />}
            {editingCity ? "Chỉnh sửa Tỉnh/Thành phố" : "Thêm Tỉnh/Thành phố"}
          </Space>
        }
        open={modalVisible}
        onCancel={closeModal}
        onOk={handleSave}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Tên Tỉnh/Thành phố"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên tỉnh/thành phố!" }]}
          >
            <Input prefix={<EnvironmentOutlined />} placeholder="Nhập tên tỉnh/thành phố" />
          </Form.Item>
          <Form.Item label="Mã tỉnh/thành phố" name="code" tooltip="Mã dùng để phân biệt các tỉnh/thành phố">
            <Input prefix={<BuildOutlined />} placeholder="Nhập mã tỉnh/thành phố (không bắt buộc)" />
          </Form.Item>
        </Form>
      </Modal>

      <style jsx global>{`
        .location-container {
          padding: 24px;
          background-color: #f0f2f5;
          min-height: 100vh;
        }

        .location-header-card,
        .location-filter-card,
        .location-table-card,
        .stat-card {
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

        .city-card {
          height: 100%;
          transition: all 0.3s ease;
        }

        .city-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        /* Dark mode support */
        body.dark .location-container {
          background-color: #141414;
        }

        body.dark .location-header-card,
        body.dark .location-filter-card,
        body.dark .location-table-card,
        body.dark .stat-card {
          background-color: #1f1f1f;
          border-color: #303030;
        }

        body.dark .city-card {
          background-color: #1f1f1f;
          border-color: #303030;
        }
      `}</style>
    </div>
  )
}

export default Location

