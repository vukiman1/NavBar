"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import {
  Form,
  Input,
  Button,
  Spin,
  message,
  DatePicker,
  Radio,
  Switch,
  Select,
  InputNumber,
  Card,
  Row,
  Col,
  Typography,
  Tag,
  Steps,
  Space,
  Badge,
  Avatar,
} from "antd"
import {
  CalendarOutlined,
  TeamOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  BankOutlined,
  HomeOutlined,
  DollarOutlined,
  FireOutlined,
  ClockCircleOutlined,
  SaveOutlined,
  RollbackOutlined,
  BuildOutlined,
  BookOutlined,
  EnvironmentOutlined,
  InfoCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  FileTextOutlined,
} from "@ant-design/icons"
import { Editor } from "react-draft-wysiwyg"
import { EditorState, ContentState, convertToRaw } from "draft-js"
import draftToHtml from "draftjs-to-html"
import htmlToDraft from "html-to-draftjs"
import moment from "moment"
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"
import jobService from "../services/jobService"

const { Title, Text } = Typography
const { Step } = Steps

function EditJobPost() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [jobData, setJobData] = useState(null)
  const [jobDescriptionEditorState, setJobDescriptionEditorState] = useState(EditorState.createEmpty())
  const [jobRequirementEditorState, setJobRequirementEditorState] = useState(EditorState.createEmpty())
  const [benefitsEditorState, setBenefitsEditorState] = useState(EditorState.createEmpty())
  const [currentStep, setCurrentStep] = useState(0)

  const fetchJobData = async () => {
    setLoading(true)
    try {
      // const response = {
      //   id: 2,
      //   jobName: "Lead Data Engineer",
      //   slug: "lead-data-engineer",
      //   deadline: "2025-03-24T17:00:00.000Z",
      //   quantity: 1,
      //   genderRequired: "O",
      //   jobDescription: "<p><strong>About us</strong><br>A subsidiary of the FPT Group...</p>",
      //   jobRequirement: "<ul>\n<li>Bachelor's or Master's degree in Computer Science...</li>\n</ul>",
      //   benefitsEnjoyed: "<ul>\n<li>Attractive Salary Package...</li>\n</ul>",
      //   position: 5,
      //   typeOfWorkplace: 1,
      //   experience: 8,
      //   academicLevel: 2,
      //   jobType: 1,
      //   salaryMin: 40000000,
      //   salaryMax: 60000000,
      //   isHot: false,
      //   isUrgent: true,
      //   isExpired: true,
      //   contactPersonName: "Do Thi Phuong",
      //   contactPersonEmail: "phuong@gmail.com",
      //   contactPersonPhone: "0963258741",
      //   views: 0,
      //   shares: 0,
      //   status: 3,
      //   createAt: "2025-03-09T11:05:29.701Z",
      //   updateAt: "2025-03-25T16:22:50.051Z",
      //   company: {
      //     id: 1,
      //     companyName: "Công ty TNHH Phần mềm FPT",
      //     slug: "cong-ty-tnhh-phan-mem-fpt-1",
      //     companyImageUrl:
      //       "https://res.cloudinary.com/myjob/image/upload/v1742112694/myjob/companyAvatar/2025/03/cong-ty-tnhh-phan-mem-fpt_1742112690939.png",
      //     companyImagePublicId: "myjob/companyAvatar/2025/03/cong-ty-tnhh-phan-mem-fpt_1742112690939",
      //     companyCoverImageUrl:
      //       "https://res.cloudinary.com/myjob/image/upload/v1743093753/myjob/companyCover/2025/03/cong-ty-tnhh-phan-mem-fpt-1_1743093751439.png",
      //     companyCoverImagePublicId: "myjob/companyCover/2025/03/cong-ty-tnhh-phan-mem-fpt-1_1743093751439",
      //     facebookUrl: "http://example.com",
      //     youtubeUrl: "http://example.com",
      //     linkedinUrl: "http://example.com",
      //     companyEmail: "hr@fpt.com",
      //     companyPhone: "1111111111111",
      //     websiteUrl: "fpt.com",
      //     taxCode: "111111111",
      //     since: "2026-12-08T17:00:00.000Z",
      //     fieldOperation: "Công nghệ thông tin",
      //     description: "<p>FPT Software là công ty thành viên thuộc Tập đoàn FPT...</p>",
      //     employeeSize: 2,
      //     createAt: "2025-03-04T09:36:20.847Z",
      //     updateAt: "2025-03-27T09:42:35.643Z",
      //     location: {
      //       id: 7,
      //       address: "Nhà hàng Thu Nga, Ngõ 2 Cầu Giấy, Phường Láng Thượng, Quận Đống Đa, Thành phố Hà Nội",
      //       lat: 21.029079628000034,
      //       lng: 105.80247579700006,
      //       createAt: "2025-03-09T04:09:42.051Z",
      //       updateAt: "2025-03-09T04:09:42.051Z",
      //     },
      //   },
      //   user: {
      //     id: 2,
      //     email: "hr@fpt.com",
      //     fullName: "HR FPT",
      //     password: "$2b$10$PV4KEW3r3pVtECWgq4ESoeOBB5o/Bwmw8zbtCJt3FUOg2BQHywrai",
      //     isActive: true,
      //     isVerifyEmail: true,
      //     isSupperuser: false,
      //     isStaff: false,
      //     hasCompany: true,
      //     roleName: "EMPLOYER",
      //     money: 100000,
      //     avatarUrl:
      //       "https://res.cloudinary.com/myjob/image/upload/v1741191417/myjob/avatar/2025/03/2_1741191414195.jpg",
      //     avatarPublicId: "myjob/avatar/2025/03/2_1741191414195",
      //     lastLogin: "2025-03-29T15:04:11.223Z",
      //     createAt: "2025-03-04T09:35:45.878Z",
      //     updateAt: "2025-03-29T15:04:11.327Z",
      //   },
      // }
      const response = await jobService.getJobDetail(id)
      setJobData(response)

      const jobDescriptionBlocks = htmlToDraft(response.jobDescription || "")
      const jobRequirementBlocks = htmlToDraft(response.jobRequirement || "")
      const benefitsBlocks = htmlToDraft(response.benefitsEnjoyed || "")

      setJobDescriptionEditorState(
        EditorState.createWithContent(ContentState.createFromBlockArray(jobDescriptionBlocks.contentBlocks)),
      )
      setJobRequirementEditorState(
        EditorState.createWithContent(ContentState.createFromBlockArray(jobRequirementBlocks.contentBlocks)),
      )
      setBenefitsEditorState(
        EditorState.createWithContent(ContentState.createFromBlockArray(benefitsBlocks.contentBlocks)),
      )

      form.setFieldsValue({
        ...response,
        deadline: response.deadline ? moment(response.deadline) : null,
      })
    } catch (error) {
      message.error("Không thể tải dữ liệu bài đăng tuyển dụng!")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchJobData()
  }, [id])

  const onFinish = async (values) => {
    setLoading(true)
    try {
      const updatedData = {
        ...values,
        deadline: values.deadline ? values.deadline.toISOString() : null,
        jobDescription: draftToHtml(convertToRaw(jobDescriptionEditorState.getCurrentContent())),
        jobRequirement: draftToHtml(convertToRaw(jobRequirementEditorState.getCurrentContent())),
        benefitsEnjoyed: draftToHtml(convertToRaw(benefitsEditorState.getCurrentContent())),
      }

      await jobService.updateJobPost(id, updatedData)
      console.log("Updated job post data:", updatedData)
      message.success("Cập nhật bài đăng tuyển dụng thành công!")
      navigate(`/job-post`)
    } catch (error) {
      message.error("Cập nhật bài đăng tuyển dụng thất bại!")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const editCompany = () => {
    if (jobData?.company?.id) navigate(`/companies/edit/${jobData.company.id}`)
  }

  const editUser = () => {
    if (jobData?.user?.id) navigate(`/users/edit/${jobData.user.id}`)
  }

  // const getPositionLabel = (position) => {
  //   const positions = {
  //     1: "Nhân viên",
  //     2: "Trưởng nhóm",
  //     3: "Quản lý",
  //     4: "Phó giám đốc",
  //     5: "Giám đốc",
  //   }
  //   return positions[position] || "Không xác định"
  // }

  // const getWorkplaceTypeLabel = (type) => {
  //   const types = {
  //     1: "Tại văn phòng",
  //     2: "Làm từ xa",
  //     3: "Hỗn hợp",
  //   }
  //   return types[type] || "Không xác định"
  // }

  // const getAcademicLevelLabel = (level) => {
  //   const levels = {
  //     1: "Trung cấp",
  //     2: "Cao đẳng",
  //     3: "Đại học",
  //     4: "Thạc sĩ",
  //     5: "Tiến sĩ",
  //   }
  //   return levels[level] || "Không xác định"
  // }

  // const getJobTypeLabel = (type) => {
  //   const types = {
  //     1: "Toàn thời gian",
  //     2: "Bán thời gian",
  //     3: "Thực tập",
  //   }
  //   return types[type] || "Không xác định"
  // }

  const getStatusLabel = (status) => {
    const statuses = {
      1: { label: "Chờ duyệt", color: "orange" },
      2: { label: "Đã duyệt", color: "green" },
      3: { label: "Đã đăng", color: "blue" },
      4: { label: "Đã từ chối", color: "red" },
      5: { label: "Đã hết hạn", color: "gray" },
    }
    return statuses[status] || { label: "Không xác định", color: "default" }
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value)
  }

  const steps = [
    {
      title: "Thông tin cơ bản",
      icon: <InfoCircleOutlined />,
    },
    {
      title: "Mô tả chi tiết",
      icon: <FileTextOutlined />,
    },
    {
      title: "Yêu cầu & Quyền lợi",
      icon: <BookOutlined />,
    },
    {
      title: "Thông tin liên hệ",
      icon: <PhoneOutlined />,
    },
  ]

  const nextStep = () => {
    setCurrentStep(currentStep + 1)
  }

  const prevStep = () => {
    setCurrentStep(currentStep - 1)
  }

  if (loading && !jobData) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
        <Spin size="large" tip="Đang tải thông tin bài đăng tuyển dụng..." />
      </div>
    )
  }

  const editorToolbarOptions = {
    options: ["inline", "blockType", "fontSize", "list", "textAlign", "colorPicker", "link", "emoji", "history"],
    inline: { options: ["bold", "italic", "underline"] },
    list: { options: ["unordered", "ordered"] },
    textAlign: { options: ["left", "center", "right"] },
  }

  return (
    <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
      <Card
        className="job-header-card"
        style={{
          marginBottom: 24,
          borderRadius: 8,
          overflow: "hidden",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        }}
      >
        <Row gutter={24} align="middle">
          <Col xs={24} md={6} lg={4}>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Avatar src={jobData?.company?.companyImageUrl} size={100} style={{ border: "1px solid #f0f0f0" }} />
            </div>
          </Col>
          <Col xs={24} md={18} lg={20}>
            <div>
              <Space align="center" style={{ marginBottom: 8 }}>
                <Title level={3} style={{ margin: 0 }}>
                  {jobData?.jobName}
                </Title>
                {jobData?.isHot && (
                  <Tag color="red" icon={<FireOutlined />}>
                    HOT
                  </Tag>
                )}
                {jobData?.isUrgent && (
                  <Tag color="orange" icon={<ClockCircleOutlined />}>
                    URGENT
                  </Tag>
                )}
              </Space>

              <Space wrap style={{ marginBottom: 8 }}>
                <Tag color="blue" icon={<BankOutlined />}>
                  {jobData?.company?.companyName}
                </Tag>
                <Tag color="green" icon={<EnvironmentOutlined />}>
                  {jobData?.company?.location?.address}
                </Tag>
                <Tag color="purple" icon={<DollarOutlined />}>
                  {jobData?.salaryMin && jobData?.salaryMax
                    ? `${formatCurrency(jobData.salaryMin)} - ${formatCurrency(jobData.salaryMax)}`
                    : "Thương lượng"}
                </Tag>
              </Space>

              <div>
                <Space wrap>
                  <Badge
                    status={jobData?.isExpired ? "error" : "success"}
                    text={jobData?.isExpired ? "Đã hết hạn" : "Còn hạn"}
                  />
                  <Badge
                    status={
                      getStatusLabel(jobData?.status).color === "green"
                        ? "success"
                        : getStatusLabel(jobData?.status).color === "red"
                          ? "error"
                          : getStatusLabel(jobData?.status).color === "orange"
                            ? "warning"
                            : "processing"
                    }
                    text={getStatusLabel(jobData?.status).label}
                  />
                  <Text type="secondary">
                    <CalendarOutlined /> Hạn nộp:{" "}
                    {jobData?.deadline ? moment(jobData.deadline).format("DD/MM/YYYY") : "Không giới hạn"}
                  </Text>
                </Space>
              </div>
            </div>
          </Col>
        </Row>
      </Card>

      <Card
        style={{
          marginBottom: 24,
          borderRadius: 8,
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        }}
      >
        <Steps current={currentStep} onChange={setCurrentStep} style={{ marginBottom: 24 }}>
          {steps.map((item) => (
            <Step key={item.title} title={item.title} icon={item.icon} />
          ))}
        </Steps>

        <Form form={form} layout="vertical" onFinish={onFinish} initialValues={jobData} requiredMark="optional">
          <div style={{ display: currentStep === 0 ? "block" : "none" }}>
            <Card title="Thông tin cơ bản" bordered={false} style={{ marginBottom: "24px" }}>
              <Row gutter={24}>
                <Col xs={24} md={16}>
                  <Form.Item
                    label="Tên công việc"
                    name="jobName"
                    rules={[{ required: true, message: "Vui lòng nhập tên công việc!" }]}
                    tooltip="Tên công việc nên ngắn gọn, rõ ràng và hấp dẫn"
                  >
                    <Input placeholder="Nhập tên công việc" prefix={<BuildOutlined />} size="large" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item label="Slug" name="slug" tooltip="Slug được tạo tự động từ tên công việc">
                    <Input placeholder="Slug tự động" disabled />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={24}>
                <Col xs={24} md={8}>
                  <Form.Item
                    label="Hạn chót nộp hồ sơ"
                    name="deadline"
                    tooltip="Ngày cuối cùng ứng viên có thể nộp hồ sơ"
                  >
                    <DatePicker
                      format="DD/MM/YYYY"
                      style={{ width: "100%" }}
                      placeholder="Chọn ngày hết hạn"
                      suffixIcon={<CalendarOutlined />}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item
                    label="Số lượng tuyển"
                    name="quantity"
                    tooltip="Số lượng nhân viên cần tuyển cho vị trí này"
                  >
                    <InputNumber
                      min={1}
                      style={{ width: "100%" }}
                      placeholder="Nhập số lượng"
                      prefix={<TeamOutlined />}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item
                    label="Giới tính yêu cầu"
                    name="genderRequired"
                    tooltip="Yêu cầu về giới tính cho vị trí này"
                  >
                    <Radio.Group buttonStyle="solid">
                      <Radio.Button value="M">Nam</Radio.Button>
                      <Radio.Button value="F">Nữ</Radio.Button>
                      <Radio.Button value="O">Không yêu cầu</Radio.Button>
                    </Radio.Group>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={24}>
                <Col xs={24} md={6}>
                  <Form.Item label="Vị trí" name="position" tooltip="Cấp bậc của vị trí công việc">
                    <Select placeholder="Chọn vị trí" suffixIcon={<BankOutlined />}>
                      <Select.Option value={1}>Nhân viên</Select.Option>
                      <Select.Option value={2}>Trưởng nhóm</Select.Option>
                      <Select.Option value={3}>Quản lý</Select.Option>
                      <Select.Option value={4}>Phó giám đốc</Select.Option>
                      <Select.Option value={5}>Giám đốc</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} md={6}>
                  <Form.Item
                    label="Loại nơi làm việc"
                    name="typeOfWorkplace"
                    tooltip="Hình thức làm việc của vị trí này"
                  >
                    <Select placeholder="Chọn loại nơi làm việc" suffixIcon={<HomeOutlined />}>
                      <Select.Option value={1}>Tại văn phòng</Select.Option>
                      <Select.Option value={2}>Làm từ xa</Select.Option>
                      <Select.Option value={3}>Hỗn hợp</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} md={6}>
                  <Form.Item label="Loại công việc" name="jobType" tooltip="Hình thức làm việc theo thời gian">
                    <Select placeholder="Chọn loại công việc" suffixIcon={<ClockCircleOutlined />}>
                      <Select.Option value={1}>Toàn thời gian</Select.Option>
                      <Select.Option value={2}>Bán thời gian</Select.Option>
                      <Select.Option value={3}>Thực tập</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} md={6}>
                  <Form.Item label="Trình độ học vấn" name="academicLevel" tooltip="Yêu cầu trình độ học vấn tối thiểu">
                    <Select placeholder="Chọn trình độ học vấn" suffixIcon={<BookOutlined />}>
                      <Select.Option value={1}>Trung cấp</Select.Option>
                      <Select.Option value={2}>Cao đẳng</Select.Option>
                      <Select.Option value={3}>Đại học</Select.Option>
                      <Select.Option value={4}>Thạc sĩ</Select.Option>
                      <Select.Option value={5}>Tiến sĩ</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={24}>
                <Col xs={24} md={8}>
                  <Form.Item label="Kinh nghiệm (năm)" name="experience" tooltip="Số năm kinh nghiệm yêu cầu">
                    <InputNumber
                      min={0}
                      style={{ width: "100%" }}
                      placeholder="Nhập số năm kinh nghiệm"
                      addonAfter="năm"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item label="Mức lương tối thiểu" name="salaryMin" tooltip="Mức lương tối thiểu cho vị trí này">
                    <InputNumber
                      min={0}
                      step={1000000}
                      style={{ width: "100%" }}
                      formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                      parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                      prefix={<DollarOutlined />}
                      placeholder="Nhập mức lương tối thiểu"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item label="Mức lương tối đa" name="salaryMax" tooltip="Mức lương tối đa cho vị trí này">
                    <InputNumber
                      min={0}
                      step={1000000}
                      style={{ width: "100%" }}
                      formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                      parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                      prefix={<DollarOutlined />}
                      placeholder="Nhập mức lương tối đa"
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={24}>
                <Col xs={24} md={8}>
                  <Form.Item
                    label="Tin hot"
                    name="isHot"
                    valuePropName="checked"
                    tooltip="Đánh dấu tin tuyển dụng là HOT để được ưu tiên hiển thị"
                  >
                    <Switch
                      checkedChildren={
                        <>
                          <FireOutlined /> Có
                        </>
                      }
                      unCheckedChildren={<>Không</>}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item
                    label="Tin khẩn cấp"
                    name="isUrgent"
                    valuePropName="checked"
                    tooltip="Đánh dấu tin tuyển dụng là khẩn cấp để được ưu tiên hiển thị"
                  >
                    <Switch
                      checkedChildren={
                        <>
                          <ClockCircleOutlined /> Có
                        </>
                      }
                      unCheckedChildren={<>Không</>}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item
                    label="Trạng thái hết hạn"
                    name="isExpired"
                    valuePropName="checked"
                    tooltip="Trạng thái hết hạn của tin tuyển dụng"
                  >
                    <Switch
                      checkedChildren={
                        <>
                          <CloseCircleOutlined /> Đã hết hạn
                        </>
                      }
                      unCheckedChildren={
                        <>
                          <CheckCircleOutlined /> Còn hạn
                        </>
                      }
                      disabled
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </div>

          <div style={{ display: currentStep === 1 ? "block" : "none" }}>
            <Card title="Mô tả công việc" bordered={false} style={{ marginBottom: "24px" }}>
              <Form.Item
                label="Mô tả chi tiết công việc"
                name="jobDescription"
                tooltip="Mô tả chi tiết về công việc, trách nhiệm và nhiệm vụ"
              >
                <div className="rich-editor-container" style={{ border: "1px solid #d9d9d9", borderRadius: "2px" }}>
                  <Editor
                    editorState={jobDescriptionEditorState}
                    onEditorStateChange={setJobDescriptionEditorState}
                    wrapperClassName="editor-wrapper"
                    editorClassName="editor-content"
                    toolbarClassName="editor-toolbar"
                    toolbar={editorToolbarOptions}
                    placeholder="Nhập mô tả chi tiết về công việc..."
                    editorStyle={{
                      height: 200,
                      padding: "0 15px",
                      overflow: "auto",
                    }}
                  />
                </div>
              </Form.Item>
            </Card>
          </div>

          <div style={{ display: currentStep === 2 ? "block" : "none" }}>
            <Card title="Yêu cầu công việc" bordered={false} style={{ marginBottom: "24px" }}>
              <Form.Item
                label="Yêu cầu ứng viên"
                name="jobRequirement"
                tooltip="Các yêu cầu về kỹ năng, kinh nghiệm, bằng cấp, v.v."
              >
                <div className="rich-editor-container" style={{ border: "1px solid #d9d9d9", borderRadius: "2px" }}>
                  <Editor
                    editorState={jobRequirementEditorState}
                    onEditorStateChange={setJobRequirementEditorState}
                    wrapperClassName="editor-wrapper"
                    editorClassName="editor-content"
                    toolbarClassName="editor-toolbar"
                    toolbar={editorToolbarOptions}
                    placeholder="Nhập các yêu cầu đối với ứng viên..."
                    editorStyle={{
                      height: 200,
                      padding: "0 15px",
                      overflow: "auto",
                    }}
                  />
                </div>
              </Form.Item>
            </Card>

            <Card title="Quyền lợi" bordered={false} style={{ marginBottom: "24px" }}>
              <Form.Item
                label="Quyền lợi của ứng viên"
                name="benefitsEnjoyed"
                tooltip="Các quyền lợi, phúc lợi mà ứng viên sẽ được hưởng"
              >
                <div className="rich-editor-container" style={{ border: "1px solid #d9d9d9", borderRadius: "2px" }}>
                  <Editor
                    editorState={benefitsEditorState}
                    onEditorStateChange={setBenefitsEditorState}
                    wrapperClassName="editor-wrapper"
                    editorClassName="editor-content"
                    toolbarClassName="editor-toolbar"
                    toolbar={editorToolbarOptions}
                    placeholder="Nhập các quyền lợi dành cho ứng viên..."
                    editorStyle={{
                      height: 200,
                      padding: "0 15px",
                      overflow: "auto",
                    }}
                  />
                </div>
              </Form.Item>
            </Card>
          </div>

          <div style={{ display: currentStep === 3 ? "block" : "none" }}>
            <Card title="Thông tin liên hệ" bordered={false} style={{ marginBottom: "24px" }}>
              <Row gutter={24}>
                <Col xs={24} md={8}>
                  <Form.Item
                    label="Tên người liên hệ"
                    name="contactPersonName"
                    tooltip="Tên người phụ trách tuyển dụng"
                  >
                    <Input placeholder="Nhập tên người liên hệ" prefix={<UserOutlined />} />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item
                    label="Email người liên hệ"
                    name="contactPersonEmail"
                    tooltip="Email liên hệ cho ứng viên"
                    rules={[{ type: "email", message: "Email không hợp lệ!" }]}
                  >
                    <Input placeholder="Nhập email người liên hệ" prefix={<MailOutlined />} />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item
                    label="Số điện thoại người liên hệ"
                    name="contactPersonPhone"
                    tooltip="Số điện thoại liên hệ cho ứng viên"
                    rules={[{ pattern: /^[0-9]{10,11}$/, message: "Số điện thoại không hợp lệ!" }]}
                  >
                    <Input placeholder="Nhập số điện thoại người liên hệ" prefix={<PhoneOutlined />} />
                  </Form.Item>
                </Col>
              </Row>
            </Card>

            <Card title="Liên kết" bordered={false} style={{ marginBottom: "24px" }}>
              <Row gutter={24}>
                <Col xs={24} md={12}>
                  <Form.Item label="Công ty">
                    <Button
                      type="primary"
                      icon={<BankOutlined />}
                      onClick={editCompany}
                      disabled={!jobData?.company?.id}
                      block
                    >
                      Chỉnh sửa thông tin công ty
                    </Button>
                    <div style={{ marginTop: 8 }}>
                      <Text type="secondary">ID: {jobData?.company?.id}</Text>
                    </div>
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item label="Người đăng">
                    <Button
                      type="primary"
                      icon={<UserOutlined />}
                      onClick={editUser}
                      disabled={!jobData?.user?.id}
                      block
                    >
                      Chỉnh sửa thông tin người dùng
                    </Button>
                    <div style={{ marginTop: 8 }}>
                      <Text type="secondary">ID: {jobData?.user?.id}</Text>
                    </div>
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 24 }}>
            <Button onClick={prevStep} disabled={currentStep === 0} size="large">
              Quay lại
            </Button>
            <Space>
              <Button onClick={() => navigate("/job-posts")} icon={<RollbackOutlined />} size="large">
                Hủy
              </Button>
              {currentStep < steps.length - 1 ? (
                <Button type="primary" onClick={nextStep} size="large">
                  Tiếp theo
                </Button>
              ) : (
                <Button type="primary" htmlType="submit" loading={loading} icon={<SaveOutlined />} size="large">
                  Lưu thay đổi
                </Button>
              )}
            </Space>
          </div>
        </Form>
      </Card>

      <style jsx global>{`
                .editor-wrapper {
                    width: 100%;
                }
                .editor-toolbar {
                    background-color: #f9f9f9;
                    border-bottom: 1px solid #d9d9d9;
                    padding: 6px;
                }
                .editor-content {
                    min-height: 200px;
                    padding: 10px;
                }
                .rdw-option-wrapper {
                    border: 1px solid #F1F1F1;
                    padding: 5px;
                    min-width: 25px;
                    height: 20px;
                    border-radius: 2px;
                    margin: 0 4px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    cursor: pointer;
                    background: white;
                    text-transform: capitalize;
                }
                .rdw-option-active {
                    background: #f1f1f1;
                }
            `}</style>
    </div>
  )
}

export default EditJobPost

