"use client"

import { useState, useEffect } from "react"
import {
  message,
  Table,
  Space,
  Avatar,
  Button,
  Tooltip,
  Modal,
  Form,
  Input,
  Upload,
  Card,
  Row,
  Col,
  Statistic,
  Select,
  Empty,
  Skeleton,
  Dropdown,
  Menu,
  Flex,
  Typography,
} from "antd"
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  ExclamationCircleOutlined,
  SearchOutlined,
  ReloadOutlined,
  AppstoreOutlined,
  EyeOutlined,
  BarsOutlined,
  PictureOutlined,
  CalendarOutlined,
  SortAscendingOutlined,
  SortDescendingOutlined,
  EllipsisOutlined,
  DownloadOutlined,
  InfoCircleOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons"
import jobService from "../../services/jobService"
import { bannerService } from "../../services/bannerService"
import dayjs from "dayjs"

const { Title, Text, Paragraph } = Typography
const { confirm } = Modal
const { Search } = Input
const { Option } = Select

function JobCategories() {
  const [jobCategories, setJobCategories] = useState([])
  const [filteredCategories, setFilteredCategories] = useState([])
  const [tableLoading, setTableLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [previewImage, setPreviewImage] = useState(null)
  const [fileList, setFileList] = useState([])
  const [form] = Form.useForm()
  const [searchText, setSearchText] = useState("")
  const [uploading, setUploading] = useState(false)
  const [imageUrl, setImageUrl] = useState("")
  const [viewMode, setViewMode] = useState("table")
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [sortOrder, setSortOrder] = useState("ascend")
  const [sortField, setSortField] = useState("name")

  // Load danh sách ngành nghề
  const loadJobCategories = async () => {
    setTableLoading(true)
    try {
      const resData = await jobService.getAllJobCategories()
      setJobCategories(resData)
      setFilteredCategories(resData)
    } catch (error) {
      console.error("Error fetching job categories:", error)
      message.error("Không thể tải danh sách ngành nghề")
    } finally {
      setTableLoading(false)
    }
  }

  useEffect(() => {
    loadJobCategories()
  }, [])

  // Xử lý tìm kiếm
  const handleSearch = (value) => {
    setSearchText(value)
    if (!value.trim()) {
      setFilteredCategories(jobCategories)
      return
    }

    const filtered = jobCategories.filter((category) => category.name.toLowerCase().includes(value.toLowerCase()))
    setFilteredCategories(filtered)
  }

  // Mở modal thêm/sửa
  const openModal = (category = null) => {
    setEditingCategory(category)
    setModalVisible(true)
    form.setFieldsValue(category || { name: "", iconUrl: "" })
    setPreviewImage(category?.iconUrl || null)
    setFileList(category?.iconUrl ? [{ url: category.iconUrl, status: "done" }] : [])
    setUploading(false)
    setImageUrl(category?.iconUrl || "")
  }

  // Đóng modal
  const closeModal = () => {
    setModalVisible(false)
    form.resetFields()
    setPreviewImage(null)
    setFileList([])
    setUploading(false)
    setImageUrl("")
  }

  // Xử lý lưu (Thêm/Sửa)
  const handleSave = async () => {
    try {
      const values = await form.validateFields()

      if (editingCategory) {
        const updateData = {
          ...values,
          iconUrl: imageUrl || editingCategory.iconUrl,
        }
        await jobService.updateJobCategory(editingCategory.id, updateData)
        message.success("Cập nhật ngành nghề thành công!")
      } else {
        await jobService.createJobCategory({ iconUrl: imageUrl, name: values.name })
        message.success("Thêm ngành nghề mới thành công!")
      }

      closeModal()
      loadJobCategories()
    } catch (error) {
      console.error("Error saving job category:", error)
      message.error("Lưu thất bại!")
    }
  }

  // Xác nhận xoá
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
          await jobService.deleteJobCategory(id)
          message.success("Xoá ngành nghề thành công!")
          loadJobCategories()
        } catch (error) {
          console.error("Error deleting job category:", error)
          message.error("Xoá thất bại!")
        }
      },
    })
  }

  // Xử lý xoá nhiều ngành nghề
  const handleBatchDelete = () => {
    if (selectedRowKeys.length === 0) {
      message.warning("Vui lòng chọn ít nhất một ngành nghề để xoá")
      return
    }

    confirm({
      title: `Bạn có chắc chắn muốn xoá ${selectedRowKeys.length} ngành nghề đã chọn?`,
      icon: <ExclamationCircleOutlined style={{ color: "#ff4d4f" }} />,
      content: "Hành động này không thể hoàn tác!",
      okText: "Xoá",
      okType: "danger",
      cancelText: "Hủy",
      async onOk() {
        try {
          // Trong thực tế, bạn có thể gọi API để xoá hàng loạt
          await Promise.all(selectedRowKeys.map((id) => jobService.deleteJobCategory(id)))
          message.success(`Đã xoá ${selectedRowKeys.length} ngành nghề thành công!`)
          setSelectedRowKeys([])
          loadJobCategories()
        } catch (error) {
          console.error("Error batch deleting categories:", error)
          message.error("Xoá hàng loạt thất bại!")
        }
      },
    })
  }

  // Xử lý thay đổi thứ tự sắp xếp
  const handleSortOrderChange = () => {
    const newOrder = sortOrder === "ascend" ? "descend" : "ascend"
    setSortOrder(newOrder)

    const sorted = [...filteredCategories].sort((a, b) => {
      if (sortField === "name") {
        if (newOrder === "ascend") {
          return a.name.localeCompare(b.name)
        } else {
          return b.name.localeCompare(a.name)
        }
      } else if (sortField === "id") {
        if (newOrder === "ascend") {
          return a.id - b.id
        } else {
          return b.id - a.id
        }
      }
      return 0
    })

    setFilteredCategories(sorted)
  }

  // Xử lý upload ảnh
  const customRequest = async ({ file, onSuccess, onError }) => {
    setUploading(true)
    const formData = new FormData()
    formData.append("file", file)

    try {
      const resData = await bannerService.uploadBannerFile(formData)
      const imageUrl = resData.data.imageUrl

      form.setFieldsValue({ iconUrl: imageUrl })
      setPreviewImage(imageUrl)
      setImageUrl(imageUrl)
      onSuccess("ok")
      message.success("Tải ảnh lên thành công")
    } catch (error) {
      console.error("Error uploading file:", error)
      onError(error)
      message.error("Tải ảnh lên thất bại")
    } finally {
      setUploading(false)
    }
  }

  // Cấu hình cột Table
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
      sorter: (a, b) => a.id - b.id,
      sortOrder: sortField === "id" ? sortOrder : null,
    },
    {
      title: "Hình ảnh",
      dataIndex: "iconUrl",
      key: "iconUrl",
      width: 100,
      render: (iconUrl) => (
        <Avatar
          shape="square"
          size={64}
          src={iconUrl}
          icon={<PictureOutlined />}
          style={{ border: "1px solid #f0f0f0" }}
        />
      ),
    },
    {
      title: (
        <Space>
          <BarsOutlined />
          <span>Tên ngành nghề</span>
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
      sorter: (a, b) => a.name.localeCompare(b.name),
      sortOrder: sortField === "name" ? sortOrder : null,
    },
    {
      title: "Ngày tạo",
      dataIndex: "createAt",
      key: "createAt",
      render: (date) => (date ? dayjs(date).format("DD/MM/YYYY HH:mm") : "N/A"),
    },
    {
      title: "Cập nhật",
      dataIndex: "updateAt",
      key: "updateAt",
      render: (date) => (date ? dayjs(date).format("DD/MM/YYYY HH:mm") : "N/A"),
    },
    {
      title: "Hành động",
      key: "action",
      width: 150,
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Xem chi tiết">
            <Button
              icon={<EyeOutlined />}
              type="text"
              onClick={() => message.info(`Xem chi tiết ngành nghề: ${record.name}`)}
            />
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
    if (filteredCategories.length === 0) {
      return <Empty description="Không tìm thấy ngành nghề nào" image={Empty.PRESENTED_IMAGE_SIMPLE} />
    }

    return (
      <Row gutter={[16, 16]}>
        {filteredCategories.map((category) => (
          <Col xs={24} sm={12} md={8} lg={6} key={category.id}>
            <Card
              hoverable
              className="category-card"
              actions={[
                <Tooltip title="Xem chi tiết" key="view">
                  <EyeOutlined key="view" onClick={() => message.info(`Xem chi tiết ngành nghề: ${category.name}`)} />
                </Tooltip>,
                <Tooltip title="Chỉnh sửa" key="edit">
                  <EditOutlined key="edit" onClick={() => openModal(category)} />
                </Tooltip>,
                <Tooltip title="Xoá" key="delete">
                  <DeleteOutlined key="delete" onClick={() => confirmDelete(category.id)} />
                </Tooltip>,
              ]}
            >
              <Skeleton loading={tableLoading} active avatar>
                <Card.Meta
                  avatar={
                    <Avatar
                      shape="square"
                      size={64}
                      src={category.iconUrl}
                      icon={<PictureOutlined />}
                      style={{ border: "1px solid #f0f0f0" }}
                    />
                  }
                  title={<Text strong>{category.name}</Text>}
                  description={
                    <Space direction="vertical" size={0}>
                      <Text type="secondary">ID: {category.id}</Text>
                      <Text type="secondary">
                        <CalendarOutlined style={{ marginRight: 4 }} />
                        {category.createAt ? dayjs(category.createAt).format("DD/MM/YYYY") : "N/A"}
                      </Text>
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
    <div className="job-categories-container">
      <Card className="job-categories-header-card">
        <Flex justify="space-between" align="center" wrap="wrap" gap={16}>
          <Space direction="vertical" size={4}>
            <Title level={3} style={{ margin: 0 }}>
              <AppstoreOutlined /> Quản lý Ngành nghề
            </Title>
            <Text type="secondary">Quản lý danh sách các ngành nghề trong hệ thống</Text>
          </Space>
          <Space wrap>
            <Button icon={<ReloadOutlined />} onClick={loadJobCategories}>
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
              Thêm ngành nghề
            </Button>
          </Space>
        </Flex>
      </Card>

      <Row gutter={[16, 16]} className="stats-row">
        <Col xs={24} sm={8}>
          <Card className="stat-card">
            <Statistic
              title="Tổng số ngành nghề"
              value={jobCategories.length}
              prefix={<AppstoreOutlined />}
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
              value={filteredCategories.length}
              prefix={<SearchOutlined />}
              valueStyle={{ color: "#722ed1" }}
            />
          </Card>
        </Col>
      </Row>

      <Card className="job-categories-filter-card">
        <Flex justify="space-between" align="center" wrap="wrap" gap={16}>
          <Search
            placeholder="Tìm kiếm theo tên ngành nghề..."
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
        <Card className="job-categories-table-card">
          <Table
            loading={tableLoading}
            dataSource={filteredCategories}
            columns={columns}
            rowKey="id"
            rowSelection={rowSelection}
            pagination={{
              pageSize: 10,
              pageSizeOptions: ["5", "10", "20", "50"],
              showSizeChanger: true,
              showTotal: (total) => `Tổng cộng ${total} ngành nghề`,
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
            {editingCategory ? <EditOutlined /> : <PlusOutlined />}
            {editingCategory ? "Chỉnh sửa ngành nghề" : "Thêm ngành nghề mới"}
          </Space>
        }
        open={modalVisible}
        onCancel={closeModal}
        onOk={handleSave}
        okText="Lưu"
        cancelText="Hủy"
        okButtonProps={{ disabled: uploading }}
        width={520}
        maskClosable={false}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Tên ngành nghề"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên ngành nghề!" }]}
          >
            <Input prefix={<BarsOutlined />} placeholder="Nhập tên ngành nghề" />
          </Form.Item>

          <Form.Item
            label="Hình ảnh đại diện"
            name="iconUrl"
            tooltip="Hình ảnh đại diện cho ngành nghề, nên có kích thước vuông"
          >
            <div className="upload-container">
              <Upload
                customRequest={customRequest}
                listType="picture-card"
                fileList={fileList}
                onChange={({ fileList }) => setFileList(fileList)}
                maxCount={1}
                showUploadList={false}
              >
                {previewImage ? (
                  <div className="preview-container">
                    <img src={previewImage || "/placeholder.svg"} alt="Preview" style={{ width: "100%" }} />
                    <div className="preview-overlay">
                      <EditOutlined />
                    </div>
                  </div>
                ) : (
                  <div>
                    {uploading ? <LoadingOutlined /> : <PlusOutlined />}
                    <div style={{ marginTop: 8 }}>Tải lên</div>
                  </div>
                )}
              </Upload>

              <div className="upload-info">
                <Text type="secondary">
                  <InfoCircleOutlined /> Kích thước tối đa: 2MB
                </Text>
                <Text type="secondary">Định dạng: JPG, PNG, SVG</Text>
                {uploading && <Text type="warning">Đang tải lên...</Text>}
              </div>
            </div>
          </Form.Item>

        </Form>
      </Modal>

      <style jsx global>{`
        .job-categories-container {
          padding: 24px;
          background-color: #f0f2f5;
          min-height: 100vh;
        }

        .job-categories-header-card,
        .job-categories-filter-card,
        .job-categories-table-card,
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

        .category-card {
          height: 100%;
          transition: all 0.3s ease;
        }

        .category-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .upload-container {
          display: flex;
          gap: 16px;
          align-items: flex-start;
        }

        .upload-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .preview-container {
          position: relative;
          width: 100%;
          height: 100%;
        }

        .preview-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          opacity: 0;
          transition: opacity 0.3s;
          color: white;
          font-size: 20px;
        }

        .preview-container:hover .preview-overlay {
          opacity: 1;
        }

        /* Dark mode support */
        body.dark .job-categories-container {
          background-color: #141414;
        }

        body.dark .job-categories-header-card,
        body.dark .job-categories-filter-card,
        body.dark .job-categories-table-card,
        body.dark .stat-card {
          background-color: #1f1f1f;
          border-color: #303030;
        }

        body.dark .category-card {
          background-color: #1f1f1f;
          border-color: #303030;
        }
      `}</style>
    </div>
  )
}

// LoadingOutlined component for the upload
const LoadingOutlined = () => (
  <svg viewBox="0 0 1024 1024" className="anticon-spin" width="1em" height="1em" fill="currentColor">
    <path d="M988 548c-19.9 0-36-16.1-36-36 0-59.4-11.6-117-34.6-171.3a440.45 440.45 0 00-94.3-139.9 437.71 437.71 0 00-139.9-94.3C629 83.6 571.4 72 512 72c-19.9 0-36-16.1-36-36s16.1-36 36-36c69.1 0 136.2 13.5 199.3 40.3C772.3 66 827 103 874 150c47 47 83.9 101.8 109.7 162.7 26.7 63.1 40.2 130.2 40.2 199.3.1 19.9-16 36-35.9 36z"></path>
  </svg>
)

export default JobCategories

