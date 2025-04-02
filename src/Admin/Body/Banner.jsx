"use client"

import { useEffect, useState } from "react"
import {
  Table,
  Space,
  Button,
  message,
  Image,
  Modal,
  Form,
  Input,
  Switch,
  Card,
  Typography,
  Tooltip,
  Popconfirm,
  Flex,
  Tag,
  Divider,
  Empty,
  Select,
  Upload,
  Row,
  Col,
  Statistic,
  Tabs,
  Badge,
  Segmented,
  Dropdown,
  Menu,
} from "antd"
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  InfoCircleOutlined,
  ReloadOutlined,
  EyeOutlined,
  PictureOutlined,
  LinkOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  FilterOutlined,
  AppstoreOutlined,
  UnorderedListOutlined,
  ExclamationCircleOutlined,
  DownloadOutlined,
  EllipsisOutlined,
  CalendarOutlined,
} from "@ant-design/icons"
import { bannerService } from "../../services/bannerService"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import "dayjs/locale/vi"

dayjs.extend(relativeTime)
dayjs.locale("vi")

const { Title, Text, Paragraph } = Typography
const { Option } = Select
const { TabPane } = Tabs
const { Search } = Input

function Banner() {
  const [bannerList, setBannerList] = useState([])
  const [filteredBanners, setFilteredBanners] = useState([])
  const [tableLoading, setTableLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingBanner, setEditingBanner] = useState(null)
  const [imageUrl, setImageUrl] = useState(null)
  const [form] = Form.useForm()
  const [searchText, setSearchText] = useState("")
  const [typeFilter, setTypeFilter] = useState(null)
  const [statusFilter, setStatusFilter] = useState(null)
  const [viewMode, setViewMode] = useState("table")
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [previewVisible, setPreviewVisible] = useState(false)
  const [previewImage, setPreviewImage] = useState("")
  const [uploading, setUploading] = useState(false)
  const [activeTab, setActiveTab] = useState("all")

  // Load danh sách banner
  const loadBannerList = async () => {
    setTableLoading(true)
    try {
      const resData = await bannerService.getAllBanner()
      setBannerList(resData.data)
      setFilteredBanners(resData.data)
    } catch (error) {
      console.error("Error fetching banners:", error)
      message.error("Không thể tải danh sách banner")
    } finally {
      setTableLoading(false)
    }
  }

  useEffect(() => {
    loadBannerList()
  }, [])

  // Lọc banner dựa trên tìm kiếm, loại và trạng thái
  useEffect(() => {
    let filtered = [...bannerList]

    // Filter by active tab
    if (activeTab === "active") {
      filtered = filtered.filter((banner) => banner.isActive)
    } else if (activeTab === "inactive") {
      filtered = filtered.filter((banner) => !banner.isActive)
    }

    // Filter by search text
    if (searchText) {
      filtered = filtered.filter((banner) => banner.description?.toLowerCase().includes(searchText.toLowerCase()))
    }

    // Filter by type
    if (typeFilter) {
      filtered = filtered.filter((banner) => banner.type === typeFilter)
    }

    // Filter by status
    if (statusFilter !== null) {
      filtered = filtered.filter((banner) => banner.isActive === statusFilter)
    }

    setFilteredBanners(filtered)
  }, [bannerList, searchText, typeFilter, statusFilter, activeTab])

  // Xử lý toggle trạng thái banner
  const handleToggleBanner = async (checked, record) => {
    try {
      await bannerService.updateBannerStatus(record.id, checked)
      setBannerList((prevList) =>
        prevList.map((banner) => (banner.id === record.id ? { ...banner, isActive: checked } : banner)),
      )
      message.success(`Banner đã được ${checked ? "kích hoạt" : "vô hiệu hóa"} thành công.`)
    } catch (error) {
      console.error("Error updating banner status:", error)
      message.error("Không thể cập nhật trạng thái banner")
    }
  }

  // Xử lý chỉnh sửa banner
  const handleEdit = (banner) => {
    setEditingBanner(banner)
    setImageUrl(banner.imageUrl)
    form.setFieldsValue(banner)
    setIsModalOpen(true)
  }

  // Xử lý xóa banner
  const handleDelete = async (id) => {
    try {
      const deleteBanner = await bannerService.deleteBanner(id)
      message.success(deleteBanner.message || "Xóa banner thành công")
      loadBannerList()
    } catch (error) {
      console.error("Error deleting banner:", error)
      message.error("Không thể xóa banner")
    }
  }

  // Xử lý xóa nhiều banner
  const handleBatchDelete = () => {
    if (selectedRowKeys.length === 0) {
      message.warning("Vui lòng chọn ít nhất một banner để xóa")
      return
    }

    Modal.confirm({
      title: `Xóa ${selectedRowKeys.length} banner đã chọn?`,
      icon: <ExclamationCircleOutlined style={{ color: "#ff4d4f" }} />,
      content: "Hành động này không thể hoàn tác!",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          // Trong thực tế, bạn có thể gọi API để xóa hàng loạt
          await Promise.all(selectedRowKeys.map((id) => bannerService.deleteBanner(id)))
          message.success(`Đã xóa ${selectedRowKeys.length} banner thành công!`)
          setSelectedRowKeys([])
          loadBannerList()
        } catch (error) {
          console.error("Error batch deleting banners:", error)
          message.error("Xóa hàng loạt thất bại!")
        }
      },
    })
  }

  // Xử lý submit form
  const handleSubmit = async (values) => {
    try {
      if (editingBanner) {
        await bannerService.updateBanner(editingBanner.id, values)
        message.success("Cập nhật banner thành công")
      } else {
        await bannerService.createBanner(values)
        message.success("Thêm banner thành công")
      }
      setIsModalOpen(false)
      form.resetFields()
      setEditingBanner(null)
      setImageUrl(null)
      loadBannerList()
    } catch (error) {
      console.error("Error saving banner:", error)
      message.error("Không thể lưu banner")
    }
  }

  // Xử lý hủy modal
  const handleCancel = () => {
    setIsModalOpen(false)
    setEditingBanner(null)
    setImageUrl(null)
    form.resetFields()
  }

  // Xử lý reset bộ lọc
  const resetFilters = () => {
    setSearchText("")
    setTypeFilter(null)
    setStatusFilter(null)
    setActiveTab("all")
  }

  // Xử lý upload ảnh
  const customRequest = async ({ file, onSuccess, onError }) => {
    setUploading(true)
    const formData = new FormData()
    formData.append("file", file)

    try {
      const resData = await bannerService.uploadBannerFile(formData)
      const uploadedImageUrl = resData.data.imageUrl
      setImageUrl(uploadedImageUrl)
      form.setFieldsValue({ imageUrl: uploadedImageUrl })
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

  // Xử lý xem trước ảnh
  const handlePreview = (imageUrl) => {
    setPreviewImage(imageUrl)
    setPreviewVisible(true)
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
      title: "Hình ảnh",
      dataIndex: "imageUrl",
      key: "imageUrl",
      width: 150,
      render: (imageUrl) => (
        <div className="banner-image-container">
          <Image
            src={imageUrl || "/placeholder.svg"}
            alt="Banner Image"
            width={120}
            height={70}
            style={{ objectFit: "cover", borderRadius: "8px", cursor: "pointer" }}
            onClick={() => handlePreview(imageUrl)}
            preview={false}
          />
          <div className="banner-image-overlay">
            <EyeOutlined onClick={() => handlePreview(imageUrl)} />
          </div>
        </div>
      ),
    },
    {
      title: "Loại",
      dataIndex: "type",
      key: "type",
      width: 120,
      render: (type) => {
        const color = type === "BANNER" ? "blue" : type === "POPUP" ? "purple" : "default"
        const icon = type === "BANNER" ? <PictureOutlined /> : <InfoCircleOutlined />
        return (
          <Tag color={color} icon={icon}>
            {type}
          </Tag>
        )
      },
      filters: [
        { text: "BANNER", value: "BANNER" },
        { text: "POPUP", value: "POPUP" },
      ],
      onFilter: (value, record) => record.type === value,
    },
    // {
    //   title: "Mô tả",
    //   dataIndex: "description",
    //   key: "description",
    //   ellipsis: true,
    //   render: (description) => (
    //     <Tooltip title={description}>
    //       <Text ellipsis style={{ maxWidth: 200 }}>
    //         {description}
    //       </Text>
    //     </Tooltip>
    //   ),
    // },
    {
      title: "Link",
      dataIndex: "buttonLink",
      key: "buttonLink",
      width: 100,
      render: (link) =>
        link ? (
          <Tooltip title={link}>
            <Button type="link" icon={<LinkOutlined />} onClick={() => window.open(link, "_blank")} size="small">
              Mở link
            </Button>
          </Tooltip>
        ) : (
          <Text type="secondary">Không có</Text>
        ),
    },
    {
      title: "Trạng thái",
      dataIndex: "isActive",
      key: "isActive",
      width: 120,
      render: (isActive, record) => (
        <Space>
          <Switch checked={isActive} onChange={(checked) => handleToggleBanner(checked, record)} />
          <Tag
            color={isActive ? "success" : "error"}
            icon={isActive ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
          >
            {isActive ? "Đang hiển thị" : "Đã ẩn"}
          </Tag>
        </Space>
      ),
      filters: [
        { text: "Đang hiển thị", value: true },
        { text: "Đã ẩn", value: false },
      ],
      onFilter: (value, record) => record.isActive === value,
    },
    {
      title: "Ngày tạo",
      dataIndex: "createAt",
      key: "createAt",
      width: 150,
      render: (createAt) => (
        <Tooltip title={dayjs(createAt).format("DD/MM/YYYY HH:mm:ss")}>
          <Text>{dayjs(createAt).fromNow()}</Text>
        </Tooltip>
      ),
      sorter: (a, b) => new Date(a.createAt) - new Date(b.createAt),
    },
    {
      title: "Hành động",
      key: "action",
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Xem chi tiết">
            <Button type="text" icon={<EyeOutlined />} onClick={() => handlePreview(record.imageUrl)} />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button type="text" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          </Tooltip>
          <Tooltip title="Xóa">
            <Popconfirm
              title="Xóa banner"
              description="Bạn có chắc chắn muốn xóa banner này?"
              onConfirm={() => handleDelete(record.id)}
              okText="Xóa"
              cancelText="Hủy"
              okButtonProps={{ danger: true }}
            >
              <Button type="text" danger icon={<DeleteOutlined />} />
            </Popconfirm>
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
        Xóa đã chọn
      </Menu.Item>
      <Menu.Item key="export" icon={<DownloadOutlined />}>
        Xuất Excel
      </Menu.Item>
    </Menu>
  )

  // Render card view
  const renderCardView = () => {
    if (filteredBanners.length === 0) {
      return <Empty description="Không tìm thấy banner nào" />
    }

    return (
      <Row gutter={[16, 16]}>
        {filteredBanners.map((banner) => (
          <Col xs={24} sm={12} md={8} lg={6} key={banner.id}>
            <Card
              hoverable
              className="banner-card"
              cover={
                <div className="banner-card-image-container">
                  <img
                    alt={banner.description}
                    src={banner.imageUrl || "/placeholder.svg"}
                    style={{ height: 160, objectFit: "cover" }}
                    onClick={() => handlePreview(banner.imageUrl)}
                  />
                  <div className="banner-card-image-overlay">
                    <EyeOutlined onClick={() => handlePreview(banner.imageUrl)} />
                  </div>
                  <Badge
                    status={banner.isActive ? "success" : "error"}
                    text={banner.isActive ? "Đang hiển thị" : "Đã ẩn"}
                    className="banner-card-badge"
                  />
                </div>
              }
              actions={[
                <Tooltip title="Xem chi tiết" key="view">
                  <EyeOutlined key="view" onClick={() => handlePreview(banner.imageUrl)} />
                </Tooltip>,
                <Tooltip title="Chỉnh sửa" key="edit">
                  <EditOutlined key="edit" onClick={() => handleEdit(banner)} />
                </Tooltip>,
                <Tooltip title="Xóa" key="delete">
                  <Popconfirm
                    title="Xóa banner"
                    description="Bạn có chắc chắn muốn xóa banner này?"
                    onConfirm={() => handleDelete(banner.id)}
                    okText="Xóa"
                    cancelText="Hủy"
                    okButtonProps={{ danger: true }}
                  >
                    <DeleteOutlined key="delete" />
                  </Popconfirm>
                </Tooltip>,
              ]}
            >
              <div className="banner-card-content">
                <div className="banner-card-header">
                  <Space>
                    <Tag color={banner.type === "BANNER" ? "blue" : "purple"}>{banner.type}</Tag>
                    <Tag
                      color={banner.isActive ? "success" : "error"}
                      icon={banner.isActive ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
                    >
                      {banner.isActive ? "Đang hiển thị" : "Đã ẩn"}
                    </Tag>
                  </Space>
                  <Switch
                    checked={banner.isActive}
                    onChange={(checked) => handleToggleBanner(checked, banner)}
                    size="small"
                  />
                </div>
                <Paragraph ellipsis={{ rows: 2 }} title={banner.description}>
                  {banner.description || "Không có mô tả"}
                </Paragraph>
                <div className="banner-card-footer">
                  <Text type="secondary" className="banner-card-date">
                    <CalendarOutlined /> {dayjs(banner.createAt).format("DD/MM/YYYY")}
                  </Text>
                  {banner.buttonLink && (
                    <Button
                      type="link"
                      icon={<LinkOutlined />}
                      onClick={() => window.open(banner.buttonLink, "_blank")}
                      size="small"
                      className="banner-card-link"
                    >
                      Mở link
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    )
  }

  // Thống kê
  const stats = {
    total: bannerList.length,
    active: bannerList.filter((banner) => banner.isActive).length,
    inactive: bannerList.filter((banner) => !banner.isActive).length,
    banner: bannerList.filter((banner) => banner.type === "BANNER").length,
    popup: bannerList.filter((banner) => banner.type === "POPUP").length,
  }

  return (
    <div className="banner-container">
      <Card className="banner-header-card">
        <Flex justify="space-between" align="center" wrap="wrap" gap={16}>
          <Space direction="vertical" size={4}>
            <Title level={3} style={{ margin: 0 }}>
              <PictureOutlined /> Quản lý Banner
            </Title>
            <Text type="secondary">Quản lý tất cả banner và popup trong hệ thống</Text>
          </Space>
          <Space wrap>
            <Button icon={<ReloadOutlined />} onClick={loadBannerList}>
              Làm mới
            </Button>
            <Segmented
              options={[
                {
                  value: "table",
                  icon: <UnorderedListOutlined />,
                },
                {
                  value: "card",
                  icon: <AppstoreOutlined />,
                },
              ]}
              value={viewMode}
              onChange={setViewMode}
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                setEditingBanner(null)
                setImageUrl(null)
                form.resetFields()
                setIsModalOpen(true)
              }}
            >
              Thêm banner mới
            </Button>
          </Space>
        </Flex>
      </Card>

      <Row gutter={[16, 16]} className="stats-row">
        <Col xs={24} sm={12} md={8} lg={6} xl={4}>
          <Card className="stat-card">
            <Statistic
              title="Tổng số banner"
              value={stats.total}
              prefix={<PictureOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6} xl={4}>
          <Card className="stat-card">
            <Statistic
              title="Đang hiển thị"
              value={stats.active}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6} xl={4}>
          <Card className="stat-card">
            <Statistic
              title="Đã ẩn"
              value={stats.inactive}
              prefix={<CloseCircleOutlined />}
              valueStyle={{ color: "#ff4d4f" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6} xl={4}>
          <Card className="stat-card">
            <Statistic
              title="Banner"
              value={stats.banner}
              prefix={<PictureOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6} xl={4}>
          <Card className="stat-card">
            <Statistic
              title="Popup"
              value={stats.popup}
              prefix={<InfoCircleOutlined />}
              valueStyle={{ color: "#722ed1" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6} xl={4}>
          <Card className="stat-card">
            <Statistic
              title="Đã chọn"
              value={selectedRowKeys.length}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: "#fa8c16" }}
            />
          </Card>
        </Col>
      </Row>

      <Card className="banner-filter-card">
        <Flex justify="space-between" align="center" wrap="wrap" gap={16}>
          <Space wrap>
            <Search
              placeholder="Tìm kiếm theo mô tả..."
              allowClear
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 250 }}
            />
            <Select
              placeholder="Loại banner"
              allowClear
              value={typeFilter}
              onChange={setTypeFilter}
              style={{ width: 150 }}
            >
              <Option value="BANNER">BANNER</Option>
              <Option value="POPUP">POPUP</Option>
            </Select>
            <Select
              placeholder="Trạng thái"
              allowClear
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: 150 }}
            >
              <Option value={true}>Đang hiển thị</Option>
              <Option value={false}>Đã ẩn</Option>
            </Select>
            {(searchText || typeFilter || statusFilter !== null) && (
              <Button icon={<FilterOutlined />} onClick={resetFilters}>
                Xóa bộ lọc
              </Button>
            )}
          </Space>

          {selectedRowKeys.length > 0 && (
            <Dropdown overlay={batchActionMenu} placement="bottomRight">
              <Button>
                Hành động hàng loạt <EllipsisOutlined />
              </Button>
            </Dropdown>
          )}
        </Flex>
      </Card>

      <Tabs activeKey={activeTab} onChange={setActiveTab} className="banner-tabs">
        <TabPane
          tab={
            <span>
              <PictureOutlined /> Tất cả ({stats.total})
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

      {viewMode === "table" ? (
        <Card className="banner-table-card">
          <Table
            columns={columns}
            dataSource={filteredBanners}
            loading={tableLoading}
            rowKey="id"
            rowSelection={rowSelection}
            locale={{
              emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Không tìm thấy banner nào" />,
            }}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              pageSizeOptions: ["5", "10", "20", "50"],
              showTotal: (total) => `Tổng số ${total} banner`,
            }}
          />
        </Card>
      ) : (
        renderCardView()
      )}

      {/* Modal Thêm/Sửa Banner */}
      <Modal
        title={
          <Space>
            {editingBanner ? <EditOutlined /> : <PlusOutlined />}
            {editingBanner ? "Chỉnh sửa Banner" : "Thêm Banner Mới"}
          </Space>
        }
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        width={700}
        maskClosable={false}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={
            editingBanner
              ? {
                  ...editingBanner,
                  imageUrl: imageUrl || editingBanner.imageUrl,
                }
              : {
                  isActive: false,
                  type: undefined,
                  description: "",
                  buttonLink: "",
                  imageUrl: null,
                }
          }
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="type"
                label="Loại"
                rules={[{ required: true, message: "Vui lòng chọn loại" }]}
                tooltip={{ title: "Chọn loại banner", icon: <InfoCircleOutlined /> }}
              >
                <Select placeholder="Chọn loại">
                  <Option value="BANNER">BANNER</Option>
                  <Option value="POPUP">POPUP</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="isActive"
                label="Trạng thái"
                valuePropName="checked"
                tooltip={{ title: "Bật/tắt trạng thái banner", icon: <InfoCircleOutlined /> }}
              >
                <Switch checkedChildren="Hiển thị" unCheckedChildren="Ẩn" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="Mô tả"
            rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
            tooltip={{ title: "Mô tả chi tiết về banner", icon: <InfoCircleOutlined /> }}
          >
            <Input.TextArea placeholder="Nhập mô tả" rows={3} />
          </Form.Item>

          <Form.Item
            name="buttonLink"
            label="Link điều hướng"
            tooltip={{ title: "URL khi nhấn vào banner", icon: <InfoCircleOutlined /> }}
          >
            <Input
              placeholder="Nhập link điều hướng"
              prefix={<LinkOutlined />}
              addonAfter={
                <Tooltip title="Kiểm tra link">
                  <Button
                    type="link"
                    icon={<EyeOutlined />}
                    onClick={() => {
                      const link = form.getFieldValue("buttonLink")
                      if (link) window.open(link, "_blank")
                    }}
                    disabled={!form.getFieldValue("buttonLink")}
                    size="small"
                    style={{ margin: -7 }}
                  />
                </Tooltip>
              }
            />
          </Form.Item>

          <Form.Item
            name="imageUrl"
            label="Hình ảnh"
            rules={[{ required: true, message: "Vui lòng tải lên hình ảnh" }]}
            tooltip={{ title: "Tải lên hình ảnh banner", icon: <InfoCircleOutlined /> }}
          >
            <div className="upload-container">
              <Upload customRequest={customRequest} listType="picture-card" maxCount={1} showUploadList={false}>
                {imageUrl ? (
                  <div className="preview-container">
                    <img
                      src={imageUrl || "/placeholder.svg"}
                      alt="Preview"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
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
                <Text type="secondary">Định dạng: JPG, PNG, GIF</Text>
                <Text type="secondary">Kích thước khuyến nghị: 1200x400px</Text>
                {uploading && <Text type="warning">Đang tải lên...</Text>}
              </div>
            </div>
          </Form.Item>

          <Divider />

          <Form.Item className="form-actions">
            <Space>
              <Button onClick={handleCancel}>Hủy</Button>
              <Button type="primary" htmlType="submit" loading={uploading} disabled={uploading}>
                {editingBanner ? "Cập nhật" : "Thêm mới"}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal xem trước ảnh */}
      <Modal open={previewVisible} footer={null} onCancel={() => setPreviewVisible(false)} width={800} centered>
        <img alt="Preview" style={{ width: "100%" }} src={previewImage || "/placeholder.svg"} />
      </Modal>

      <style jsx global>{`
        .banner-container {
          padding: 24px;
          background-color: #f0f2f5;
          min-height: 100vh;
        }

        .banner-header-card,
        .banner-filter-card,
        .banner-table-card,
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

        .banner-tabs {
          margin-bottom: 16px;
          background: white;
          padding: 8px 16px 0;
          border-radius: 8px;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px rgba(0, 0, 0, 0.02);
        }

        .banner-image-container {
          position: relative;
          overflow: hidden;
        }

        .banner-image-overlay {
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

        .banner-image-container:hover .banner-image-overlay {
          opacity: 1;
        }

        .banner-card {
          height: 100%;
          transition: all 0.3s ease;
        }

        .banner-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .banner-card-image-container {
          position: relative;
          overflow: hidden;
        }

        .banner-card-image-overlay {
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
          font-size: 24px;
        }

        .banner-card-image-container:hover .banner-card-image-overlay {
          opacity: 1;
        }

        .banner-card-badge {
          position: absolute;
          top: 8px;
          right: 8px;
          background-color: rgba(255, 255, 255, 0.8);
          padding: 2px 8px;
          border-radius: 4px;
        }

        .banner-card-content {
          padding: 12px 0;
        }

        .banner-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .banner-card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 8px;
          flex-wrap: wrap;
          gap: 8px;
        }

        .banner-card-date {
          font-size: 12px;
        }

        .banner-card-link {
          padding: 0;
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

        .form-actions {
          display: flex;
          justify-content: flex-end;
          margin-bottom: 0;
        }

        /* Dark mode support */
        body.dark .banner-container {
          background-color: #141414;
        }

        body.dark .banner-header-card,
        body.dark .banner-filter-card,
        body.dark .banner-table-card,
        body.dark .stat-card,
        body.dark .banner-tabs {
          background-color: #1f1f1f;
          border-color: #303030;
        }

        body.dark .banner-card {
          background-color: #1f1f1f;
          border-color: #303030;
        }

        body.dark .banner-card-badge {
          background-color: rgba(0, 0, 0, 0.8);
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

export default Banner

