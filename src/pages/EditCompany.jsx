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
  Card,
  Divider,
  Typography,
  Row,
  Col,
  Tabs,
  Space,
  Tag,
} from "antd"
import {
  UploadOutlined,
  BuildOutlined,
  GlobalOutlined,
  MailOutlined,
  PhoneOutlined,
  CalendarOutlined,
  TeamOutlined,
  NumberOutlined,
  FacebookOutlined,
  YoutubeOutlined,
  LinkedinOutlined,
  UserOutlined,
  EnvironmentOutlined,
  SaveOutlined,
  RollbackOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons"
import moment from "moment"
import companyService from "../services/companyService"

const { Title, Text, Paragraph } = Typography
const { TabPane } = Tabs

function EditCompany() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [companyData, setCompanyData] = useState(null)
  const [fileList, setFileList] = useState([])
  const [coverFileList, setCoverFileList] = useState([])
  const [activeTab, setActiveTab] = useState("1")

  // Giả lập API call để lấy dữ liệu công ty
  const fetchCompanyData = async () => {
    setLoading(true)
    try {
      // Thay bằng API thực tế của bạn, ví dụ: await companyService.getCompanyById(id)
      const response = {
        id: 4,
        companyName: "CÔNG TY TNHH NASHTECH VIỆT NAM",
        slug: "cong-ty-tnhh-nashtech-viet-nam",
        companyImageUrl: "https://cdn.timviectop.com/img/2022-07-13/62cf3cb433c609921371f335.png",
        companyImagePublicId: null,
        companyCoverImageUrl: "https://cdn1.vieclam24h.vn/tvn/images/assets/img/generic_18.jpg",
        companyCoverImagePublicId: null,
        facebookUrl: null,
        youtubeUrl: null,
        linkedinUrl: null,
        companyEmail: "nashtech@gmail.com",
        companyPhone: "0213562425",
        websiteUrl: "https://nashtechglobal.com",
        taxCode: "0301483946 ",
        since: "2017-01-01T17:00:00.000Z",
        fieldOperation: "Công nghệ thông tin ",
        description: null,
        employeeSize: 6,
        createAt: "2025-03-16T10:19:26.972Z",
        updateAt: "2025-03-16T10:19:26.972Z",
        location: {
          id: 17,
          address: "Quận 1, Thành phố Hồ Chí Minh",
          lat: null,
          lng: null,
          createAt: "2025-03-16T10:19:23.550Z",
          updateAt: "2025-03-16T10:19:23.550Z",
          city: {
            id: 30,
            name: "TP.Hồ Chí Minh",
            createAt: "2025-03-04T08:22:31.657Z",
            updateAt: "2025-03-04T08:22:31.657Z",
          },
        },
        user: {
          id: 16,
          email: "hr@nashtech.com",
          fullName: "NashTech",
          password: "$2b$10$yRHs68qDHeSU6XRSBwVLIOGtKuNjgAe/kDWjzaoHp1ZGg4I1ziqcu",
          isActive: true,
          isVerifyEmail: true,
          isSupperuser: false,
          isStaff: false,
          hasCompany: true,
          roleName: "EMPLOYER",
          money: 0,
          avatarUrl: "https://res.cloudinary.com/myjob/image/upload/c_scale,h_200,w_200/myjob/Avatar/defaultAvatar.jpg",
          avatarPublicId: null,
          lastLogin: "2025-03-16T10:19:50.583Z",
          createAt: "2025-03-16T10:19:23.531Z",
          updateAt: "2025-03-16T10:19:50.587Z",
        },
      }

      const resData = await companyService.getCompanyDetails(id)
      console.log(resData)
      setCompanyData(resData)
      form.setFieldsValue({
        ...resData,
        since: resData.since ? moment(resData.since) : null,
      })
      setFileList(
        resData.companyImageUrl
          ? [
              {
                uid: "-1",
                name: "companyImage",
                status: "done",
                url: resData.companyImageUrl,
              },
            ]
          : [],
      )
      setCoverFileList(
        resData.companyCoverImageUrl
          ? [
              {
                uid: "-1",
                name: "companyCoverImage",
                status: "done",
                url: resData.companyCoverImageUrl,
              },
            ]
          : [],
      )
    } catch (error) {
      message.error("Không thể tải dữ liệu công ty!")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCompanyData()
  }, [id])

  // Xử lý submit form
  const onFinish = async (values) => {
    setLoading(true)
    try {
      const updatedData = {
        ...values,
        since: values.since ? values.since.toISOString() : null,
      }
      // Thay bằng API thực tế của bạn, ví dụ: await companyService.updateCompany(id, updatedData)
      console.log("Updated company data:", updatedData)
      message.success("Cập nhật công ty thành công!")
      navigate("/companies") // Quay lại danh sách công ty
    } catch (error) {
      message.error("Cập nhật công ty thất bại!")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  // Xử lý upload ảnh công ty
  const handleCompanyImageUpload = ({ fileList }) => {
    setFileList(fileList)
    if (fileList.length > 0 && fileList[0].status === "done") {
      form.setFieldsValue({ companyImageUrl: fileList[0].url })
    }
  }

  // Xử lý upload ảnh bìa
  const handleCoverImageUpload = ({ fileList }) => {
    setCoverFileList(fileList)
    if (fileList.length > 0 && fileList[0].status === "done") {
      form.setFieldsValue({ companyCoverImageUrl: fileList[0].url })
    }
  }

  // Chuyển hướng đến trang edit user
  const editUser = () => {
    if (companyData?.user?.id) {
      navigate(`/users/edit/${companyData.user.id}`)
    }
  }

  // Chuyển hướng đến trang edit location
  const editLocation = () => {
    if (companyData?.location?.id) {
      navigate(`/locations/edit/${companyData.location.id}`)
    }
  }

  if (loading && !companyData) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
        <Spin size="large" tip="Đang tải thông tin công ty..." />
      </div>
    )
  }

  return (
    <div className="edit-company-container" style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 16px" }}>
      <Card
        className="company-header-card"
        style={{
          marginBottom: 24,
          borderRadius: 8,
          overflow: "hidden",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        }}
        bodyStyle={{ padding: 0 }}
      >
        {/* Cover Image */}
        <div
          className="company-cover"
          style={{
            height: 200,
            backgroundImage: `url(${companyData?.companyCoverImageUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            position: "relative",
          }}
        >
          <div
            className="company-info-overlay"
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              padding: "60px 24px 24px",
              background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)",
              color: "white",
              display: "flex",
              alignItems: "flex-end",
            }}
          >
            <div
              className="company-logo"
              style={{
                width: 100,
                height: 100,
                borderRadius: 8,
                overflow: "hidden",
                border: "4px solid white",
                backgroundColor: "white",
                marginRight: 16,
                flexShrink: 0,
              }}
            >
              <img
                src={companyData?.companyImageUrl || "/placeholder.svg"}
                alt={companyData?.companyName}
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            </div>
            <div>
              <Title level={3} style={{ color: "white", margin: 0 }}>
                {companyData?.companyName}
              </Title>
              <Space size={16}>
                <Text style={{ color: "white" }}>
                  <EnvironmentOutlined /> {companyData?.location?.address}
                </Text>
                <Text style={{ color: "white" }}>
                  <BuildOutlined /> {companyData?.fieldOperation}
                </Text>
              </Space>
            </div>
          </div>
        </div>
      </Card>

      <Row gutter={24}>
        <Col xs={24} lg={6}>
          <Card
            className="company-info-card"
            style={{
              marginBottom: 24,
              borderRadius: 8,
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            }}
          >
            <div style={{ textAlign: "center", marginBottom: 16 }}>
              <Title level={4}>Thông tin công ty</Title>
              <Tag color="blue">ID: {companyData?.id}</Tag>
            </div>

            <Divider style={{ margin: "12px 0" }} />

            <div className="company-quick-info">
              <Paragraph>
                <Space>
                  <GlobalOutlined />
                  <Text strong>Website:</Text>
                </Space>
                <br />
                <a href={companyData?.websiteUrl} target="_blank" rel="noopener noreferrer">
                  {companyData?.websiteUrl}
                </a>
              </Paragraph>

              <Paragraph>
                <Space>
                  <MailOutlined />
                  <Text strong>Email:</Text>
                </Space>
                <br />
                <a href={`mailto:${companyData?.companyEmail}`}>{companyData?.companyEmail}</a>
              </Paragraph>

              <Paragraph>
                <Space>
                  <PhoneOutlined />
                  <Text strong>Điện thoại:</Text>
                </Space>
                <br />
                <a href={`tel:${companyData?.companyPhone}`}>{companyData?.companyPhone}</a>
              </Paragraph>

              <Paragraph>
                <Space>
                  <CalendarOutlined />
                  <Text strong>Thành lập:</Text>
                </Space>
                <br />
                {companyData?.since ? moment(companyData.since).format("DD/MM/YYYY") : "Chưa cập nhật"}
              </Paragraph>

              <Paragraph>
                <Space>
                  <TeamOutlined />
                  <Text strong>Quy mô:</Text>
                </Space>
                <br />
                {companyData?.employeeSize} nhân viên
              </Paragraph>
            </div>

            <Divider style={{ margin: "12px 0" }} />

            <div style={{ marginTop: 16 }}>
              <Button
                type="primary"
                icon={<UserOutlined />}
                onClick={editUser}
                disabled={!companyData?.user?.id}
                block
                style={{ marginBottom: 12 }}
              >
                Quản lý người dùng
              </Button>

              <Button
                type="default"
                icon={<EnvironmentOutlined />}
                onClick={editLocation}
                disabled={!companyData?.location?.id}
                block
              >
                Quản lý địa điểm
              </Button>
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={18}>
          <Card
            className="company-edit-form-card"
            style={{
              borderRadius: 8,
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            }}
          >
            <Tabs activeKey={activeTab} onChange={setActiveTab} type="card" tabBarStyle={{ marginBottom: 24 }}>
              <TabPane
                tab={
                  <span>
                    <InfoCircleOutlined />
                    Thông tin cơ bản
                  </span>
                }
                key="1"
              >
                <Form
                  form={form}
                  layout="vertical"
                  onFinish={onFinish}
                  initialValues={companyData}
                  requiredMark="optional"
                >
                  <Row gutter={24}>
                    <Col xs={24} md={12}>
                      <Form.Item
                        label="Tên công ty"
                        name="companyName"
                        rules={[{ required: true, message: "Vui lòng nhập tên công ty!" }]}
                      >
                        <Input
                          placeholder="Nhập tên công ty"
                          prefix={<BuildOutlined className="site-form-item-icon" />}
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                      <Form.Item
                        label="Slug"
                        name="slug"
                        tooltip="Slug được tạo tự động từ tên công ty và không thể chỉnh sửa"
                      >
                        <Input placeholder="Slug tự động" disabled />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={24}>
                    <Col xs={24} md={12}>
                      <Form.Item
                        label="Logo công ty"
                        name="companyImageUrl"
                        tooltip="Logo công ty nên có kích thước vuông và nền trong suốt"
                      >
                        <Upload
                          listType="picture-card"
                          fileList={fileList}
                          onChange={handleCompanyImageUpload}
                          maxCount={1}
                          showUploadList={{
                            showPreviewIcon: true,
                            showRemoveIcon: true,
                          }}
                        >
                          {fileList.length < 1 && (
                            <div>
                              <UploadOutlined />
                              <div style={{ marginTop: 8 }}>Tải logo</div>
                            </div>
                          )}
                        </Upload>
                      </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                      <Form.Item
                        label="Ảnh bìa công ty"
                        name="companyCoverImageUrl"
                        tooltip="Ảnh bìa nên có tỷ lệ 16:9 và độ phân giải cao"
                      >
                        <Upload
                          listType="picture-card"
                          fileList={coverFileList}
                          onChange={handleCoverImageUpload}
                          maxCount={1}
                          showUploadList={{
                            showPreviewIcon: true,
                            showRemoveIcon: true,
                          }}
                        >
                          {coverFileList.length < 1 && (
                            <div>
                              <UploadOutlined />
                              <div style={{ marginTop: 8 }}>Tải ảnh bìa</div>
                            </div>
                          )}
                        </Upload>
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={24}>
                    <Col xs={24} md={12}>
                      <Form.Item
                        label="Email công ty"
                        name="companyEmail"
                        rules={[{ type: "email", message: "Email không hợp lệ!" }]}
                      >
                        <Input
                          placeholder="Nhập email công ty"
                          prefix={<MailOutlined className="site-form-item-icon" />}
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                      <Form.Item
                        label="Số điện thoại"
                        name="companyPhone"
                        rules={[{ pattern: /^[0-9]{10,11}$/, message: "Số điện thoại không hợp lệ!" }]}
                      >
                        <Input
                          placeholder="Nhập số điện thoại"
                          prefix={<PhoneOutlined className="site-form-item-icon" />}
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={24}>
                    <Col xs={24} md={12}>
                      <Form.Item
                        label="Website"
                        name="websiteUrl"
                        rules={[{ type: "url", message: "URL không hợp lệ!" }]}
                      >
                        <Input
                          placeholder="Nhập URL website"
                          prefix={<GlobalOutlined className="site-form-item-icon" />}
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                      <Form.Item label="Mã số thuế" name="taxCode" tooltip="Mã số thuế doanh nghiệp">
                        <Input
                          placeholder="Nhập mã số thuế"
                          prefix={<NumberOutlined className="site-form-item-icon" />}
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={24}>
                    <Col xs={24} md={12}>
                      <Form.Item label="Ngày thành lập" name="since">
                        <DatePicker format="DD/MM/YYYY" style={{ width: "100%" }} placeholder="Chọn ngày thành lập" />
                      </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                      <Form.Item label="Số lượng nhân viên" name="employeeSize" tooltip="Tổng số nhân viên của công ty">
                        <Input
                          type="number"
                          placeholder="Nhập số lượng nhân viên"
                          prefix={<TeamOutlined className="site-form-item-icon" />}
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.Item
                    label="Lĩnh vực hoạt động"
                    name="fieldOperation"
                    tooltip="Lĩnh vực kinh doanh chính của công ty"
                  >
                    <Input
                      placeholder="Nhập lĩnh vực hoạt động"
                      prefix={<BuildOutlined className="site-form-item-icon" />}
                    />
                  </Form.Item>

                  <Form.Item
                    label="Mô tả"
                    name="description"
                    tooltip="Mô tả chi tiết về công ty, lĩnh vực hoạt động và văn hóa doanh nghiệp"
                  >
                    <Input.TextArea rows={4} placeholder="Nhập mô tả công ty" showCount maxLength={1000} />
                  </Form.Item>
                </Form>
              </TabPane>

              <TabPane
                tab={
                  <span>
                    <GlobalOutlined />
                    Mạng xã hội
                  </span>
                }
                key="2"
              >
                <Form
                  form={form}
                  layout="vertical"
                  onFinish={onFinish}
                  initialValues={companyData}
                  requiredMark="optional"
                >
                  <Form.Item
                    label="Facebook URL"
                    name="facebookUrl"
                    rules={[{ type: "url", message: "URL không hợp lệ!" }]}
                  >
                    <Input
                      placeholder="Nhập URL Facebook"
                      prefix={<FacebookOutlined className="site-form-item-icon" />}
                    />
                  </Form.Item>

                  <Form.Item
                    label="YouTube URL"
                    name="youtubeUrl"
                    rules={[{ type: "url", message: "URL không hợp lệ!" }]}
                  >
                    <Input
                      placeholder="Nhập URL YouTube"
                      prefix={<YoutubeOutlined className="site-form-item-icon" />}
                    />
                  </Form.Item>

                  <Form.Item
                    label="LinkedIn URL"
                    name="linkedinUrl"
                    rules={[{ type: "url", message: "URL không hợp lệ!" }]}
                  >
                    <Input
                      placeholder="Nhập URL LinkedIn"
                      prefix={<LinkedinOutlined className="site-form-item-icon" />}
                    />
                  </Form.Item>
                </Form>
              </TabPane>
            </Tabs>

            <Divider />

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <Space size="middle">
                <Button onClick={() => navigate("/companies")} icon={<RollbackOutlined />} size="large">
                  Quay lại
                </Button>
                <Button
                  type="primary"
                  onClick={() => form.submit()}
                  loading={loading}
                  icon={<SaveOutlined />}
                  size="large"
                >
                  Lưu thay đổi
                </Button>
              </Space>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default EditCompany

