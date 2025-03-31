import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Input, Button, Spin, message, Upload, DatePicker } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import moment from "moment";

function EditCompany() {
    const { id } = useParams(); // Lấy id từ URL
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [companyData, setCompanyData] = useState(null);
    const [fileList, setFileList] = useState([]);
    const [coverFileList, setCoverFileList] = useState([]);

    // Giả lập API call để lấy dữ liệu công ty
    const fetchCompanyData = async () => {
        setLoading(true);
        try {
            // Thay bằng API thực tế của bạn, ví dụ: await companyService.getCompanyById(id)
            const response = {
                "id": 4,
                "companyName": "CÔNG TY TNHH NASHTECH VIỆT NAM",
                "slug": "cong-ty-tnhh-nashtech-viet-nam",
                "companyImageUrl": "https://cdn.timviectop.com/img/2022-07-13/62cf3cb433c609921371f335.png",
                "companyImagePublicId": null,
                "companyCoverImageUrl": "https://cdn1.vieclam24h.vn/tvn/images/assets/img/generic_18.jpg",
                "companyCoverImagePublicId": null,
                "facebookUrl": null,
                "youtubeUrl": null,
                "linkedinUrl": null,
                "companyEmail": "nashtech@gmail.com",
                "companyPhone": "0213562425",
                "websiteUrl": "https://nashtechglobal.com",
                "taxCode": "0301483946 ",
                "since": "2017-01-01T17:00:00.000Z",
                "fieldOperation": "Công nghệ thông tin ",
                "description": null,
                "employeeSize": 6,
                "createAt": "2025-03-16T10:19:26.972Z",
                "updateAt": "2025-03-16T10:19:26.972Z",
                "location": {
                    "id": 17,
                    "address": "Quận 1, Thành phố Hồ Chí Minh",
                    "lat": null,
                    "lng": null,
                    "createAt": "2025-03-16T10:19:23.550Z",
                    "updateAt": "2025-03-16T10:19:23.550Z",
                    "city": {
                        "id": 30,
                        "name": "TP.Hồ Chí Minh",
                        "createAt": "2025-03-04T08:22:31.657Z",
                        "updateAt": "2025-03-04T08:22:31.657Z"
                    }
                },
                "user": {
                    "id": 16,
                    "email": "hr@nashtech.com",
                    "fullName": "NashTech",
                    "password": "$2b$10$yRHs68qDHeSU6XRSBwVLIOGtKuNjgAe/kDWjzaoHp1ZGg4I1ziqcu",
                    "isActive": true,
                    "isVerifyEmail": true,
                    "isSupperuser": false,
                    "isStaff": false,
                    "hasCompany": true,
                    "roleName": "EMPLOYER",
                    "money": 0,
                    "avatarUrl": "https://res.cloudinary.com/myjob/image/upload/c_scale,h_200,w_200/myjob/Avatar/defaultAvatar.jpg",
                    "avatarPublicId": null,
                    "lastLogin": "2025-03-16T10:19:50.583Z",
                    "createAt": "2025-03-16T10:19:23.531Z",
                    "updateAt": "2025-03-16T10:19:50.587Z"
                }
            };
            setCompanyData(response);
            form.setFieldsValue({
                ...response,
                since: response.since ? moment(response.since) : null, // Chuyển đổi ngày sang moment
            });
            setFileList(response.companyImageUrl ? [{
                uid: '-1',
                name: 'companyImage',
                status: 'done',
                url: response.companyImageUrl,
            }] : []);
            setCoverFileList(response.companyCoverImageUrl ? [{
                uid: '-1',
                name: 'companyCoverImage',
                status: 'done',
                url: response.companyCoverImageUrl,
            }] : []);
        } catch (error) {
            message.error("Không thể tải dữ liệu công ty!");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCompanyData();
    }, [id]);

    // Xử lý submit form
    const onFinish = async (values) => {
        setLoading(true);
        try {
            const updatedData = {
                ...values,
                since: values.since ? values.since.toISOString() : null,
            };
            // Thay bằng API thực tế của bạn, ví dụ: await companyService.updateCompany(id, updatedData)
            console.log("Updated company data:", updatedData);
            message.success("Cập nhật công ty thành công!");
            navigate("/companies"); // Quay lại danh sách công ty
        } catch (error) {
            message.error("Cập nhật công ty thất bại!");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // Xử lý upload ảnh công ty
    const handleCompanyImageUpload = ({ fileList }) => {
        setFileList(fileList);
        if (fileList.length > 0 && fileList[0].status === "done") {
            form.setFieldsValue({ companyImageUrl: fileList[0].url });
        }
    };

    // Xử lý upload ảnh bìa
    const handleCoverImageUpload = ({ fileList }) => {
        setCoverFileList(fileList);
        if (fileList.length > 0 && fileList[0].status === "done") {
            form.setFieldsValue({ companyCoverImageUrl: fileList[0].url });
        }
    };

    // Chuyển hướng đến trang edit user
    const editUser = () => {
        if (companyData?.user?.id) {
            navigate(`/users/edit/${companyData.user.id}`);
        }
    };

    // Chuyển hướng đến trang edit location
    const editLocation = () => {
        if (companyData?.location?.id) {
            navigate(`/locations/edit/${companyData.location.id}`);
        }
    };

    return (
        <div style={{ padding: "0 16px" }}>
            <h2>Chỉnh sửa thông tin công ty</h2>
            {loading && !companyData ? (
                <Spin tip="Đang tải dữ liệu..." />
            ) : (
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    initialValues={companyData}
                >
                    <Form.Item
                        label="Tên công ty"
                        name="companyName"
                        rules={[{ required: true, message: "Vui lòng nhập tên công ty!" }]}
                    >
                        <Input placeholder="Nhập tên công ty" />
                    </Form.Item>

                    <Form.Item label="Slug" name="slug">
                        <Input placeholder="Nhập slug" disabled />
                    </Form.Item>

                    <Form.Item label="Ảnh công ty" name="companyImageUrl">
                        <Upload
                            listType="picture"
                            fileList={fileList}
                            onChange={handleCompanyImageUpload}
                            maxCount={1}
                        >
                            <Button icon={<UploadOutlined />}>Tải ảnh lên</Button>
                        </Upload>
                    </Form.Item>

                    <Form.Item label="Ảnh bìa công ty" name="companyCoverImageUrl">
                        <Upload
                            listType="picture"
                            fileList={coverFileList}
                            onChange={handleCoverImageUpload}
                            maxCount={1}
                        >
                            <Button icon={<UploadOutlined />}>Tải ảnh lên</Button>
                        </Upload>
                    </Form.Item>

                    <Form.Item label="Email công ty" name="companyEmail">
                        <Input placeholder="Nhập email công ty" />
                    </Form.Item>

                    <Form.Item label="Số điện thoại" name="companyPhone">
                        <Input placeholder="Nhập số điện thoại" />
                    </Form.Item>

                    <Form.Item label="Website" name="websiteUrl">
                        <Input placeholder="Nhập URL website" />
                    </Form.Item>

                    <Form.Item label="Mã số thuế" name="taxCode">
                        <Input placeholder="Nhập mã số thuế" />
                    </Form.Item>

                    <Form.Item label="Ngày thành lập" name="since">
                        <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
                    </Form.Item>

                    <Form.Item label="Lĩnh vực hoạt động" name="fieldOperation">
                        <Input placeholder="Nhập lĩnh vực hoạt động" />
                    </Form.Item>

                    <Form.Item label="Mô tả" name="description">
                        <Input.TextArea rows={4} placeholder="Nhập mô tả công ty" />
                    </Form.Item>

                    <Form.Item label="Số lượng nhân viên" name="employeeSize">
                        <Input type="number" placeholder="Nhập số lượng nhân viên" />
                    </Form.Item>

                    <Form.Item label="Facebook URL" name="facebookUrl">
                        <Input placeholder="Nhập URL Facebook" />
                    </Form.Item>

                    <Form.Item label="YouTube URL" name="youtubeUrl">
                        <Input placeholder="Nhập URL YouTube" />
                    </Form.Item>

                    <Form.Item label="LinkedIn URL" name="linkedinUrl">
                        <Input placeholder="Nhập URL LinkedIn" />
                    </Form.Item>

                    <Form.Item label="Người dùng">
                        <Button onClick={editUser} disabled={!companyData?.user?.id}>
                            Chỉnh sửa thông tin người dùng (ID: {companyData?.user?.id})
                        </Button>
                    </Form.Item>

                    <Form.Item label="Địa điểm">
                        <Button onClick={editLocation} disabled={!companyData?.location?.id}>
                            Chỉnh sửa thông tin địa điểm (ID: {companyData?.location?.id})
                        </Button>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading}>
                            Lưu thay đổi
                        </Button>
                        <Button style={{ marginLeft: 8 }} onClick={() => navigate("/companies")}>
                            Hủy
                        </Button>
                    </Form.Item>
                </Form>
            )}
        </div>
    );
}

export default EditCompany;