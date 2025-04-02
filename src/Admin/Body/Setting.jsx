"use client"

import { useState } from "react"
import {
  Card,
  Input,
  Button,
  Form,
  Select,
  Switch,
  Upload,
  message,
  Row,
  Col,
  Divider,
  Space,
  Typography,
  Tooltip,
  Tabs,
  Popconfirm,
  Alert,
  Modal,
  Badge,
  Flex,
  ColorPicker,
} from "antd"
import {
  LockOutlined,
  SettingOutlined,
  BellOutlined,
  DatabaseOutlined,
  PictureOutlined,
  MailOutlined,
  SaveOutlined,
  MobileOutlined,
  GlobalOutlined,
  QuestionCircleOutlined,
  CloudUploadOutlined,
  ApiOutlined,
} from "@ant-design/icons"

const { Option } = Select
const { Title, Text, Paragraph } = Typography
const { TabPane } = Tabs

const Setting = () => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("general")
  const [previewVisible, setPreviewVisible] = useState(false)
  const [previewImage, setPreviewImage] = useState("")
  const [previewTitle, setPreviewTitle] = useState("")
  const [logoFileList, setLogoFileList] = useState([])
  const [faviconFileList, setFaviconFileList] = useState([])
  const [themeColor, setThemeColor] = useState("#1890ff")
  const [settingsChanged, setSettingsChanged] = useState(false)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)

  // Handle form value changes
  const handleFormChange = () => {
    setSettingsChanged(true)
  }

  // Handle save settings
  const handleSave = (values) => {
    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      setSettingsChanged(false)
      setShowSuccessMessage(true)

      // Auto hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccessMessage(false)
      }, 3000)

      console.log("Saved settings:", {
        ...values,
        logoFile: logoFileList.length > 0 ? logoFileList[0] : null,
        faviconFile: faviconFileList.length > 0 ? faviconFileList[0] : null,
        themeColor,
      })
    }, 1000)
  }

  // Handle image preview
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj)
    }

    setPreviewImage(file.url || file.preview)
    setPreviewVisible(true)
    setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf("/") + 1))
  }

  // Handle logo upload change
  const handleLogoChange = ({ fileList: newFileList }) => {
    setLogoFileList(newFileList)
    setSettingsChanged(true)
  }

  // Handle favicon upload change
  const handleFaviconChange = ({ fileList: newFileList }) => {
    setFaviconFileList(newFileList)
    setSettingsChanged(true)
  }

  // Handle theme color change
  const handleColorChange = (color) => {
    setThemeColor(color.toHexString())
    setSettingsChanged(true)
  }

  // Handle reset settings
  const handleResetSettings = () => {
    form.resetFields()
    setLogoFileList([])
    setFaviconFileList([])
    setThemeColor("#1890ff")
    setSettingsChanged(false)
    message.success("Đã khôi phục về cài đặt mặc định")
  }

  // Upload button for logo
  const uploadButton = (
    <div>
      <CloudUploadOutlined />
      <div style={{ marginTop: 8 }}>Tải lên</div>
    </div>
  )

  return (
    <div className="settings-container">
      {showSuccessMessage && (
        <Alert
          message="Cài đặt đã được lưu thành công!"
          type="success"
          showIcon
          closable
          banner
          style={{ marginBottom: 16 }}
        />
      )}

      <Card
        title={
          <Space>
            <SettingOutlined />
            <span>Cài Đặt Hệ Thống</span>
          </Space>
        }
        extra={
          <Space>
            {settingsChanged && (
              <Badge dot>
                <Text type="warning">Có thay đổi chưa lưu</Text>
              </Badge>
            )}
            <Popconfirm
              title="Khôi phục cài đặt mặc định?"
              description="Tất cả các thay đổi của bạn sẽ bị mất. Bạn có chắc chắn muốn tiếp tục?"
              onConfirm={handleResetSettings}
              okText="Đồng ý"
              cancelText="Hủy"
              icon={<QuestionCircleOutlined style={{ color: "red" }} />}
            >
              <Button>Khôi phục mặc định</Button>
            </Popconfirm>
            <Button
              type="primary"
              icon={<SaveOutlined />}
              onClick={() => form.submit()}
              loading={loading}
              disabled={!settingsChanged}
            >
              Lưu cài đặt
            </Button>
          </Space>
        }
        className="settings-card"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSave}
          onValuesChange={handleFormChange}
          requiredMark="optional"
        >
          <Tabs activeKey={activeTab} onChange={setActiveTab} tabPosition="left" className="settings-tabs">
            {/* Cấu hình chung */}
            <TabPane
              tab={
                <Tooltip title="Cấu hình chung" placement="right">
                  <Space>
                    <DatabaseOutlined />
                    <span>Cấu hình chung</span>
                  </Space>
                </Tooltip>
              }
              key="general"
            >
              <div className="tab-content">
                <Title level={4}>Cấu hình chung</Title>
                <Paragraph type="secondary">Thiết lập các cấu hình cơ bản cho hệ thống của bạn</Paragraph>

                <Row gutter={[24, 16]}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Tên hệ thống"
                      name="systemName"
                      initialValue="Hệ thống tuyển dụng"
                      tooltip="Tên hiển thị của hệ thống trên trình duyệt và giao diện"
                      rules={[{ required: true, message: "Vui lòng nhập tên hệ thống!" }]}
                    >
                      <Input placeholder="Nhập tên hệ thống" prefix={<GlobalOutlined />} allowClear />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Ngôn ngữ mặc định"
                      name="language"
                      initialValue="vi"
                      tooltip="Ngôn ngữ mặc định khi người dùng truy cập hệ thống"
                    >
                      <Select>
                        <Option value="vi">Tiếng Việt</Option>
                        <Option value="en">English</Option>
                        <Option value="ja">日本語</Option>
                        <Option value="ko">한국어</Option>
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Múi giờ"
                      name="timezone"
                      initialValue="Asia/Ho_Chi_Minh"
                      tooltip="Múi giờ được sử dụng để hiển thị thời gian trong hệ thống"
                    >
                      <Select showSearch>
                        <Option value="Asia/Ho_Chi_Minh">(GMT+7) Hồ Chí Minh</Option>
                        <Option value="Asia/Bangkok">(GMT+7) Bangkok</Option>
                        <Option value="Asia/Tokyo">(GMT+9) Tokyo</Option>
                        <Option value="America/New_York">(GMT-5) New York</Option>
                        <Option value="Europe/London">(GMT+0) London</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Định dạng ngày"
                      name="dateFormat"
                      initialValue="DD/MM/YYYY"
                      tooltip="Định dạng hiển thị ngày tháng trong hệ thống"
                    >
                      <Select>
                        <Option value="DD/MM/YYYY">DD/MM/YYYY</Option>
                        <Option value="MM/DD/YYYY">MM/DD/YYYY</Option>
                        <Option value="YYYY-MM-DD">YYYY-MM-DD</Option>
                        <Option value="DD-MM-YYYY">DD-MM-YYYY</Option>
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col xs={24}>
                    <Form.Item
                      label="Mô tả hệ thống"
                      name="systemDescription"
                      initialValue="Hệ thống quản lý tuyển dụng và ứng viên"
                      tooltip="Mô tả ngắn gọn về hệ thống, được sử dụng cho SEO và metadata"
                    >
                      <Input.TextArea placeholder="Nhập mô tả hệ thống" rows={3} showCount maxLength={200} />
                    </Form.Item>
                  </Col>
                </Row>
              </div>
            </TabPane>

            {/* Giao diện */}
            <TabPane
              tab={
                <Tooltip title="Giao diện" placement="right">
                  <Space>
                    <PictureOutlined />
                    <span>Giao diện</span>
                  </Space>
                </Tooltip>
              }
              key="interface"
            >
              <div className="tab-content">
                <Title level={4}>Cài đặt giao diện</Title>
                <Paragraph type="secondary">Tùy chỉnh giao diện và hình ảnh của hệ thống</Paragraph>

                <Row gutter={[24, 16]}>
                  <Col xs={24} md={12}>
                    <Form.Item label="Logo hệ thống" tooltip="Logo hiển thị trên thanh điều hướng và các trang chính">
                      <Upload
                        listType="picture-card"
                        fileList={logoFileList}
                        onPreview={handlePreview}
                        onChange={handleLogoChange}
                        maxCount={1}
                        accept="image/*"
                        beforeUpload={(file) => {
                          const isImage = file.type.startsWith("image/")
                          if (!isImage) {
                            message.error("Chỉ chấp nhận file hình ảnh!")
                          }
                          const isLt2M = file.size / 1024 / 1024 < 2
                          if (!isLt2M) {
                            message.error("Kích thước hình ảnh phải nhỏ hơn 2MB!")
                          }
                          return false // Prevent auto upload
                        }}
                      >
                        {logoFileList.length >= 1 ? null : uploadButton}
                      </Upload>
                      <Text type="secondary">Kích thước khuyến nghị: 200x60px, tối đa 2MB</Text>
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item label="Favicon" tooltip="Biểu tượng nhỏ hiển thị trên tab trình duyệt">
                      <Upload
                        listType="picture-card"
                        fileList={faviconFileList}
                        onPreview={handlePreview}
                        onChange={handleFaviconChange}
                        maxCount={1}
                        accept="image/png,image/x-icon,image/jpeg"
                        beforeUpload={(file) => {
                          const isImage = /\.(png|ico|jpg|jpeg)$/.test(file.name)
                          if (!isImage) {
                            message.error("Chỉ chấp nhận file PNG, ICO hoặc JPEG!")
                          }
                          const isLt1M = file.size / 1024 / 1024 < 1
                          if (!isLt1M) {
                            message.error("Kích thước favicon phải nhỏ hơn 1MB!")
                          }
                          return false // Prevent auto upload
                        }}
                      >
                        {faviconFileList.length >= 1 ? null : uploadButton}
                      </Upload>
                      <Text type="secondary">Kích thước khuyến nghị: 32x32px, tối đa 1MB</Text>
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item label="Màu chủ đạo" tooltip="Màu chính được sử dụng trong giao diện hệ thống">
                      <Flex align="center" gap="middle">
                        <ColorPicker value={themeColor} onChange={handleColorChange} showText />
                        <div className="color-preview" style={{ backgroundColor: themeColor }}>
                          <Text style={{ color: "#fff" }}>Xem trước</Text>
                        </div>
                      </Flex>
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Chế độ tối"
                      name="darkMode"
                      valuePropName="checked"
                      tooltip="Cho phép người dùng chuyển đổi giữa chế độ sáng và tối"
                    >
                      <Switch checkedChildren="Bật" unCheckedChildren="Tắt" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Hiển thị logo trên mobile"
                      name="showLogoOnMobile"
                      valuePropName="checked"
                      initialValue={true}
                      tooltip="Hiển thị logo trên thiết bị di động"
                    >
                      <Switch checkedChildren="Hiện" unCheckedChildren="Ẩn" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Hiệu ứng chuyển trang"
                      name="pageTransition"
                      initialValue="fade"
                      tooltip="Hiệu ứng khi chuyển đổi giữa các trang"
                    >
                      <Select>
                        <Option value="none">Không có</Option>
                        <Option value="fade">Mờ dần</Option>
                        <Option value="slide">Trượt</Option>
                        <Option value="zoom">Phóng to/thu nhỏ</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
              </div>
            </TabPane>

            {/* Bảo mật */}
            <TabPane
              tab={
                <Tooltip title="Bảo mật" placement="right">
                  <Space>
                    <LockOutlined />
                    <span>Bảo mật</span>
                  </Space>
                </Tooltip>
              }
              key="security"
            >
              <div className="tab-content">
                <Title level={4}>Cài đặt bảo mật</Title>
                <Paragraph type="secondary">Thiết lập các tùy chọn bảo mật cho hệ thống của bạn</Paragraph>

                <Alert
                  message="Lưu ý về bảo mật"
                  description="Các thay đổi về bảo mật sẽ được áp dụng ngay lập tức. Hãy đảm bảo bạn lưu lại thông tin đăng nhập mới."
                  type="warning"
                  showIcon
                  style={{ marginBottom: 24 }}
                />

                <Row gutter={[24, 16]}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Mật khẩu quản trị"
                      name="adminPassword"
                      tooltip="Mật khẩu mới cho tài khoản quản trị"
                      rules={[
                        {
                          pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                          message:
                            "Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt!",
                        },
                      ]}
                    >
                      <Input.Password placeholder="Nhập mật khẩu mới" prefix={<LockOutlined />} />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Xác nhận mật khẩu"
                      name="confirmPassword"
                      dependencies={["adminPassword"]}
                      tooltip="Nhập lại mật khẩu để xác nhận"
                      rules={[
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            if (!value || getFieldValue("adminPassword") === value) {
                              return Promise.resolve()
                            }
                            return Promise.reject(new Error("Mật khẩu xác nhận không khớp!"))
                          },
                        }),
                      ]}
                    >
                      <Input.Password placeholder="Xác nhận mật khẩu mới" prefix={<LockOutlined />} />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Xác thực hai yếu tố (2FA)"
                      name="twoFactorAuth"
                      valuePropName="checked"
                      tooltip="Bật xác thực hai yếu tố để tăng cường bảo mật"
                    >
                      <Switch checkedChildren="Bật" unCheckedChildren="Tắt" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Thời gian hết hạn phiên đăng nhập"
                      name="sessionTimeout"
                      initialValue="60"
                      tooltip="Thời gian (phút) trước khi phiên đăng nhập hết hạn do không hoạt động"
                    >
                      <Select>
                        <Option value="15">15 phút</Option>
                        <Option value="30">30 phút</Option>
                        <Option value="60">1 giờ</Option>
                        <Option value="120">2 giờ</Option>
                        <Option value="240">4 giờ</Option>
                        <Option value="480">8 giờ</Option>
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Số lần đăng nhập thất bại tối đa"
                      name="maxLoginAttempts"
                      initialValue="5"
                      tooltip="Số lần đăng nhập thất bại tối đa trước khi tài khoản bị khóa"
                    >
                      <Select>
                        <Option value="3">3 lần</Option>
                        <Option value="5">5 lần</Option>
                        <Option value="10">10 lần</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Thời gian khóa tài khoản"
                      name="accountLockDuration"
                      initialValue="30"
                      tooltip="Thời gian (phút) khóa tài khoản sau khi đăng nhập thất bại nhiều lần"
                    >
                      <Select>
                        <Option value="15">15 phút</Option>
                        <Option value="30">30 phút</Option>
                        <Option value="60">1 giờ</Option>
                        <Option value="1440">24 giờ</Option>
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col xs={24}>
                    <Form.Item
                      label="Bắt buộc đổi mật khẩu định kỳ"
                      name="forcePasswordChange"
                      valuePropName="checked"
                      tooltip="Yêu cầu người dùng đổi mật khẩu định kỳ"
                    >
                      <Switch checkedChildren="Bật" unCheckedChildren="Tắt" />
                    </Form.Item>
                  </Col>
                </Row>
              </div>
            </TabPane>

            {/* Thông báo */}
            <TabPane
              tab={
                <Tooltip title="Thông báo" placement="right">
                  <Space>
                    <BellOutlined />
                    <span>Thông báo</span>
                  </Space>
                </Tooltip>
              }
              key="notifications"
            >
              <div className="tab-content">
                <Title level={4}>Cài đặt thông báo</Title>
                <Paragraph type="secondary">Quản lý cách thức gửi và nhận thông báo từ hệ thống</Paragraph>

                <Row gutter={[24, 16]}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Email nhận thông báo"
                      name="notificationEmail"
                      initialValue="admin@example.com"
                      tooltip="Email chính để nhận thông báo từ hệ thống"
                      rules={[
                        { type: "email", message: "Email không hợp lệ!" },
                        { required: true, message: "Vui lòng nhập email!" },
                      ]}
                    >
                      <Input prefix={<MailOutlined />} type="email" placeholder="Nhập email" allowClear />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Email dự phòng"
                      name="backupEmail"
                      tooltip="Email dự phòng khi không thể gửi đến email chính"
                      rules={[{ type: "email", message: "Email không hợp lệ!" }]}
                    >
                      <Input prefix={<MailOutlined />} type="email" placeholder="Nhập email dự phòng" allowClear />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Số điện thoại nhận SMS"
                      name="phoneNumber"
                      tooltip="Số điện thoại để nhận thông báo qua SMS"
                    >
                      <Input prefix={<MobileOutlined />} placeholder="Nhập số điện thoại" allowClear />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Gửi thông báo qua SMS"
                      name="smsNotification"
                      valuePropName="checked"
                      tooltip="Bật/tắt thông báo qua SMS"
                    >
                      <Switch checkedChildren="Bật" unCheckedChildren="Tắt" />
                    </Form.Item>
                  </Col>

                  <Divider orientation="left">Loại thông báo</Divider>

                  <Col xs={24} md={8}>
                    <Form.Item
                      label="Thông báo đăng nhập"
                      name="loginNotification"
                      valuePropName="checked"
                      initialValue={true}
                      tooltip="Nhận thông báo khi có đăng nhập mới"
                    >
                      <Switch checkedChildren="Bật" unCheckedChildren="Tắt" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={8}>
                    <Form.Item
                      label="Thông báo bảo mật"
                      name="securityNotification"
                      valuePropName="checked"
                      initialValue={true}
                      tooltip="Nhận thông báo về các vấn đề bảo mật"
                    >
                      <Switch checkedChildren="Bật" unCheckedChildren="Tắt" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={8}>
                    <Form.Item
                      label="Thông báo hệ thống"
                      name="systemNotification"
                      valuePropName="checked"
                      initialValue={true}
                      tooltip="Nhận thông báo về các cập nhật hệ thống"
                    >
                      <Switch checkedChildren="Bật" unCheckedChildren="Tắt" />
                    </Form.Item>
                  </Col>
                </Row>
              </div>
            </TabPane>

            {/* Nâng cao */}
            <TabPane
              tab={
                <Tooltip title="Nâng cao" placement="right">
                  <Space>
                    <ApiOutlined />
                    <span>Nâng cao</span>
                  </Space>
                </Tooltip>
              }
              key="advanced"
            >
              <div className="tab-content">
                <Title level={4}>Cài đặt nâng cao</Title>
                <Paragraph type="secondary">Các tùy chọn nâng cao dành cho quản trị viên hệ thống</Paragraph>

                <Alert
                  message="Cảnh báo"
                  description="Các cài đặt trong phần này có thể ảnh hưởng đến hiệu suất và hoạt động của hệ thống. Chỉ thay đổi khi bạn hiểu rõ tác động."
                  type="warning"
                  showIcon
                  style={{ marginBottom: 24 }}
                />

                <Row gutter={[24, 16]}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Bật chế độ bảo trì"
                      name="maintenanceMode"
                      valuePropName="checked"
                      tooltip="Khi bật, hệ thống sẽ hiển thị trang bảo trì cho người dùng"
                    >
                      <Switch checkedChildren="Bật" unCheckedChildren="Tắt" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Thời gian bảo trì dự kiến"
                      name="maintenanceTime"
                      initialValue="60"
                      tooltip="Thời gian dự kiến (phút) cho việc bảo trì hệ thống"
                    >
                      <Select>
                        <Option value="30">30 phút</Option>
                        <Option value="60">1 giờ</Option>
                        <Option value="120">2 giờ</Option>
                        <Option value="240">4 giờ</Option>
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Giới hạn kết nối đồng thời"
                      name="maxConnections"
                      initialValue="100"
                      tooltip="Số lượng kết nối đồng thời tối đa đến hệ thống"
                    >
                      <Select>
                        <Option value="50">50 kết nối</Option>
                        <Option value="100">100 kết nối</Option>
                        <Option value="200">200 kết nối</Option>
                        <Option value="500">500 kết nối</Option>
                        <Option value="1000">1000 kết nối</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Bật ghi log chi tiết"
                      name="detailedLogging"
                      valuePropName="checked"
                      tooltip="Ghi lại thông tin chi tiết về hoạt động của hệ thống"
                    >
                      <Switch checkedChildren="Bật" unCheckedChildren="Tắt" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Thời gian lưu trữ log"
                      name="logRetention"
                      initialValue="30"
                      tooltip="Thời gian (ngày) lưu trữ log trước khi tự động xóa"
                    >
                      <Select>
                        <Option value="7">7 ngày</Option>
                        <Option value="14">14 ngày</Option>
                        <Option value="30">30 ngày</Option>
                        <Option value="90">90 ngày</Option>
                        <Option value="180">180 ngày</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Tự động sao lưu dữ liệu"
                      name="autoBackup"
                      valuePropName="checked"
                      initialValue={true}
                      tooltip="Tự động sao lưu dữ liệu hệ thống theo lịch"
                    >
                      <Switch checkedChildren="Bật" unCheckedChildren="Tắt" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Tần suất sao lưu"
                      name="backupFrequency"
                      initialValue="daily"
                      tooltip="Tần suất thực hiện sao lưu dữ liệu tự động"
                    >
                      <Select>
                        <Option value="hourly">Hàng giờ</Option>
                        <Option value="daily">Hàng ngày</Option>
                        <Option value="weekly">Hàng tuần</Option>
                        <Option value="monthly">Hàng tháng</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Số bản sao lưu tối đa"
                      name="maxBackups"
                      initialValue="10"
                      tooltip="Số lượng bản sao lưu tối đa được lưu trữ"
                    >
                      <Select>
                        <Option value="5">5 bản</Option>
                        <Option value="10">10 bản</Option>
                        <Option value="20">20 bản</Option>
                        <Option value="50">50 bản</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
              </div>
            </TabPane>
          </Tabs>

          {/* Hidden submit button for form submission */}
          <Button type="primary" htmlType="submit" style={{ display: "none" }} />
        </Form>
      </Card>

      {/* Image preview modal */}
      <Modal open={previewVisible} title={previewTitle} footer={null} onCancel={() => setPreviewVisible(false)}>
        <img alt="preview" style={{ width: "100%" }} src={previewImage || "/placeholder.svg"} />
      </Modal>

      <style jsx global>{`
        .settings-container {
          padding: 24px;
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .settings-card {
          border-radius: 8px;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px rgba(0, 0, 0, 0.02);
        }
        
        .settings-tabs .ant-tabs-content {
          padding: 0 16px;
        }
        
        .tab-content {
          padding: 16px 0;
        }
        
        .color-preview {
          width: 100px;
          height: 36px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s;
        }
        
        .ant-upload-list-item-info {
          border-radius: 4px;
          overflow: hidden;
        }
        
        /* Dark mode support */
        body.dark .settings-container {
          background-color: #141414;
        }
        
        body.dark .settings-card {
          background-color: #1f1f1f;
          border-color: #303030;
        }
        
        body.dark .ant-tabs-tab {
          color: rgba(255, 255, 255, 0.65);
        }
        
        body.dark .ant-tabs-tab-active {
          color: #1890ff;
        }
      `}</style>
    </div>
  )
}

// Helper function to convert file to base64
const getBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })
}

export default Setting

