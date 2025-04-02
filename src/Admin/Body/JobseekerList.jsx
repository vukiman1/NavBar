"use client"

import { useEffect, useState } from "react"
import {
  Card,
  Flex,
  Tag,
  Typography,
  message,
  Table,
  Select,
  Input,
  Button,
  Space,
  Tooltip,
  Avatar,
  Badge,
  Divider,
  Statistic,
  Drawer,
  Collapse,
  Empty,
} from "antd"
import {
  FilterOutlined,
  ReloadOutlined,
  EyeOutlined,
  StarOutlined,
  StarFilled,
  UserOutlined,
  DollarOutlined,
  CalendarOutlined,
  ExperimentOutlined,
  FileTextOutlined,
  UploadOutlined,
  GlobalOutlined,
} from "@ant-design/icons"
import moment from "moment"
import "moment/locale/vi"

const { Title, Text } = Typography
const { Option } = Select
const { Panel } = Collapse

// Helper function to format currency
const formatCurrency = (value) => {
  if (!value || value === 0) return "Thương lượng"
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value)
}

// Helper function to format experience
const formatExperience = (years) => {
  if (!years && years !== 0) return "Chưa có thông tin"
  if (years === 0) return "Chưa có kinh nghiệm"
  return `${years} năm kinh nghiệm`
}

// Helper function to get resume type badge
const getResumeTypeBadge = (type) => {
  if (type === "WEBSITE") {
    return (
      <Tag color="blue" icon={<GlobalOutlined />}>
        Hồ sơ trực tuyến
      </Tag>
    )
  } else if (type === "UPLOAD") {
    return (
      <Tag color="green" icon={<UploadOutlined />}>
        Hồ sơ tải lên
      </Tag>
    )
  }
  return null
}

