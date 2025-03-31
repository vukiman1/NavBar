import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Input, Button, Spin, message, Upload, DatePicker, Radio, Switch } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import moment from "moment";

const EditUser = () => {
    const { id } = useParams(); // Lấy id từ URL
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [userData, setUserData] = useState(null);
    const [avatarFileList, setAvatarFileList] = useState([]);

    // Giả lập API call để lấy dữ liệu user
    const fetchUserData = async () => {
        setLoading(true);
        try {
            // Thay bằng API thực tế của bạn, ví dụ: await userService.getUserById(id)
            const response = {
                "id": 28,
                "email": "anvuit734@gmail.com",
                "fullName": "An Vũ",
                "password": "$2b$10$r9g5k9PqwNTKfGdUXDBiXOEYgyX1neI7NAl5IXchmWzeUey0am.su",
                "isActive": true,
                "isVerifyEmail": true,
                "isSupperuser": false,
                "isStaff": false,
                "hasCompany": false,
                "roleName": "JOB_SEEKER",
                "money": 0,
                "avatarUrl": "https://lh3.googleusercontent.com/a/ACg8ocLeiHaBgqwGV3Yq6EPBTxy72-gHHxWAwsYEkk-sffR6PWnKa6x8=s96-c",
                "avatarPublicId": null,
                "lastLogin": "2025-03-27T07:53:14.387Z",
                "createAt": "2025-03-27T07:53:14.833Z",
                "updateAt": "2025-03-27T07:53:14.833Z",
                "jobSeekerProfile": {
                    "id": 15,
                    "phone": "0385849615",
                    "birthday": "2002-01-31T10:00:00.000Z",
                    "gender": "M",
                    "maritalStatus": "S",
                    "createdAt": "2025-03-27T07:53:15.573Z",
                    "updatedAt": "2025-03-27T07:57:22.060Z"
                },
                "company": null
            };
            setUserData(response);
            form.setFieldsValue({
                ...response,
                birthday: response.jobSeekerProfile?.birthday ? moment(response.jobSeekerProfile.birthday) : null,
            });
            setAvatarFileList(response.avatarUrl ? [{
                uid: '-1',
                name: 'avatar',
                status: 'done',
                url: response.avatarUrl,
            }] : []);
        } catch (error) {
            message.error("Không thể tải dữ liệu user!");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, [id]);

    // Xử lý submit form
    const onFinish = async (values) => {
        setLoading(true);
        try {
            const updatedData = {
                ...values,
                birthday: values.birthday ? values.birthday.toISOString() : null,
            };
            // Thay bằng API thực tế của bạn, ví dụ: await userService.updateUser(id, updatedData)
            console.log("Updated user data:", updatedData);
            message.success("Cập nhật user thành công!");
            navigate("/users"); // Quay lại danh sách user
        } catch (error) {
            message.error("Cập nhật user thất bại!");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // Xử lý upload avatar
    const handleAvatarUpload = ({ fileList }) => {
        setAvatarFileList(fileList);
        if (fileList.length > 0 && fileList[0].status === "done") {
            form.setFieldsValue({ avatarUrl: fileList[0].url });
        }
    };

    // Chuyển hướng đến trang edit company
    const editCompany = () => {
        if (userData?.company?.id) {
            navigate(`/companies/edit/${userData.company.id}`);
        }
    };

    // Chuyển hướng đến trang edit job seeker profile
    const editJobSeekerProfile = () => {
        if (userData?.jobSeekerProfile?.id) {
            navigate(`/job-seeker-profiles/edit/${userData.jobSeekerProfile.id}`);
        }
    };

    return (
        <div style={{ padding: "0 16px" }}>
            <h2>Chỉnh sửa thông tin người dùng</h2>
            {loading && !userData ? (
                <Spin tip="Đang tải dữ liệu..." />
            ) : (
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    initialValues={userData}
                >
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[{ required: true, message: "Vui lòng nhập email!", type: "email" }]}
                    >
                        <Input placeholder="Nhập email" />
                    </Form.Item>

                    <Form.Item
                        label="Họ và tên"
                        name="fullName"
                        rules={[{ required: true, message: "Vui lòng nhập họ và tên!" }]}
                    >
                        <Input placeholder="Nhập họ và tên" />
                    </Form.Item>

                    <Form.Item label="Avatar" name="avatarUrl">
                        <Upload
                            listType="picture"
                            fileList={avatarFileList}
                            onChange={handleAvatarUpload}
                            maxCount={1}
                        >
                            <Button icon={<UploadOutlined />}>Tải avatar lên</Button>
                        </Upload>
                    </Form.Item>

                    <Form.Item label="Vai trò" name="roleName">
                        <Radio.Group disabled>
                            <Radio value="JOB_SEEKER">Ứng viên</Radio>
                            <Radio value="EMPLOYER">Nhà tuyển dụng</Radio>
                        </Radio.Group>
                    </Form.Item>

                    <Form.Item label="Trạng thái hoạt động" name="isActive" valuePropName="checked">
                        <Switch checkedChildren="Bật" unCheckedChildren="Tắt" />
                    </Form.Item>

                    <Form.Item label="Xác thực email" name="isVerifyEmail" valuePropName="checked">
                        <Switch checkedChildren="Đã xác thực" unCheckedChildren="Chưa xác thực" disabled />
                    </Form.Item>

                    <Form.Item label="Số tiền" name="money">
                        <Input type="number" placeholder="Nhập số tiền" disabled />
                    </Form.Item>

                    {/* Thông tin ứng viên */}
                    {userData?.roleName === "JOB_SEEKER" && (
                        <>
                            <Form.Item label="Số điện thoại" name={["jobSeekerProfile", "phone"]}>
                                <Input placeholder="Nhập số điện thoại" />
                            </Form.Item>

                            <Form.Item label="Ngày sinh" name="birthday">
                                <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
                            </Form.Item>

                            <Form.Item label="Giới tính" name={["jobSeekerProfile", "gender"]}>
                                <Radio.Group>
                                    <Radio value="M">Nam</Radio>
                                    <Radio value="F">Nữ</Radio>
                                </Radio.Group>
                            </Form.Item>

                            <Form.Item label="Tình trạng hôn nhân" name={["jobSeekerProfile", "maritalStatus"]}>
                                <Radio.Group>
                                    <Radio value="S">Độc thân</Radio>
                                    <Radio value="M">Đã kết hôn</Radio>
                                </Radio.Group>
                            </Form.Item>

                            <Form.Item label="Hồ sơ ứng viên">
                                <Button onClick={editJobSeekerProfile} disabled={!userData?.jobSeekerProfile?.id}>
                                    Chỉnh sửa hồ sơ ứng viên (ID: {userData?.jobSeekerProfile?.id})
                                </Button>
                            </Form.Item>
                        </>
                    )}

                    {/* Thông tin nhà tuyển dụng */}
                    {userData?.roleName === "EMPLOYER" && (
                        <Form.Item label="Công ty">
                            <Button onClick={editCompany} disabled={!userData?.company?.id}>
                                Chỉnh sửa thông tin công ty (ID: {userData?.company?.id || "Chưa có"})
                            </Button>
                        </Form.Item>
                    )}

                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading}>
                            Lưu thay đổi
                        </Button>
                        <Button style={{ marginLeft: 8 }} onClick={() => navigate("/users")}>
                            Hủy
                        </Button>
                    </Form.Item>
                </Form>
            )}
        </div>
    );
};

export default EditUser;