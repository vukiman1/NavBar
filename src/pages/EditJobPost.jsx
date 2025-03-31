import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Input, Button, Spin, message, DatePicker, Radio, Switch, Select, InputNumber, Card, Divider, Row, Col } from "antd";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, ContentState, convertToRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import moment from "moment";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "./EditJobPost.css"; // Thêm file CSS tùy chỉnh

function EditJobPost() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [jobData, setJobData] = useState(null);
    const [jobDescriptionEditorState, setJobDescriptionEditorState] = useState(EditorState.createEmpty());
    const [jobRequirementEditorState, setJobRequirementEditorState] = useState(EditorState.createEmpty());
    const [benefitsEditorState, setBenefitsEditorState] = useState(EditorState.createEmpty());

    const fetchJobData = async () => {
        setLoading(true);
        try {
            const response = {
                "id": 2,
                "jobName": "Lead Data Engineer",
                "slug": "lead-data-engineer",
                "deadline": "2025-03-24T17:00:00.000Z",
                "quantity": 1,
                "genderRequired": "O",
                "jobDescription": "<p><strong>About us</strong><br>A subsidiary of the FPT Group...</p>",
                "jobRequirement": "<ul>\n<li>Bachelor’s or Master’s degree in Computer Science...</li>\n</ul>",
                "benefitsEnjoyed": "<ul>\n<li>Attractive Salary Package...</li>\n</ul>",
                "position": 5,
                "typeOfWorkplace": 1,
                "experience": 8,
                "academicLevel": 2,
                "jobType": 1,
                "salaryMin": 40000000,
                "salaryMax": 60000000,
                "isHot": false,
                "isUrgent": true,
                "isExpired": true,
                "contactPersonName": "Do Thi Phuong",
                "contactPersonEmail": "phuong@gmail.com",
                "contactPersonPhone": "0963258741",
                "views": 0,
                "shares": 0,
                "status": 3,
                "createAt": "2025-03-09T11:05:29.701Z",
                "updateAt": "2025-03-25T16:22:50.051Z",
                "company": {
                    "id": 1,
                    "companyName": "Công ty TNHH Phần mềm FPT",
                    "slug": "cong-ty-tnhh-phan-mem-fpt-1",
                    "companyImageUrl": "https://res.cloudinary.com/myjob/image/upload/v1742112694/myjob/companyAvatar/2025/03/cong-ty-tnhh-phan-mem-fpt_1742112690939.png",
                    "companyImagePublicId": "myjob/companyAvatar/2025/03/cong-ty-tnhh-phan-mem-fpt_1742112690939",
                    "companyCoverImageUrl": "https://res.cloudinary.com/myjob/image/upload/v1743093753/myjob/companyCover/2025/03/cong-ty-tnhh-phan-mem-fpt-1_1743093751439.png",
                    "companyCoverImagePublicId": "myjob/companyCover/2025/03/cong-ty-tnhh-phan-mem-fpt-1_1743093751439",
                    "facebookUrl": "http://example.com",
                    "youtubeUrl": "http://example.com",
                    "linkedinUrl": "http://example.com",
                    "companyEmail": "hr@fpt.com",
                    "companyPhone": "1111111111111",
                    "websiteUrl": "fpt.com",
                    "taxCode": "111111111",
                    "since": "2026-12-08T17:00:00.000Z",
                    "fieldOperation": "Công nghệ thông tin",
                    "description": "<p>FPT Software là công ty thành viên thuộc Tập đoàn FPT...</p>",
                    "employeeSize": 2,
                    "createAt": "2025-03-04T09:36:20.847Z",
                    "updateAt": "2025-03-27T09:42:35.643Z",
                    "location": {
                        "id": 7,
                        "address": "Nhà hàng Thu Nga, Ngõ 2 Cầu Giấy, Phường Láng Thượng, Quận Đống Đa, Thành phố Hà Nội",
                        "lat": 21.029079628000034,
                        "lng": 105.80247579700006,
                        "createAt": "2025-03-09T04:09:42.051Z",
                        "updateAt": "2025-03-09T04:09:42.051Z"
                    }
                },
                "user": {
                    "id": 2,
                    "email": "hr@fpt.com",
                    "fullName": "HR FPT",
                    "password": "$2b$10$PV4KEW3r3pVtECWgq4ESoeOBB5o/Bwmw8zbtCJt3FUOg2BQHywrai",
                    "isActive": true,
                    "isVerifyEmail": true,
                    "isSupperuser": false,
                    "isStaff": false,
                    "hasCompany": true,
                    "roleName": "EMPLOYER",
                    "money": 100000,
                    "avatarUrl": "https://res.cloudinary.com/myjob/image/upload/v1741191417/myjob/avatar/2025/03/2_1741191414195.jpg",
                    "avatarPublicId": "myjob/avatar/2025/03/2_1741191414195",
                    "lastLogin": "2025-03-29T15:04:11.223Z",
                    "createAt": "2025-03-04T09:35:45.878Z",
                    "updateAt": "2025-03-29T15:04:11.327Z"
                }
            }
            setJobData(response);

            const jobDescriptionBlocks = htmlToDraft(response.jobDescription || "");
            const jobRequirementBlocks = htmlToDraft(response.jobRequirement || "");
            const benefitsBlocks = htmlToDraft(response.benefitsEnjoyed || "");

            setJobDescriptionEditorState(
                EditorState.createWithContent(ContentState.createFromBlockArray(jobDescriptionBlocks.contentBlocks))
            );
            setJobRequirementEditorState(
                EditorState.createWithContent(ContentState.createFromBlockArray(jobRequirementBlocks.contentBlocks))
            );
            setBenefitsEditorState(
                EditorState.createWithContent(ContentState.createFromBlockArray(benefitsBlocks.contentBlocks))
            );

            form.setFieldsValue({
                ...response,
                deadline: response.deadline ? moment(response.deadline) : null,
            });
        } catch (error) {
            message.error("Không thể tải dữ liệu bài đăng tuyển dụng!");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobData();
    }, [id]);

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const updatedData = {
                ...values,
                deadline: values.deadline ? values.deadline.toISOString() : null,
                jobDescription: draftToHtml(convertToRaw(jobDescriptionEditorState.getCurrentContent())),
                jobRequirement: draftToHtml(convertToRaw(jobRequirementEditorState.getCurrentContent())),
                benefitsEnjoyed: draftToHtml(convertToRaw(benefitsEditorState.getCurrentContent())),
            };
            console.log("Updated job post data:", updatedData);
            message.success("Cập nhật bài đăng tuyển dụng thành công!");
            navigate("/job-posts");
        } catch (error) {
            message.error("Cập nhật bài đăng tuyển dụng thất bại!");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const editCompany = () => {
        if (jobData?.company?.id) navigate(`/companies/edit/${jobData.company.id}`);
    };

    const editUser = () => {
        if (jobData?.user?.id) navigate(`/users/edit/${jobData.user.id}`);
    };

    return (
        <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
            <h2 style={{ marginBottom: "24px" }}>Chỉnh sửa bài đăng tuyển dụng</h2>
            {loading && !jobData ? (
                <Spin tip="Đang tải dữ liệu..." />
            ) : (
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    initialValues={jobData}
                >
                    <Card title="Thông tin cơ bản" style={{ marginBottom: "24px" }}>
                        <Row gutter={16}>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    label="Tên công việc"
                                    name="jobName"
                                    rules={[{ required: true, message: "Vui lòng nhập tên công việc!" }]}
                                >
                                    <Input placeholder="Nhập tên công việc" />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12}>
                                <Form.Item label="Slug" name="slug">
                                    <Input placeholder="Nhập slug" disabled />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col xs={24} md={8}>
                                <Form.Item label="Hạn chót" name="deadline">
                                    <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={8}>
                                <Form.Item label="Số lượng tuyển" name="quantity">
                                    <InputNumber min={1} style={{ width: "100%" }} />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={8}>
                                <Form.Item label="Giới tính yêu cầu" name="genderRequired">
                                    <Radio.Group>
                                        <Radio value="M">Nam</Radio>
                                        <Radio value="F">Nữ</Radio>
                                        <Radio value="O">Không yêu cầu</Radio>
                                    </Radio.Group>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Card>

                    <Card title="Chi tiết công việc" style={{ marginBottom: "24px" }}>
                        <Form.Item label="Mô tả công việc" name="jobDescription">
                            <Editor
                                editorState={jobDescriptionEditorState}
                                onEditorStateChange={setJobDescriptionEditorState}
                                wrapperClassName="editor-wrapper"
                                editorClassName="editor-content"
                                toolbarClassName="editor-toolbar"
                            />
                        </Form.Item>
                        <Divider />
                        <Form.Item label="Yêu cầu công việc" name="jobRequirement">
                            <Editor
                                editorState={jobRequirementEditorState}
                                onEditorStateChange={setJobRequirementEditorState}
                                wrapperClassName="editor-wrapper"
                                editorClassName="editor-content"
                                toolbarClassName="editor-toolbar"
                            />
                        </Form.Item>
                        <Divider />
                        <Form.Item label="Quyền lợi" name="benefitsEnjoyed">
                            <Editor
                                editorState={benefitsEditorState}
                                onEditorStateChange={setBenefitsEditorState}
                                wrapperClassName="editor-wrapper"
                                editorClassName="editor-content"
                                toolbarClassName="editor-toolbar"
                            />
                        </Form.Item>
                    </Card>

                    <Card title="Yêu cầu và điều kiện" style={{ marginBottom: "24px" }}>
                        <Row gutter={16}>
                            <Col xs={24} md={6}>
                                <Form.Item label="Vị trí" name="position">
                                    <Select placeholder="Chọn vị trí">
                                        <Select.Option value={1}>Nhân viên</Select.Option>
                                        <Select.Option value={2}>Trưởng nhóm</Select.Option>
                                        <Select.Option value={3}>Quản lý</Select.Option>
                                        <Select.Option value={4}>Phó giám đốc</Select.Option>
                                        <Select.Option value={5}>Giám đốc</Select.Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={6}>
                                <Form.Item label="Loại nơi làm việc" name="typeOfWorkplace">
                                    <Select placeholder="Chọn loại nơi làm việc">
                                        <Select.Option value={1}>Tại văn phòng</Select.Option>
                                        <Select.Option value={2}>Làm từ xa</Select.Option>
                                        <Select.Option value={3}>Hỗn hợp</Select.Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={6}>
                                <Form.Item label="Kinh nghiệm (năm)" name="experience">
                                    <InputNumber min={0} style={{ width: "100%" }} />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={6}>
                                <Form.Item label="Trình độ học vấn" name="academicLevel">
                                    <Select placeholder="Chọn trình độ học vấn">
                                        <Select.Option value={1}>Trung cấp</Select.Option>
                                        <Select.Option value={2}>Cao đẳng</Select.Option>
                                        <Select.Option value={3}>Đại học</Select.Option>
                                        <Select.Option value={4}>Thạc sĩ</Select.Option>
                                        <Select.Option value={5}>Tiến sĩ</Select.Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col xs={24} md={6}>
                                <Form.Item label="Loại công việc" name="jobType">
                                    <Select placeholder="Chọn loại công việc">
                                        <Select.Option value={1}>Toàn thời gian</Select.Option>
                                        <Select.Option value={2}>Bán thời gian</Select.Option>
                                        <Select.Option value={3}>Thực tập</Select.Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={9}>
                                <Form.Item label="Mức lương tối thiểu" name="salaryMin">
                                    <InputNumber min={0} step={1000000} style={{ width: "100%" }} formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={9}>
                                <Form.Item label="Mức lương tối đa" name="salaryMax">
                                    <InputNumber min={0} step={1000000} style={{ width: "100%" }} formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col xs={24} md={8}>
                                <Form.Item label="Tin hot" name="isHot" valuePropName="checked">
                                    <Switch checkedChildren="Có" unCheckedChildren="Không" />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={8}>
                                <Form.Item label="Tin khẩn cấp" name="isUrgent" valuePropName="checked">
                                    <Switch checkedChildren="Có" unCheckedChildren="Không" />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={8}>
                                <Form.Item label="Hết hạn" name="isExpired" valuePropName="checked">
                                    <Switch checkedChildren="Có" unCheckedChildren="Không" disabled />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Card>

                    <Card title="Thông tin liên hệ" style={{ marginBottom: "24px" }}>
                        <Row gutter={16}>
                            <Col xs={24} md={8}>
                                <Form.Item label="Tên người liên hệ" name="contactPersonName">
                                    <Input placeholder="Nhập tên người liên hệ" />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={8}>
                                <Form.Item label="Email người liên hệ" name="contactPersonEmail">
                                    <Input placeholder="Nhập email người liên hệ" />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={8}>
                                <Form.Item label="Số điện thoại người liên hệ" name="contactPersonPhone">
                                    <Input placeholder="Nhập số điện thoại người liên hệ" />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Card>

                    <Card title="Liên kết" style={{ marginBottom: "24px" }}>
                        <Row gutter={16}>
                            <Col xs={24} md={12}>
                                <Form.Item label="Công ty">
                                    <Button onClick={editCompany} disabled={!jobData?.company?.id}>
                                        Chỉnh sửa thông tin công ty (ID: {jobData?.company?.id})
                                    </Button>
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12}>
                                <Form.Item label="Người đăng">
                                    <Button onClick={editUser} disabled={!jobData?.user?.id}>
                                        Chỉnh sửa thông tin người dùng (ID: {jobData?.user?.id})
                                    </Button>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Card>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading} size="large">
                            Lưu thay đổi
                        </Button>
                        <Button size="large" style={{ marginLeft: 8 }} onClick={() => navigate("/job-posts")}>
                            Hủy
                        </Button>
                    </Form.Item>
                </Form>
            )}
        </div>
    );
}

export default EditJobPost;