const JobseekerList = () => {
  const [jobseekerList, setJobseekerList] = useState([])
  const [tableLoading, setTableLoading] = useState(false)
  const [totalCount, setTotalCount] = useState(0)
  const [filterDrawerVisible, setFilterDrawerVisible] = useState(false)
  const [activeFilters, setActiveFilters] = useState(0)

  // Bộ lọc
  const [searchText, setSearchText] = useState("")
  const [industry, setIndustry] = useState(null)
  const [experience, setExperience] = useState(null)
  const [level, setLevel] = useState(null)
  const [education, setEducation] = useState(null)
  const [location, setLocation] = useState(null)
  const [workType, setWorkType] = useState(null)
  const [gender, setGender] = useState(null)
  const [maritalStatus, setMaritalStatus] = useState(null)
  const [city, setCity] = useState(null)

  // Pagination
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  })

  const loadJobseekerList = async () => {
    setTableLoading(true)
    try {
      const params = {
        search: searchText || undefined,
        industry: industry || undefined,
        experience: experience || undefined,
        level: level || undefined,
        education: education || undefined,
        location: location || undefined,
        workType: workType || undefined,
        gender: gender || undefined,
        maritalStatus: maritalStatus || undefined,
        city: city || undefined,
        page: pagination.current,
        pageSize: pagination.pageSize,
      }

      // For demo purposes, we'll use the provided data
      const mockData = {
        errors: {},
        data: {
          count: 17,
          results: [
            {
              id: 4,
              slug: "resume-3",
              title: "QA",
              salaryMin: 7000000,
              salaryMax: 9000000,
              experience: 2,
              updateAt: "2025-03-16T09:21:27.166Z",
              city: 24,
              isSaved: false,
              viewEmployerNumber: 0,
              userDict: {
                id: 6,
                fullName: "Phương ",
              },
              jobSeekerProfileDict: {
                id: 4,
                old: 23,
              },
              type: "WEBSITE",
            },
            {
              id: 1,
              slug: "resume",
              title: "Backend Nodejs",
              salaryMin: 9000000,
              salaryMax: 10000000,
              experience: 3,
              updateAt: "2025-03-04T09:24:17.077Z",
              city: 24,
              isSaved: false,
              viewEmployerNumber: 0,
              userDict: {
                id: 1,
                fullName: "Kim An",
              },
              jobSeekerProfileDict: {
                id: 1,
                old: 23,
              },
              type: "WEBSITE",
            },
            {
              id: 9,
              slug: "resume-8",
              title: "QA",
              salaryMin: 8000000,
              salaryMax: 10000000,
              experience: 2,
              updateAt: "2025-03-16T09:20:40.864Z",
              city: 24,
              isSaved: true,
              viewEmployerNumber: 1,
              userDict: {
                id: 6,
                fullName: "Phương ",
              },
              jobSeekerProfileDict: {
                id: 4,
                old: 23,
              },
              type: "UPLOAD",
            },
            {
              id: 7,
              slug: "resume-6",
              title: null,
              salaryMin: 0,
              salaryMax: 0,
              experience: null,
              updateAt: "2025-03-08T10:11:34.620Z",
              city: null,
              isSaved: false,
              viewEmployerNumber: 0,
              userDict: {
                id: 9,
                fullName: "Phương Mai",
              },
              jobSeekerProfileDict: {
                id: 7,
                old: null,
              },
              type: "WEBSITE",
            },
            {
              id: 10,
              slug: "resume-9",
              title: null,
              salaryMin: 0,
              salaryMax: 0,
              experience: null,
              updateAt: "2025-03-08T17:30:09.749Z",
              city: null,
              isSaved: false,
              viewEmployerNumber: 0,
              userDict: {
                id: 11,
                fullName: "Nguyen Thi Linh Anh",
              },
              jobSeekerProfileDict: {
                id: 9,
                old: null,
              },
              type: "WEBSITE",
            },
            {
              id: 2,
              slug: "resume-1",
              title: null,
              salaryMin: 0,
              salaryMax: 0,
              experience: null,
              updateAt: "2025-03-05T16:43:22.451Z",
              city: null,
              isSaved: false,
              viewEmployerNumber: 0,
              userDict: {
                id: 3,
                fullName: "Vũ Kim An",
              },
              jobSeekerProfileDict: {
                id: 2,
                old: null,
              },
              type: "WEBSITE",
            },
            {
              id: 5,
              slug: "resume-4",
              title: null,
              salaryMin: 0,
              salaryMax: 0,
              experience: null,
              updateAt: "2025-03-08T09:58:22.960Z",
              city: null,
              isSaved: false,
              viewEmployerNumber: 0,
              userDict: {
                id: 7,
                fullName: "         ",
              },
              jobSeekerProfileDict: {
                id: 5,
                old: null,
              },
              type: "WEBSITE",
            },
            {
              id: 8,
              slug: "resume-7",
              title: null,
              salaryMin: 0,
              salaryMax: 0,
              experience: null,
              updateAt: "2025-03-08T11:31:56.911Z",
              city: null,
              isSaved: false,
              viewEmployerNumber: 0,
              userDict: {
                id: 10,
                fullName: "Nguyen Thi Linh Anh",
              },
              jobSeekerProfileDict: {
                id: 8,
                old: null,
              },
              type: "WEBSITE",
            },
          ],
        },
      }

      // In a real application, you would use the API call:
      // const resData = await jobService.getAllJobseekers(params);
      const resData = mockData

      setJobseekerList(resData.data.results)
      setTotalCount(resData.data.count)

      // Count active filters
      let filterCount = 0
      if (searchText) filterCount++
      if (industry) filterCount++
      if (experience) filterCount++
      if (level) filterCount++
      if (education) filterCount++
      if (location) filterCount++
      if (workType) filterCount++
      if (gender) filterCount++
      if (maritalStatus) filterCount++
      if (city) filterCount++
      setActiveFilters(filterCount)
    } catch (error) {
      console.error("Error fetching jobseekers:", error)
      message.error("Không thể tải danh sách người tìm việc")
    } finally {
      setTableLoading(false)
    }
  }

  useEffect(() => {
    loadJobseekerList()
  }, [
    searchText,
    industry,
    experience,
    level,
    education,
    location,
    workType,
    gender,
    maritalStatus,
    city,
    pagination.current,
    pagination.pageSize,
  ])

  const handleTableChange = (pagination) => {
    setPagination(pagination)
  }

  const toggleSaveResume = async (id, isSaved) => {
    try {
      // In a real application, you would call an API
      // await jobService.toggleSaveResume(id, !isSaved);

      // Update local state
      const updatedList = jobseekerList.map((item) => {
        if (item.id === id) {
          return { ...item, isSaved: !isSaved }
        }
        return item
      })

      setJobseekerList(updatedList)
      message.success(isSaved ? "Đã bỏ lưu hồ sơ" : "Đã lưu hồ sơ")
    } catch (error) {
      console.error("Error toggling save status:", error)
      message.error("Không thể thay đổi trạng thái lưu hồ sơ")
    }
  }

  const resetFilters = () => {
    setSearchText("")
    setIndustry(null)
    setExperience(null)
    setLevel(null)
    setEducation(null)
    setLocation(null)
    setWorkType(null)
    setGender(null)
    setMaritalStatus(null)
    setCity(null)
    setPagination({
      current: 1,
      pageSize: 10,
    })
    message.success("Đã xóa tất cả bộ lọc")
  }

  const viewResumeDetails = (id) => {
    // In a real application, you would navigate to the resume details page
    message.info(`Xem chi tiết hồ sơ ID: ${id}`)
  }

  const columns = [
    {
      title: "Ứng viên",
      key: "candidate",
      render: (_, record) => (
        <Flex align="center" gap="middle">
          <Avatar size={50} icon={<UserOutlined />} style={{ backgroundColor: "#1890ff" }} />
          <Flex vertical>
            <Text strong>{record.userDict?.fullName || "Chưa cập nhật"}</Text>
            <Text type="secondary">
              {record.jobSeekerProfileDict?.old ? `${record.jobSeekerProfileDict.old} tuổi` : "Chưa cập nhật tuổi"}
            </Text>
            {getResumeTypeBadge(record.type)}
          </Flex>
        </Flex>
      ),
      width: "25%",
    },
    {
      title: "Vị trí ứng tuyển",
      key: "position",
      render: (_, record) => (
        <Flex vertical>
          <Text strong>{record.title || "Chưa cập nhật vị trí"}</Text>
          <Space size={[0, 8]} wrap style={{ marginTop: 4 }}>
            <Tag color="blue" icon={<DollarOutlined />}>
              {record.salaryMin && record.salaryMax
                ? `${formatCurrency(record.salaryMin)} - ${formatCurrency(record.salaryMax)}`
                : "Thương lượng"}
            </Tag>
            <Tag color="green" icon={<ExperimentOutlined />}>
              {formatExperience(record.experience)}
            </Tag>
          </Space>
        </Flex>
      ),
      width: "30%",
    },
    {
      title: "Cập nhật",
      key: "update",
      render: (_, record) => (
        <Flex vertical>
          <Text>
            <CalendarOutlined style={{ marginRight: 8 }} />
            {moment(record.updateAt).locale("vi").fromNow()}
          </Text>
          <Text type="secondary" style={{ marginTop: 4 }}>
            <EyeOutlined style={{ marginRight: 8 }} />
            {record.viewEmployerNumber} lượt xem
          </Text>
        </Flex>
      ),
      width: "20%",
      sorter: (a, b) => new Date(b.updateAt) - new Date(a.updateAt),
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Tooltip title="Xem chi tiết">
            <Button type="primary" icon={<EyeOutlined />} onClick={() => viewResumeDetails(record.id)}>
              Xem hồ sơ
            </Button>
          </Tooltip>
          <Tooltip title={record.isSaved ? "Bỏ lưu hồ sơ" : "Lưu hồ sơ"}>
            <Button
              type={record.isSaved ? "default" : "text"}
              icon={record.isSaved ? <StarFilled style={{ color: "#faad14" }} /> : <StarOutlined />}
              onClick={() => toggleSaveResume(record.id, record.isSaved)}
            >
              {record.isSaved ? "Đã lưu" : "Lưu"}
            </Button>
          </Tooltip>
        </Space>
      ),
      width: "25%",
    },
  ]

  const cityOptions = [
    { value: 24, label: "Hà Nội" },
    { value: 30, label: "TP.Hồ Chí Minh" },
    { value: 15, label: "Đà Nẵng" },
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
            Danh sách người tìm việc
          </Title>
          <Space>
            <Statistic
              title="Tổng số hồ sơ"
              value={totalCount}
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
              placeholder="Tìm kiếm theo tên, vị trí..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 300 }}
              allowClear
              enterButton
            />

            <Select placeholder="Thành phố" allowClear onChange={setCity} value={city} style={{ width: 180 }}>
              {cityOptions.map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>

            <Select
              placeholder="Kinh nghiệm"
              allowClear
              onChange={setExperience}
              value={experience}
              style={{ width: 180 }}
            >
              <Option value="0">Chưa có kinh nghiệm</Option>
              <Option value="1">1 năm</Option>
              <Option value="2">2 năm</Option>
              <Option value="3">3 năm</Option>
              <Option value="5">Trên 5 năm</Option>
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
          </Space>
        </Flex>

        {/* Bảng dữ liệu */}
        {jobseekerList.length > 0 ? (
          <Table
            loading={tableLoading}
            dataSource={jobseekerList}
            columns={columns}
            rowKey="id"
            pagination={{
              ...pagination,
              total: totalCount,
              showSizeChanger: true,
              showTotal: (total) => `Tổng cộng ${total} người tìm việc`,
              pageSizeOptions: ["10", "20", "50"],
            }}
            onChange={handleTableChange}
            rowClassName={(record) => (record.isSaved ? "saved-resume-row" : "")}
            style={{ marginTop: 16 }}
          />
        ) : (
          <Empty
            description={
              <span>
                {activeFilters > 0 ? "Không tìm thấy hồ sơ nào phù hợp với bộ lọc" : "Chưa có hồ sơ nào trong hệ thống"}
              </span>
            }
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            style={{ margin: "48px 0" }}
          />
        )}
      </Card>

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
        <Collapse defaultActiveKey={["1", "2", "3"]} ghost>
          <Panel header="Thông tin cơ bản" key="1">
            <Flex vertical gap="middle">
              <div>
                <Text strong>Ngành nghề</Text>
                <Select
                  placeholder="Chọn ngành nghề"
                  allowClear
                  onChange={setIndustry}
                  value={industry}
                  style={{ width: "100%", marginTop: 8 }}
                >
                  <Option value="it">Công nghệ thông tin</Option>
                  <Option value="marketing">Marketing</Option>
                  <Option value="finance">Tài chính - Kế toán</Option>
                  <Option value="sales">Kinh doanh - Bán hàng</Option>
                  <Option value="admin">Hành chính - Nhân sự</Option>
                </Select>
              </div>

              <div>
                <Text strong>Cấp bậc</Text>
                <Select
                  placeholder="Chọn cấp bậc"
                  allowClear
                  onChange={setLevel}
                  value={level}
                  style={{ width: "100%", marginTop: 8 }}
                >
                  <Option value="intern">Thực tập sinh</Option>
                  <Option value="fresher">Mới tốt nghiệp</Option>
                  <Option value="junior">Nhân viên</Option>
                  <Option value="senior">Nhân viên cao cấp</Option>
                  <Option value="leader">Trưởng nhóm</Option>
                  <Option value="manager">Quản lý</Option>
                  <Option value="director">Giám đốc</Option>
                </Select>
              </div>

              <div>
                <Text strong>Học vấn</Text>
                <Select
                  placeholder="Chọn trình độ học vấn"
                  allowClear
                  onChange={setEducation}
                  value={education}
                  style={{ width: "100%", marginTop: 8 }}
                >
                  <Option value="highschool">Trung học phổ thông</Option>
                  <Option value="college">Cao đẳng</Option>
                  <Option value="university">Đại học</Option>
                  <Option value="master">Thạc sĩ</Option>
                  <Option value="doctor">Tiến sĩ</Option>
                </Select>
              </div>
            </Flex>
          </Panel>

          <Panel header="Hình thức làm việc" key="2">
            <Flex vertical gap="middle">
              <div>
                <Text strong>Nơi làm việc</Text>
                <Select
                  placeholder="Chọn nơi làm việc"
                  allowClear
                  onChange={setLocation}
                  value={location}
                  style={{ width: "100%", marginTop: 8 }}
                >
                  <Option value="onsite">Tại văn phòng</Option>
                  <Option value="remote">Làm từ xa</Option>
                  <Option value="hybrid">Kết hợp</Option>
                </Select>
              </div>

              <div>
                <Text strong>Hình thức làm việc</Text>
                <Select
                  placeholder="Chọn hình thức làm việc"
                  allowClear
                  onChange={setWorkType}
                  value={workType}
                  style={{ width: "100%", marginTop: 8 }}
                >
                  <Option value="fulltime">Toàn thời gian</Option>
                  <Option value="parttime">Bán thời gian</Option>
                  <Option value="contract">Theo hợp đồng</Option>
                  <Option value="temporary">Tạm thời</Option>
                  <Option value="internship">Thực tập</Option>
                </Select>
              </div>
            </Flex>
          </Panel>

          <Panel header="Thông tin cá nhân" key="3">
            <Flex vertical gap="middle">
              <div>
                <Text strong>Giới tính</Text>
                <Select
                  placeholder="Chọn giới tính"
                  allowClear
                  onChange={setGender}
                  value={gender}
                  style={{ width: "100%", marginTop: 8 }}
                >
                  <Option value="male">Nam</Option>
                  <Option value="female">Nữ</Option>
                </Select>
              </div>

              <div>
                <Text strong>Tình trạng hôn nhân</Text>
                <Select
                  placeholder="Chọn tình trạng hôn nhân"
                  allowClear
                  onChange={setMaritalStatus}
                  value={maritalStatus}
                  style={{ width: "100%", marginTop: 8 }}
                >
                  <Option value="single">Độc thân</Option>
                  <Option value="married">Đã kết hôn</Option>
                </Select>
              </div>
            </Flex>
          </Panel>
        </Collapse>
      </Drawer>

      <style jsx global>{`
        .saved-resume-row {
          background-color: #fffbe6;
        }
        
        .ant-table-row:hover {
          cursor: pointer;
        }
        
        .ant-table-thead > tr > th {
          background-color: #fafafa;
          font-weight: 600;
        }
      `}</style>
    </div>
  )
}

export default JobseekerList

