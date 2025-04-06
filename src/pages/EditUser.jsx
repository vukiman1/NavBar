"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import {
  Form,
  Input,
  Button,
  Spin,
  message,
  Upload,
  DatePicker,
  Radio,
  Switch,
  Card,
  Divider,
  Typography,
  Row,
  Col,
  Avatar,
  Space,
  Tabs,
  Badge,
  Tooltip,
  Alert,
  Descriptions,
  Skeleton,
  Tag,
  Breadcrumb,
} from "antd"
import {
  UserOutlined,
  SaveOutlined,
  RollbackOutlined,
  EditOutlined,
  MailOutlined,
  PhoneOutlined,
  CalendarOutlined,
  TeamOutlined,
  BankOutlined,
  LockOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  UploadOutlined,
  HomeOutlined,
  DollarOutlined,
  ManOutlined,
  WomanOutlined,
  HeartOutlined,
  IdcardOutlined,
  CameraOutlined,
  LoadingOutlined,
} from "@ant-design/icons"
import moment from "moment"
import userService from "../services/userService"

const { Title, Text, Paragraph } = Typography
const { TabPane } = Tabs

const EditUser = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [userData, setUserData] = useState(null)
  const [avatarFileList, setAvatarFileList] = useState([])
  const [activeTab, setActiveTab] = useState("basic")
  const [formChanged, setFormChanged] = useState(false)

  // Giả lập API call để lấy dữ liệu user
  const fetchUserData = async () => {
    setLoading(true)
    try {
      // Thay bằng API thực tế của bạn, ví dụ: await userService.getUserById(id)
      // const response = {
      //   id: 28,
      //   email: "anvuit734@gmail.com",
      //   fullName: "An Vũ",
      //   password: "$2b$10$r9g5k9PqwNTKfGdUXDBiXOEYgyX1neI7NAl5IXchmWzeUey0am.su",
      //   isActive: true,
      //   isVerifyEmail: true,
      //   isSupperuser: false,
      //   isStaff: false,
      //   hasCompany: false,
      //   roleName: "JOB_SEEKER",
      //   money: 0,
      //   avatarUrl: "https://lh3.googleusercontent.com/a/ACg8ocLeiHaBgqwGV3Yq6EPBTxy72-gHHxWAwsYEkk-sffR6PWnKa6x8=s96-c",
      //   avatarPublicId: null,
      //   lastLogin: "2025-03-27T07:53:14.387Z",
      //   createAt: "2025-03-27T07:53:14.833Z",
      //   updateAt: "2025-03-27T07:53:14.833Z",
      //   jobSeekerProfile: {
      //     id: 15,
      //     phone: "0385849615",
      //     birthday: "2002-01-31T10:00:00.000Z",
      //     gender: "M",
      //     maritalStatus: "S",
      //     createdAt: "2025-03-27T07:53:15.573Z",
      //     updatedAt: "2025-03-27T07:57:22.060Z",
      //   },
      //   company: null,
      // }
      const resData = await userService.getUserDetails(id)
      console.log(resData)
      setUserData(resData)
      form.setFieldsValue({
        ...resData,
        birthday: resData.jobSeekerProfile?.birthday ? moment(resData.jobSeekerProfile.birthday) : null,
      })
      setAvatarFileList(
        resData.avatarUrl
          ? [
              {
                uid: "-1",
                name: "avatar",
                status: "done",
                url: resData.avatarUrl,
              },
            ]
          : [],
      )
    } catch (error) {
      message.error("Không thể tải dữ liệu người dùng!")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUserData()
  }, [id])

  // Xử lý submit form
  const onFinish = async (values) => {
    setSubmitting(true)
    try {
      const updatedData = {
        ...values,
        birthday: values.birthday ? values.birthday.toISOString() : null,
      }
      // Thay bằng API thực tế của bạn, ví dụ: await userService.updateUser(id, updatedData)

      await userService.updateUserProfile(id, updatedData)
      // Giả lập API delay
      await new Promise((resolve) => setTimeout(resolve, 800))

      message.success("Cập nhật thông tin thành công!")
      setFormChanged(false)
      // navigate("/users") // Quay lại danh sách user
    } catch (error) {
      message.error("Cập nhật thông tin thất bại!")
      console.error(error)
    } finally {
      setSubmitting(false)
    }
  }

  // Xử lý upload avatar
  const handleAvatarUpload = ({ fileList }) => {
    setAvatarFileList(fileList)
    setFormChanged(true)
    if (fileList.length > 0 && fileList[0].status === "done") {
      form.setFieldsValue({ avatarUrl: fileList[0].url })
    }
  }

  // Chuyển hướng đến trang edit company
  const editCompany = () => {
    if (userData?.company?.id) {
      navigate(`/companies/edit/${userData.company.id}`)
    } else {
      message.info("Người dùng chưa có thông tin công ty")
    }
  }

  // Chuyển hướng đến trang edit job seeker profile
  const editJobSeekerProfile = () => {
    if (userData?.jobSeekerProfile?.id) {
      navigate(`/job-seeker-profiles/edit/${userData.jobSeekerProfile.id}`)
    }
  }

  const getRoleLabel = (role) => {
    switch (role) {
      case "JOB_SEEKER":
        return (
          <Tag color="blue" icon={<UserOutlined />}>
            Ứng viên
          </Tag>
        )
      case "EMPLOYER":
        return (
          <Tag color="green" icon={<BankOutlined />}>
            Nhà tuyển dụng
          </Tag>
        )
      case "ADMIN":
        return (
          <Tag color="purple" icon={<TeamOutlined />}>
            Quản trị viên
          </Tag>
        )
      default:
        return <Tag>{role}</Tag>
    }
  }

  const handleFormChange = () => {
    setFormChanged(true)
  }

  if (loading && !userData) {
    return (
      <div className="loading-container">
        <Spin size="large" indicator={<LoadingOutlined style={{ fontSize: 36 }} spin />} />
        <Text style={{ marginTop: 16 }}>Đang tải thông tin người dùng...</Text>
      </div>
    )
  }

  return (
    <div className="edit-user-container">
      <Breadcrumb className="breadcrumb-navigation">
        <Breadcrumb.Item href="/">
          <HomeOutlined /> Dashboard
        </Breadcrumb.Item>
        <Breadcrumb.Item href="/users">
          <TeamOutlined /> Quản lý người dùng
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <EditOutlined /> Chỉnh sửa người dùng
        </Breadcrumb.Item>
      </Breadcrumb>

      <Card className="user-profile-card" loading={loading}>
        <div className="user-profile-header">
          <div className="user-avatar-container">
            <Badge
              dot
              status={userData?.isActive ? "success" : "error"}
              offset={[-5, 5]}
              title={userData?.isActive ? "Đang hoạt động" : "Đã khóa"}
            >
              <Avatar
                src={userData?.avatarUrl}
                icon={!userData?.avatarUrl && <UserOutlined />}
                size={100}
                className="user-avatar"
              />
            </Badge>
            <div className="avatar-upload-overlay">
              <CameraOutlined />
            </div>
          </div>

          <div className="user-info">
            <Title level={3}>{userData?.fullName || <Skeleton.Input style={{ width: 200 }} active />}</Title>
            <Space size={16} wrap>
              {userData?.roleName && getRoleLabel(userData.roleName)}
              {userData?.isVerifyEmail ? (
                <Tag color="success" icon={<CheckCircleOutlined />}>
                  Email đã xác thực
                </Tag>
              ) : (
                <Tag color="warning" icon={<CloseCircleOutlined />}>
                  Email chưa xác thực
                </Tag>
              )}
              <Text type="secondary">ID: {userData?.id}</Text>
            </Space>
            <Paragraph className="user-email">
              <MailOutlined /> {userData?.email}
            </Paragraph>
          </div>

          <div className="user-actions">
            <Space direction="vertical" align="end">
              <Text type="secondary">
                Tham gia: {userData?.createAt ? moment(userData.createAt).format("DD/MM/YYYY") : "N/A"}
              </Text>
              <Text type="secondary">
                Đăng nhập cuối: {userData?.lastLogin ? moment(userData.lastLogin).format("DD/MM/YYYY HH:mm") : "N/A"}
              </Text>
            </Space>
          </div>
        </div>

        {formChanged && (
          <Alert
            message="Bạn có thay đổi chưa lưu"
            description="Hãy nhấn 'Lưu thay đổi' để cập nhật thông tin người dùng."
            type="warning"
            showIcon
            closable
            className="form-changed-alert"
          />
        )}

        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          className="user-edit-tabs"
          tabBarExtraContent={
            <Space>
              <Button onClick={() => navigate("/users")} icon={<RollbackOutlined />}>
                Quay lại
              </Button>
              <Button
                type="primary"
                onClick={() => form.submit()}
                loading={submitting}
                icon={<SaveOutlined />}
                disabled={!formChanged}
              >
                Lưu thay đổi
              </Button>
            </Space>
          }
        >
          <TabPane
            tab={
              <span>
                <UserOutlined /> Thông tin cơ bản
              </span>
            }
            key="basic"
          >
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              initialValues={userData}
              requiredMark="optional"
              onValuesChange={handleFormChange}
              className="user-edit-form"
            >
              <Row gutter={[24, 16]}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Email"
                    name="email"
                    rules={[{ required: true, message: "Vui lòng nhập email!", type: "email" }]}
                  >
                    <Input
                      placeholder="Nhập email"
                      prefix={<MailOutlined className="site-form-item-icon" />}
                      className="form-input"
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    label="Họ và tên"
                    name="fullName"
                    rules={[{ required: true, message: "Vui lòng nhập họ và tên!" }]}
                  >
                    <Input
                      placeholder="Nhập họ và tên"
                      prefix={<UserOutlined className="site-form-item-icon" />}
                      className="form-input"
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                label="Ảnh đại diện"
                name="avatarUrl"
                tooltip="Tải lên ảnh đại diện mới (JPG, PNG, tối đa 2MB)"
              >
                <Upload
                  listType="picture-card"
                  fileList={avatarFileList}
                  onChange={handleAvatarUpload}
                  maxCount={1}
                  showUploadList={{
                    showPreviewIcon: true,
                    showRemoveIcon: true,
                  }}
                  className="avatar-uploader"
                >
                  {avatarFileList.length < 1 && (
                    <div>
                      <UploadOutlined />
                      <div style={{ marginTop: 8 }}>Tải lên</div>
                    </div>
                  )}
                </Upload>
              </Form.Item>

              <Row gutter={[24, 16]}>
                <Col xs={24} md={8}>
                  <Form.Item
                    label="Vai trò"
                    name="roleName"
                    tooltip="Vai trò quyết định quyền hạn và chức năng của người dùng"
                  >
                    <Radio.Group disabled buttonStyle="solid" className="role-radio-group">
                      <Radio.Button value="JOB_SEEKER">
                        <UserOutlined /> Ứng viên
                      </Radio.Button>
                      <Radio.Button value="EMPLOYER">
                        <BankOutlined /> Nhà tuyển dụng
                      </Radio.Button>
                    </Radio.Group>
                  </Form.Item>
                </Col>

                <Col xs={12} md={8}>
                  <Form.Item
                    label="Trạng thái hoạt động"
                    name="isActive"
                    valuePropName="checked"
                    tooltip="Kích hoạt hoặc khóa tài khoản người dùng"
                  >
                    <Switch
                      checkedChildren={
                        <>
                          <CheckCircleOutlined /> Đang hoạt động
                        </>
                      }
                      unCheckedChildren={
                        <>
                          <CloseCircleOutlined /> Đã khóa
                        </>
                      }
                      className="status-switch"
                    />
                  </Form.Item>
                </Col>

                <Col xs={12} md={8}>
                  <Form.Item
                    label="Xác thực email"
                    name="isVerifyEmail"
                    valuePropName="checked"
                    tooltip="Trạng thái xác thực email của người dùng"
                  >
                    <Switch
                      checkedChildren={
                        <>
                          <CheckCircleOutlined /> Đã xác thực
                        </>
                      }
                      unCheckedChildren={
                        <>
                          <CloseCircleOutlined /> Chưa xác thực
                        </>
                      }

                      className="status-switch"
                    />
                  </Form.Item>

                  
                </Col>
                <Col xs={12} md={8}>
                      
                <Form.Item
                    label="Đặt làm quản trị viên"
                    name="isSupperuser"
                    valuePropName="checked"
                    tooltip="Cho phép người dùng này trở thành quản trị viên"
                  >
                    <Switch
                      checkedChildren={
                        <>
                          <CheckCircleOutlined /> Bật
                        </>
                      }
                      unCheckedChildren={
                        <>
                          <CloseCircleOutlined /> Tắt
                        </>
                      }

                      className="status-switch"
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item label="Số dư tài khoản" name="money" tooltip="Số dư hiện tại của người dùng">
                <Input
                  type="number"
                  placeholder="Số dư tài khoản"
                  disabled={userData?.roleName !== "EMPLOYER"}
                  prefix={<DollarOutlined />}
                  addonAfter="VND"
                  className="form-input"
                />
              </Form.Item>
            </Form>
          </TabPane>

          {userData?.roleName === "JOB_SEEKER" && (
            <TabPane
              tab={
                <span>
                  <IdcardOutlined /> Thông tin ứng viên
                </span>
              }
              key="jobseeker"
            >
              <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                initialValues={userData}
                requiredMark="optional"
                onValuesChange={handleFormChange}
                className="user-edit-form"
              >
                <Row gutter={[24, 16]}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Số điện thoại"
                      name={["jobSeekerProfile", "phone"]}
                      rules={[{ pattern: /^[0-9]{10}$/, message: "Số điện thoại không hợp lệ!" }]}
                      tooltip="Số điện thoại liên hệ của ứng viên"
                    >
                      <Input
                        placeholder="Nhập số điện thoại"
                        prefix={<PhoneOutlined className="site-form-item-icon" />}
                        className="form-input"
                      />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item label="Ngày sinh" name="birthday" tooltip="Ngày sinh của ứng viên">
                      <DatePicker
                        format="DD/MM/YYYY"
                        style={{ width: "100%" }}
                        placeholder="Chọn ngày sinh"
                        suffixIcon={<CalendarOutlined />}
                        className="form-input"
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={[24, 16]}>
                  <Col xs={24} md={12}>
                    <Form.Item label="Giới tính" name={["jobSeekerProfile", "gender"]} tooltip="Giới tính của ứng viên">
                      <Radio.Group buttonStyle="solid" className="gender-radio-group">
                        <Radio.Button value="M">
                          <ManOutlined /> Nam
                        </Radio.Button>
                        <Radio.Button value="F">
                          <WomanOutlined /> Nữ
                        </Radio.Button>
                      </Radio.Group>
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Tình trạng hôn nhân"
                      name={["jobSeekerProfile", "maritalStatus"]}
                      tooltip="Tình trạng hôn nhân của ứng viên"
                    >
                      <Radio.Group buttonStyle="solid" className="marital-radio-group">
                        <Radio.Button value="S">Độc thân</Radio.Button>
                        <Radio.Button value="M">
                          <HeartOutlined /> Đã kết hôn
                        </Radio.Button>
                      </Radio.Group>
                    </Form.Item>
                  </Col>
                </Row>

                <Divider />

                <div className="profile-actions">
                  <Tooltip title="Xem và chỉnh sửa hồ sơ chi tiết của ứng viên">
                    <Button
                      type="primary"
                      icon={<EditOutlined />}
                      onClick={editJobSeekerProfile}
                      disabled={!userData?.jobSeekerProfile?.id}
                      className="profile-action-button"
                    >
                      Chỉnh sửa hồ sơ ứng viên chi tiết
                    </Button>
                  </Tooltip>
                </div>
              </Form>
            </TabPane>
          )}

          {userData?.roleName === "EMPLOYER" && (
            <TabPane
              tab={
                <span>
                  <BankOutlined /> Thông tin công ty
                </span>
              }
              key="employer"
            >
              <div className="employer-info-container">
                {userData?.company?.id ? (
                  <Descriptions
                    title="Thông tin công ty"
                    bordered
                    column={{ xxl: 3, xl: 3, lg: 3, md: 2, sm: 1, xs: 1 }}
                    className="company-descriptions"
                  >
                    <Descriptions.Item label="ID Công ty">{userData.company.id}</Descriptions.Item>
                    <Descriptions.Item label="Tên công ty">{userData.company.companyName || "N/A"}</Descriptions.Item>
                    <Descriptions.Item label="Ngày tạo">
                      {userData.company.createAt ? moment(userData.company.createAt).format("DD/MM/YYYY") : "N/A"}
                    </Descriptions.Item>
                  </Descriptions>
                ) : (
                  <Alert
                    message="Chưa có thông tin công ty"
                    description="Người dùng này chưa có thông tin công ty liên kết."
                    type="info"
                    showIcon
                  />
                )}

                <div className="profile-actions">
                  <Tooltip title={userData?.company?.id ? "Chỉnh sửa thông tin công ty" : "Thêm thông tin công ty mới"}>
                    <Button
                      type="primary"
                      icon={<EditOutlined />}
                      onClick={editCompany}
                      className="profile-action-button"
                    >
                      {userData?.company?.id ? "Chỉnh sửa thông tin công ty" : "Thêm công ty mới"}
                    </Button>
                  </Tooltip>
                </div>
              </div>
            </TabPane>
          )}

          <TabPane
            tab={
              <span>
                <LockOutlined /> Bảo mật
              </span>
            }
            key="security"
          >
            <div className="security-container">
              <Alert
                message="Thông tin bảo mật"
                description="Phần này cho phép bạn quản lý các thiết lập bảo mật cho tài khoản người dùng."
                type="info"
                showIcon
                style={{ marginBottom: 24 }}
              />

              <Form layout="vertical" className="user-edit-form">
                <Form.Item label="Đặt lại mật khẩu" tooltip="Gửi email đặt lại mật khẩu cho người dùng">
                  <Button
                    type="primary"
                    icon={<LockOutlined />}
                    onClick={() => message.info(`Đã gửi email đặt lại mật khẩu đến ${userData?.email}`)}
                  >
                    Gửi email đặt lại mật khẩu
                  </Button>
                </Form.Item>

                <Form.Item label="Khóa tài khoản" tooltip="Khóa hoặc mở khóa tài khoản người dùng">
                  <Switch
                    checked={userData?.isActive}
                    onChange={(checked) => {
                      form.setFieldsValue({ isActive: checked })
                      setFormChanged(true)
                    }}
                    checkedChildren={
                      <>
                        <CheckCircleOutlined /> Đang hoạt động
                      </>
                    }
                    unCheckedChildren={
                      <>
                        <CloseCircleOutlined /> Đã khóa
                      </>
                    }
                    className="status-switch-large"
                  />
                </Form.Item>
              </Form>
            </div>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  )
}

export default EditUser

