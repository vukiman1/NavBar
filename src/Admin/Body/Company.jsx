"use client"

import { useEffect, useState } from "react"
import {
  Card,
  Flex,
  message,
  Tag,
  Typography,
  Table,
  Space,
  Button,
  Avatar,
  Modal,
  Descriptions,
  Input,
  Select,
  Drawer,
  Divider,
  Badge,
  Row,
  Col,
  Statistic,
  Empty,
  Tabs,
  Tooltip,
} from "antd"
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  GlobalOutlined,
  EnvironmentOutlined,
  TeamOutlined,
  CalendarOutlined,
  PhoneOutlined,
  MailOutlined,
  BankOutlined,
  FilterOutlined,
  ReloadOutlined,
  PlusOutlined,
  InfoCircleOutlined,
  UserOutlined,
  NumberOutlined,
  FacebookOutlined,
  YoutubeOutlined,
  LinkedinOutlined,
  ExclamationCircleOutlined,
  SearchOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons"
import { Link } from "react-router-dom"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import "dayjs/locale/vi"
import companyService from "./../../services/companyService"

dayjs.extend(relativeTime)
dayjs.locale("vi")

const { Title, Text, Paragraph } = Typography
const { Option } = Select
const { TabPane } = Tabs

const Company = () => {
  const [companyList, setCompanyList] = useState([])
  const [filteredCompanies, setFilteredCompanies] = useState([])
  const [tableLoading, setTableLoading] = useState(false)
  const [selectedCompany, setSelectedCompany] = useState(null)
  const [isDetailDrawerVisible, setIsDetailDrawerVisible] = useState(false)
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false)
  const [filterDrawerVisible, setFilterDrawerVisible] = useState(false)
  const [activeFilters, setActiveFilters] = useState(0)

  // Bộ lọc
  const [searchText, setSearchText] = useState("")
  const [cityFilter, setCityFilter] = useState(null)
  const [sizeFilter, setSizeFilter] = useState(null)
  const [fieldFilter, setFieldFilter] = useState(null)
  const [hasWebsiteFilter, setHasWebsiteFilter] = useState(null)
  const [hasSocialMediaFilter, setHasSocialMediaFilter] = useState(null)

  // Pagination
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  })

  const loadCompanyList = async () => {
    setTableLoading(true)
    try {
      const resData = await companyService.getAllCompany()
      console.log(resData)
      setCompanyList(resData)
      setFilteredCompanies(resData)

      // Count active filters
      let filterCount = 0
      if (searchText) filterCount++
      if (cityFilter) filterCount++
      if (sizeFilter) filterCount++
      if (fieldFilter) filterCount++
      if (hasWebsiteFilter !== null) filterCount++
      if (hasSocialMediaFilter !== null) filterCount++
      setActiveFilters(filterCount)
    } catch (error) {
      console.error("Error fetching companies:", error)
      message.error("Không thể tải danh sách công ty")
    } finally {
      setTableLoading(false)
    }
  }

  useEffect(() => {
    loadCompanyList()
  }, [])

  // Xử lý tìm kiếm & bộ lọc
  useEffect(() => {
    let filtered = companyList

    if (searchText) {
      filtered = filtered.filter((company) => company.companyName.toLowerCase().includes(searchText.toLowerCase()))
    }

    if (cityFilter) {
      filtered = filtered.filter((company) => company.location?.city?.name === cityFilter)
    }

    if (sizeFilter) {
      filtered = filtered.filter((company) => company.employeeSize === Number.parseInt(sizeFilter))
    }

    if (fieldFilter) {
      filtered = filtered.filter((company) => company.fieldOperation?.toLowerCase().includes(fieldFilter.toLowerCase()))
    }

    if (hasWebsiteFilter !== null) {
      filtered = filtered.filter((company) => (hasWebsiteFilter ? !!company.websiteUrl : !company.websiteUrl))
    }

    if (hasSocialMediaFilter !== null) {
      filtered = filtered.filter((company) =>
        hasSocialMediaFilter
          ? !!company.facebookUrl || !!company.youtubeUrl || !!company.linkedinUrl
          : !company.facebookUrl && !company.youtubeUrl && !company.linkedinUrl,
      )
    }

    setFilteredCompanies(filtered)
  }, [searchText, cityFilter, sizeFilter, fieldFilter, hasWebsiteFilter, hasSocialMediaFilter, companyList])

  const handleTableChange = (pagination) => {
    setPagination(pagination)
  }

  const handleDelete = async () => {
    try {
      // In a real application, you would call an API
      // await companyService.deleteCompany(selectedCompany.id);

      // Update local state
      const updatedList = companyList.filter((item) => item.id !== selectedCompany.id)
      setCompanyList(updatedList)
      setFilteredCompanies(updatedList.filter((item) => item.id !== selectedCompany.id))

      setIsDeleteModalVisible(false)
      message.success("Xóa công ty thành công")
    } catch (error) {
      console.error("Error deleting company:", error)
      message.error("Không thể xóa công ty")
    }
  }

  const showCompanyDetails = (company) => {
    setSelectedCompany(company)
    setIsDetailDrawerVisible(true)
  }

  const resetFilters = () => {
    setSearchText("")
    setCityFilter(null)
    setSizeFilter(null)
    setFieldFilter(null)
    setHasWebsiteFilter(null)
    setHasSocialMediaFilter(null)
    setPagination({
      current: 1,
      pageSize: 10,
    })
    message.success("Đã xóa tất cả bộ lọc")
  }

  const columns = [
    {
      title: "Công ty",
      key: "company",
      render: (_, record) => (
        <Flex align="center" gap="middle">
          <Avatar
            src={record.companyImageUrl}
            size={64}
            shape="square"
            style={{
              border: "1px solid #f0f0f0",
              backgroundColor: "white",
              objectFit: "contain",
              borderRadius: "8px",
            }}
          />
          <Flex vertical>
            <Text strong style={{ fontSize: 16 }}>
              {record.companyName}
            </Text>
            <Text type="secondary" style={{ marginTop: 4 }}>
              <BankOutlined style={{ marginRight: 8 }} />
              {record.fieldOperation || "Chưa cập nhật ngành nghề"}
            </Text>
            <Space size={[0, 8]} wrap style={{ marginTop: 8 }}>
              <Tag color="blue" icon={<TeamOutlined />}>
                {record.employeeSize} nhân viên
              </Tag>
              <Tag color="green" icon={<EnvironmentOutlined />}>
                {record.location?.city?.name || "Chưa cập nhật"}
              </Tag>
              {record.since && (
                <Tag color="orange" icon={<CalendarOutlined />}>
                  {dayjs(record.since).format("YYYY")}
                </Tag>
              )}
            </Space>
          </Flex>
        </Flex>
      ),
      width: "40%",
    },
    {
      title: "Liên hệ",
      key: "contact",
      render: (_, record) => (
        <Flex vertical>
          <Text style={{ marginBottom: 6 }}>
            <MailOutlined style={{ marginRight: 8, color: "#1677ff" }} />
            <a href={`mailto:${record.companyEmail}`}>{record.companyEmail}</a>
          </Text>
          <Text style={{ marginBottom: 6 }}>
            <PhoneOutlined style={{ marginRight: 8, color: "#52c41a" }} />
            <a href={`tel:${record.companyPhone}`}>{record.companyPhone}</a>
          </Text>
          {record.websiteUrl ? (
            <Text>
              <GlobalOutlined style={{ marginRight: 8, color: "#722ed1" }} />
              <a
                href={record.websiteUrl.startsWith("http") ? record.websiteUrl : `https://${record.websiteUrl}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {record.websiteUrl}
              </a>
            </Text>
          ) : (
            <Text type="secondary">
              <GlobalOutlined style={{ marginRight: 8 }} />
              Chưa cập nhật website
            </Text>
          )}
        </Flex>
      ),
      width: "25%",
    },
    {
      title: "Địa chỉ",
      key: "location",
      render: (_, record) => (
        <Flex vertical>
          <Tooltip title={record.location?.address || "Chưa cập nhật địa chỉ"}>
            <Text ellipsis style={{ maxWidth: 250, marginBottom: 6 }}>
              <EnvironmentOutlined style={{ marginRight: 8, color: "#52c41a" }} />
              {record.location?.address || "Chưa cập nhật địa chỉ"}
            </Text>
          </Tooltip>
          <Text style={{ marginBottom: 6 }}>
            <CalendarOutlined style={{ marginRight: 8, color: "#fa8c16" }} />
            {record.since ? dayjs(record.since).format("DD/MM/YYYY") : "Chưa cập nhật"}
          </Text>
          <Text>
            <NumberOutlined style={{ marginRight: 8, color: "#eb2f96" }} />
            {record.taxCode || "Chưa cập nhật MST"}
          </Text>
        </Flex>
      ),
      width: "20%",
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => showCompanyDetails(record)}
            style={{ borderRadius: "6px" }}
          >
            Chi tiết
          </Button>
          <Link to={`/company/edit/${record.id}`}>
            <Button icon={<EditOutlined />} style={{ borderRadius: "6px" }}>
              Sửa
            </Button>
          </Link>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => {
              setSelectedCompany(record)
              setIsDeleteModalVisible(true)
            }}
            style={{ borderRadius: "6px" }}
          >
            Xóa
          </Button>
        </Space>
      ),
      width: "15%",
    },
  ]

  // Danh sách thành phố
  const cityOptions = [
    { value: "Hà Nội", label: "Hà Nội" },
    { value: "TP.Hồ Chí Minh", label: "TP.Hồ Chí Minh" },
    { value: "Đà Nẵng", label: "Đà Nẵng" },
  ]

  // Danh sách quy mô
  const sizeOptions = [
    { value: "2", label: "2 nhân viên" },
    { value: "6", label: "6 nhân viên" },
    { value: "10", label: "10 nhân viên" },
    { value: "50", label: "50 nhân viên" },
    { value: "100", label: "100 nhân viên" },
  ]

  // Danh sách ngành nghề
  const fieldOptions = [
    { value: "Công nghệ thông tin", label: "Công nghệ thông tin" },
    { value: "Tiền tệ", label: "Tiền tệ" },
    { value: "Ngân hàng", label: "Ngân hàng" },
    { value: "Bán lẻ", label: "Bán lẻ" },
  ]

  return (
    <div style={{ padding: "24px", backgroundColor: "#f5f7fa", minHeight: "100vh" }}>
      <Card
        bordered={false}
        style={{
          borderRadius: 12,
          boxShadow: "0 2px 12px rgba(0, 0, 0, 0.08)",
        }}
      >
        {/* Header */}
        <Flex align="center" justify="space-between" style={{ marginBottom: 24 }}>
          <Flex align="center" gap="middle">
            <BankOutlined style={{ fontSize: 28, color: "#1677ff" }} />
            <Title level={3} style={{ margin: 0 }}>
              Quản lý công ty
            </Title>
          </Flex>
          <Space>
            <Card bordered={false} style={{ backgroundColor: "#f0f7ff", borderRadius: 8, padding: "8px 16px" }}>
              <Statistic
                title="Tổng số công ty"
                value={filteredCompanies.length}
                prefix={<BankOutlined style={{ color: "#1677ff" }} />}
                valueStyle={{ color: "#1677ff", fontWeight: "bold" }}
              />
            </Card>
            {activeFilters > 0 && (
              <Badge count={activeFilters} offset={[0, 0]}>
                <Tag color="blue" style={{ padding: "8px 12px", borderRadius: 6, fontSize: 14 }}>
                  Đang áp dụng {activeFilters} bộ lọc
                </Tag>
              </Badge>
            )}
          </Space>
        </Flex>

        <Divider style={{ margin: "12px 0 24px" }} />

        {/* Thanh tìm kiếm và bộ lọc */}
        <Card
          style={{
            marginBottom: 24,
            borderRadius: 8,
            backgroundColor: "#fafafa",
            boxShadow: "0 1px 4px rgba(0, 0, 0, 0.05)",
          }}
          bodyStyle={{ padding: "16px" }}
          bordered={false}
        >
          <Flex justify="space-between" align="center">
            <Space size="middle">
              <Input.Search
                placeholder="Tìm kiếm công ty..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{ width: 300, borderRadius: 6 }}
                allowClear
                enterButton={
                  <>
                    <SearchOutlined /> Tìm kiếm
                  </>
                }
              />

              <Select
                placeholder="Thành phố"
                allowClear
                onChange={setCityFilter}
                value={cityFilter}
                style={{ width: 180, borderRadius: 6 }}
                options={cityOptions}
                suffixIcon={<EnvironmentOutlined />}
              />

              <Select
                placeholder="Ngành nghề"
                allowClear
                onChange={setFieldFilter}
                value={fieldFilter}
                style={{ width: 180, borderRadius: 6 }}
                options={fieldOptions}
                suffixIcon={<BankOutlined />}
              />
            </Space>

            <Space>
              <Button
                icon={<FilterOutlined />}
                onClick={() => setFilterDrawerVisible(true)}
                type={activeFilters > 0 ? "primary" : "default"}
                style={{ borderRadius: 6 }}
              >
                Bộ lọc nâng cao
              </Button>

              {activeFilters > 0 && (
                <Button icon={<ReloadOutlined />} onClick={resetFilters} style={{ borderRadius: 6 }}>
                  Xóa bộ lọc
                </Button>
              )}

              <Link to="/company/add">
                <Button type="primary" icon={<PlusOutlined />} style={{ borderRadius: 6 }}>
                  Thêm công ty mới
                </Button>
              </Link>
            </Space>
          </Flex>
        </Card>

        {/* Bảng dữ liệu */}
        <Card
          bordered={false}
          bodyStyle={{ padding: 0 }}
          style={{
            borderRadius: 8,
            overflow: "hidden",
            boxShadow: "0 1px 4px rgba(0, 0, 0, 0.05)",
          }}
        >
          {filteredCompanies.length > 0 ? (
            <Table
              loading={tableLoading}
              dataSource={filteredCompanies}
              columns={columns}
              rowKey="id"
              pagination={{
                ...pagination,
                total: filteredCompanies.length,
                showSizeChanger: true,
                showTotal: (total) => `Tổng cộng ${total} công ty`,
                pageSizeOptions: ["10", "20", "50"],
                style: { padding: "16px 24px" },
              }}
              onChange={handleTableChange}
              rowClassName={(record, index) => (index % 2 === 0 ? "even-row" : "odd-row")}
            />
          ) : (
            <Empty
              description={
                <span>
                  {activeFilters > 0
                    ? "Không tìm thấy công ty nào phù hợp với bộ lọc"
                    : "Chưa có công ty nào trong hệ thống"}
                </span>
              }
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              style={{ margin: "64px 0", padding: "32px" }}
            />
          )}
        </Card>
      </Card>

      {/* Modal xác nhận xóa */}
      <Modal
        title={
          <Flex align="center" gap="small">
            <ExclamationCircleOutlined style={{ color: "#ff4d4f", fontSize: 22 }} />
            <span>Xác nhận xóa</span>
          </Flex>
        }
        open={isDeleteModalVisible}
        onOk={handleDelete}
        onCancel={() => setIsDeleteModalVisible(false)}
        okText="Xóa"
        cancelText="Hủy"
        okButtonProps={{ danger: true, style: { borderRadius: 6 } }}
        cancelButtonProps={{ style: { borderRadius: 6 } }}
        style={{ top: 20 }}
        bodyStyle={{ padding: "24px" }}
      >
        <div style={{ padding: "12px 0" }}>
          <p>
            Bạn có chắc chắn muốn xóa công ty <strong>{selectedCompany?.companyName}</strong>?
          </p>
          <p style={{ color: "#ff4d4f" }}>
            <b>Lưu ý:</b> Hành động này không thể hoàn tác và sẽ xóa tất cả dữ liệu liên quan.
          </p>
        </div>
      </Modal>

      {/* Drawer xem chi tiết */}
      <Drawer
        title={
          <Flex align="center" gap="middle">
            <BankOutlined style={{ fontSize: 20, color: "#1677ff" }} />
            <span>{selectedCompany?.companyName}</span>
          </Flex>
        }
        placement="right"
        onClose={() => setIsDetailDrawerVisible(false)}
        open={isDetailDrawerVisible}
        width={800}
        extra={
          <Space>
            <Link to={`/company/edit/${selectedCompany?.id}`}>
              <Button type="primary" icon={<EditOutlined />} style={{ borderRadius: 6 }}>
                Chỉnh sửa
              </Button>
            </Link>
          </Space>
        }
        headerStyle={{ padding: "16px 24px" }}
        bodyStyle={{ padding: 0 }}
      >
        {selectedCompany && (
          <>
            <div
              style={{
                height: 220,
                width: "100%",
                backgroundImage: `url(${selectedCompany.companyCoverImageUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  bottom: -50,
                  left: 24,
                  width: 100,
                  height: 100,
                  backgroundColor: "white",
                  borderRadius: 12,
                  border: "4px solid white",
                  overflow: "hidden",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                }}
              >
                <img
                  src={selectedCompany.companyImageUrl || "/placeholder.svg"}
                  alt={selectedCompany.companyName}
                  style={{ width: "100%", height: "100%", objectFit: "contain" }}
                />
              </div>
            </div>

            <div style={{ marginTop: 60, padding: "0 24px 24px" }}>
              <Tabs defaultActiveKey="1" type="card" size="large" style={{ marginBottom: 16 }}>
                <TabPane
                  tab={
                    <span>
                      <InfoCircleOutlined />
                      Thông tin cơ bản
                    </span>
                  }
                  key="1"
                >
                  <Row gutter={[24, 24]}>
                    <Col span={12}>
                      <Card
                        title={
                          <Flex align="center" gap="small">
                            <InfoCircleOutlined style={{ color: "#1677ff" }} />
                            <span>Thông tin chung</span>
                          </Flex>
                        }
                        bordered={false}
                        style={{ borderRadius: 8, height: "100%" }}
                        headStyle={{ borderBottom: "1px solid #f0f0f0" }}
                      >
                        <Descriptions column={1} layout="vertical" colon={false}>
                          <Descriptions.Item label={<Text type="secondary">Tên công ty</Text>}>
                            <Text strong>{selectedCompany.companyName}</Text>
                          </Descriptions.Item>
                          <Descriptions.Item label={<Text type="secondary">Ngành nghề</Text>}>
                            <Tag color="blue" icon={<BankOutlined />} style={{ padding: "4px 8px" }}>
                              {selectedCompany.fieldOperation || "Chưa cập nhật"}
                            </Tag>
                          </Descriptions.Item>
                          <Descriptions.Item label={<Text type="secondary">Quy mô</Text>}>
                            <Tag color="green" icon={<TeamOutlined />} style={{ padding: "4px 8px" }}>
                              {selectedCompany.employeeSize} nhân viên
                            </Tag>
                          </Descriptions.Item>
                          <Descriptions.Item label={<Text type="secondary">Mã số thuế</Text>}>
                            <Text>{selectedCompany.taxCode || "Chưa cập nhật"}</Text>
                          </Descriptions.Item>
                          <Descriptions.Item label={<Text type="secondary">Ngày thành lập</Text>}>
                            <Tag color="orange" icon={<CalendarOutlined />} style={{ padding: "4px 8px" }}>
                              {dayjs(selectedCompany.since).format("DD/MM/YYYY")}
                            </Tag>
                          </Descriptions.Item>
                        </Descriptions>
                      </Card>
                    </Col>
                    <Col span={12}>
                      <Card
                        title={
                          <Flex align="center" gap="small">
                            <PhoneOutlined style={{ color: "#52c41a" }} />
                            <span>Thông tin liên hệ</span>
                          </Flex>
                        }
                        bordered={false}
                        style={{ borderRadius: 8, height: "100%" }}
                        headStyle={{ borderBottom: "1px solid #f0f0f0" }}
                      >
                        <Descriptions column={1} layout="vertical" colon={false}>
                          <Descriptions.Item label={<Text type="secondary">Email</Text>}>
                            <a href={`mailto:${selectedCompany.companyEmail}`}>
                              <MailOutlined style={{ marginRight: 8, color: "#1677ff" }} />
                              {selectedCompany.companyEmail}
                            </a>
                          </Descriptions.Item>
                          <Descriptions.Item label={<Text type="secondary">Số điện thoại</Text>}>
                            <a href={`tel:${selectedCompany.companyPhone}`}>
                              <PhoneOutlined style={{ marginRight: 8, color: "#52c41a" }} />
                              {selectedCompany.companyPhone}
                            </a>
                          </Descriptions.Item>
                          <Descriptions.Item label={<Text type="secondary">Website</Text>}>
                            {selectedCompany.websiteUrl ? (
                              <a
                                href={
                                  selectedCompany.websiteUrl.startsWith("http")
                                    ? selectedCompany.websiteUrl
                                    : `https://${selectedCompany.websiteUrl}`
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <GlobalOutlined style={{ marginRight: 8, color: "#722ed1" }} />
                                {selectedCompany.websiteUrl}
                              </a>
                            ) : (
                              <Text type="secondary">Chưa cập nhật</Text>
                            )}
                          </Descriptions.Item>
                          <Descriptions.Item label={<Text type="secondary">Địa chỉ</Text>}>
                            <Text>
                              <EnvironmentOutlined style={{ marginRight: 8, color: "#52c41a" }} />
                              {selectedCompany.location?.address || "Chưa cập nhật"}
                            </Text>
                          </Descriptions.Item>
                          <Descriptions.Item label={<Text type="secondary">Thành phố</Text>}>
                            <Tag color="green" icon={<EnvironmentOutlined />} style={{ padding: "4px 8px" }}>
                              {selectedCompany.location?.city?.name || "Chưa cập nhật"}
                            </Tag>
                          </Descriptions.Item>
                        </Descriptions>
                      </Card>
                    </Col>
                    <Col span={24}>
                      <Card
                        title={
                          <Flex align="center" gap="small">
                            <GlobalOutlined style={{ color: "#722ed1" }} />
                            <span>Mạng xã hội</span>
                          </Flex>
                        }
                        bordered={false}
                        style={{ borderRadius: 8 }}
                        headStyle={{ borderBottom: "1px solid #f0f0f0" }}
                      >
                        <Flex gap="middle" wrap="wrap">
                          <Button
                            type={selectedCompany.facebookUrl ? "primary" : "default"}
                            icon={<FacebookOutlined />}
                            href={selectedCompany.facebookUrl || "#"}
                            target="_blank"
                            disabled={!selectedCompany.facebookUrl}
                            style={{ borderRadius: 6 }}
                          >
                            Facebook
                          </Button>
                          <Button
                            type={selectedCompany.youtubeUrl ? "primary" : "default"}
                            danger={selectedCompany.youtubeUrl}
                            icon={<YoutubeOutlined />}
                            href={selectedCompany.youtubeUrl || "#"}
                            target="_blank"
                            disabled={!selectedCompany.youtubeUrl}
                            style={{ borderRadius: 6 }}
                          >
                            Youtube
                          </Button>
                          <Button
                            type={selectedCompany.linkedinUrl ? "primary" : "default"}
                            icon={<LinkedinOutlined />}
                            href={selectedCompany.linkedinUrl || "#"}
                            target="_blank"
                            disabled={!selectedCompany.linkedinUrl}
                            style={{ borderRadius: 6 }}
                          >
                            LinkedIn
                          </Button>
                        </Flex>
                      </Card>
                    </Col>
                    <Col span={24}>
                      <Card
                        title={
                          <Flex align="center" gap="small">
                            <InfoCircleOutlined style={{ color: "#1677ff" }} />
                            <span>Mô tả công ty</span>
                          </Flex>
                        }
                        bordered={false}
                        style={{ borderRadius: 8 }}
                        headStyle={{ borderBottom: "1px solid #f0f0f0" }}
                      >
                        {selectedCompany.description ? (
                          <div
                            dangerouslySetInnerHTML={{ __html: selectedCompany.description }}
                            style={{
                              padding: "8px",
                              borderRadius: 8,
                              backgroundColor: "#fafafa",
                              lineHeight: 1.6,
                            }}
                          />
                        ) : (
                          <Empty description="Chưa có mô tả" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                        )}
                      </Card>
                    </Col>
                  </Row>
                </TabPane>
                <TabPane
                  tab={
                    <span>
                      <UserOutlined />
                      Thông tin người dùng
                    </span>
                  }
                  key="2"
                >
                  <Card bordered={false} style={{ borderRadius: 8 }}>
                    <Flex align="center" gap="middle" style={{ marginBottom: 24 }}>
                      <Avatar
                        src={selectedCompany.user?.avatarUrl}
                        size={80}
                        icon={<UserOutlined />}
                        style={{ boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)" }}
                      />
                      <Flex vertical>
                        <Title level={4} style={{ margin: 0 }}>
                          {selectedCompany.user?.fullName}
                        </Title>
                        <Text>
                          <MailOutlined style={{ marginRight: 8, color: "#1677ff" }} />
                          {selectedCompany.user?.email}
                        </Text>
                        <Space style={{ marginTop: 8 }}>
                          <Tag color="blue" style={{ padding: "4px 8px" }}>
                            {selectedCompany.user?.roleName}
                          </Tag>
                          <Tag
                            color={selectedCompany.user?.isActive ? "success" : "error"}
                            style={{ padding: "4px 8px" }}
                          >
                            {selectedCompany.user?.isActive ? "Đang hoạt động" : "Đã khóa"}
                          </Tag>
                        </Space>
                      </Flex>
                    </Flex>

                    <Descriptions
                      title={
                        <Flex align="center" gap="small">
                          <UserOutlined style={{ color: "#1677ff" }} />
                          <span>Thông tin chi tiết</span>
                        </Flex>
                      }
                      bordered
                      column={2}
                      labelStyle={{ backgroundColor: "#fafafa" }}
                      style={{ marginTop: 16 }}
                    >
                      <Descriptions.Item label="ID người dùng">
                        <Tag>{selectedCompany.user?.id}</Tag>
                      </Descriptions.Item>
                      <Descriptions.Item label="Email đã xác thực">
                        <Tag color={selectedCompany.user?.isVerifyEmail ? "success" : "warning"}>
                          {selectedCompany.user?.isVerifyEmail ? "Đã xác thực" : "Chưa xác thực"}
                        </Tag>
                      </Descriptions.Item>
                      <Descriptions.Item label="Đăng nhập lần cuối">
                        {selectedCompany.user?.lastLogin ? (
                          <Flex align="center">
                            <ClockCircleOutlined style={{ marginRight: 8, color: "#1677ff" }} />
                            {dayjs(selectedCompany.user.lastLogin).format("DD/MM/YYYY HH:mm:ss")}
                          </Flex>
                        ) : (
                          "Chưa đăng nhập"
                        )}
                      </Descriptions.Item>
                      <Descriptions.Item label="Ngày tạo">
                        <Flex align="center">
                          <CalendarOutlined style={{ marginRight: 8, color: "#fa8c16" }} />
                          {dayjs(selectedCompany.user?.createAt).format("DD/MM/YYYY HH:mm:ss")}
                        </Flex>
                      </Descriptions.Item>
                    </Descriptions>
                  </Card>
                </TabPane>
              </Tabs>
            </div>
          </>
        )}
      </Drawer>

      {/* Drawer bộ lọc nâng cao */}
      <Drawer
        title={
          <Flex align="center" gap="small">
            <FilterOutlined style={{ color: "#1677ff" }} />
            <span>Bộ lọc nâng cao</span>
          </Flex>
        }
        placement="right"
        onClose={() => setFilterDrawerVisible(false)}
        open={filterDrawerVisible}
        width={400}
        extra={
          <Button type="primary" onClick={() => setFilterDrawerVisible(false)} style={{ borderRadius: 6 }}>
            Áp dụng
          </Button>
        }
        footer={
          <Flex justify="space-between">
            <Button onClick={resetFilters} style={{ borderRadius: 6 }}>
              Xóa tất cả
            </Button>
            <Button type="primary" onClick={() => setFilterDrawerVisible(false)} style={{ borderRadius: 6 }}>
              Áp dụng bộ lọc
            </Button>
          </Flex>
        }
      >
        <Flex vertical gap="middle">
          <Card
            title="Vị trí"
            size="small"
            bordered={false}
            style={{ backgroundColor: "#f5f7fa", borderRadius: 8 }}
            headStyle={{ borderBottom: "none", padding: "12px 16px" }}
            bodyStyle={{ padding: "0 16px 16px" }}
          >
            <div>
              <Text strong>Thành phố</Text>
              <Select
                placeholder="Chọn thành phố"
                allowClear
                onChange={setCityFilter}
                value={cityFilter}
                style={{ width: "100%", marginTop: 8, borderRadius: 6 }}
                options={cityOptions}
                suffixIcon={<EnvironmentOutlined />}
              />
            </div>
          </Card>

          <Card
            title="Quy mô & Ngành nghề"
            size="small"
            bordered={false}
            style={{ backgroundColor: "#f5f7fa", borderRadius: 8 }}
            headStyle={{ borderBottom: "none", padding: "12px 16px" }}
            bodyStyle={{ padding: "0 16px 16px" }}
          >
            <div style={{ marginBottom: 16 }}>
              <Text strong>Quy mô công ty</Text>
              <Select
                placeholder="Chọn quy mô"
                allowClear
                onChange={setSizeFilter}
                value={sizeFilter}
                style={{ width: "100%", marginTop: 8, borderRadius: 6 }}
                options={sizeOptions}
                suffixIcon={<TeamOutlined />}
              />
            </div>

            <div>
              <Text strong>Ngành nghề</Text>
              <Select
                placeholder="Chọn ngành nghề"
                allowClear
                onChange={setFieldFilter}
                value={fieldFilter}
                style={{ width: "100%", marginTop: 8, borderRadius: 6 }}
                options={fieldOptions}
                suffixIcon={<BankOutlined />}
              />
            </div>
          </Card>

          <Card
            title="Thông tin khác"
            size="small"
            bordered={false}
            style={{ backgroundColor: "#f5f7fa", borderRadius: 8 }}
            headStyle={{ borderBottom: "none", padding: "12px 16px" }}
            bodyStyle={{ padding: "0 16px 16px" }}
          >
            <div style={{ marginBottom: 16 }}>
              <Text strong>Có website</Text>
              <Select
                placeholder="Lọc theo website"
                allowClear
                onChange={setHasWebsiteFilter}
                value={hasWebsiteFilter}
                style={{ width: "100%", marginTop: 8, borderRadius: 6 }}
                suffixIcon={<GlobalOutlined />}
              >
                <Option value={true}>Có website</Option>
                <Option value={false}>Chưa có website</Option>
              </Select>
            </div>

            <div>
              <Text strong>Có mạng xã hội</Text>
              <Select
                placeholder="Lọc theo mạng xã hội"
                allowClear
                onChange={setHasSocialMediaFilter}
                value={hasSocialMediaFilter}
                style={{ width: "100%", marginTop: 8, borderRadius: 6 }}
                suffixIcon={<FacebookOutlined />}
              >
                <Option value={true}>Có mạng xã hội</Option>
                <Option value={false}>Chưa có mạng xã hội</Option>
              </Select>
            </div>
          </Card>
        </Flex>
      </Drawer>

      <style jsx global>{`
        .ant-table-thead > tr > th {
          background-color: #f5f7fa;
          font-weight: 600;
          padding: 16px;
        }
        
        .ant-table-tbody > tr > td {
          padding: 16px;
        }
        
        .ant-table-tbody > tr.even-row {
          background-color: #ffffff;
        }
        
        .ant-table-tbody > tr.odd-row {
          background-color: #fafafa;
        }
        
        .ant-table-tbody > tr:hover > td {
          background-color: #e6f4ff !important;
        }
        
        .ant-drawer-body {
          padding: 24px;
        }
        
        .ant-statistic-title {
          font-size: 14px;
          color: #8c8c8c;
        }
        
        .ant-statistic-content {
          font-size: 20px;
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
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s;
          color: white;
          font-size: 24px;
        }
        
        .preview-container:hover .preview-overlay {
          opacity: 1;
        }
      `}</style>
    </div>
  )
}

export default Company

