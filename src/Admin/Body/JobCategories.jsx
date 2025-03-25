import { useState, useEffect } from "react";
import {
    message, Table, Space, Avatar, Button, Tooltip, Modal, Form, Input, Upload
} from "antd";
import {
    EditOutlined, DeleteOutlined, FireOutlined, PlusOutlined, ExclamationCircleOutlined, UploadOutlined
} from "@ant-design/icons";
import { Flex, Tag, Typography } from "antd";
import jobService from "../../services/jobService";

const { Title } = Typography;
const { confirm } = Modal;

function JobCategories() {
    const [jobCategories, setJobCategories] = useState([]);
    const [tableLoading, setTableLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [fileList, setFileList] = useState([]);
    const [form] = Form.useForm();

    // Load danh sách ngành nghề
    const loadJobCategories = async () => {
        setTableLoading(true);
        try {
            const resData = await jobService.getAllJobCategories();
            setJobCategories(resData);
        } catch (error) {
            console.error("Error fetching job categories:", error);
            message.error("Không thể tải danh sách job categories");
        } finally {
            setTableLoading(false);
        }
    };

    useEffect(() => {
        loadJobCategories();
    }, []);

    // Mở modal thêm/sửa
    const openModal = (category = null) => {
        setEditingCategory(category);
        setModalVisible(true);
        form.setFieldsValue(category || { name: "", iconUrl: "" });
        setPreviewImage(category?.iconUrl || null);
        setFileList([]);
    };

    // Đóng modal
    const closeModal = () => {
        setModalVisible(false);
        form.resetFields();
        setPreviewImage(null);
        setFileList([]);
    };

    // Xử lý upload ảnh
    const handleUploadChange = ({ fileList }) => {
        setFileList(fileList);
        if (fileList.length > 0) {
            const file = fileList[0].originFileObj;
            const reader = new FileReader();
            reader.onload = () => setPreviewImage(reader.result);
            reader.readAsDataURL(file);
        } else {
            setPreviewImage(null);
        }
    };

    // Upload ảnh lên backend
    const uploadImageToServer = async (file) => {
        const formData = new FormData();
        formData.append("image", file);
        try {
            const response = await jobService.uploadJobCategoryImage(formData);
            return response.imageUrl; // Backend trả về URL của ảnh
        } catch (error) {
            console.error("Error uploading image:", error);
            message.error("Tải ảnh lên thất bại!");
            return null;
        }
    };

    // Xử lý lưu (Thêm/Sửa)
    const handleSave = async () => {
        try {
            const values = await form.validateFields();
            let imageUrl = previewImage;

            if (fileList.length > 0) {
                const file = fileList[0].originFileObj;
                imageUrl = await uploadImageToServer(file);
                if (!imageUrl) return;
            }

            const payload = { ...values, iconUrl: imageUrl };

            if (editingCategory) {
                await jobService.updateJobCategory(editingCategory.id, payload);
                message.success("Cập nhật ngành nghề thành công!");
            } else {
                await jobService.createJobCategory(payload);
                message.success("Thêm ngành nghề mới thành công!");
            }

            closeModal();
            loadJobCategories();
        } catch (error) {
            console.error("Error saving job category:", error);
            message.error("Lưu thất bại!");
        }
    };

    // Xác nhận xoá
    const confirmDelete = (id) => {
        confirm({
            title: "Bạn có chắc chắn muốn xoá?",
            icon: <ExclamationCircleOutlined />,
            content: "Hành động này không thể hoàn tác!",
            okText: "Xoá",
            okType: "danger",
            cancelText: "Hủy",
            async onOk() {
                try {
                    await jobService.deleteJobCategory(id);
                    message.success("Xoá thành công!");
                    loadJobCategories();
                } catch (error) {
                    console.error("Error deleting job category:", error);
                    message.error("Xoá thất bại!");
                }
            },
        });
    };

    // Cấu hình cột Table
    const columns = [
        { title: "ID", dataIndex: "id", key: "id" },
        {
            title: "Hình ảnh",
            dataIndex: "iconUrl",
            key: "iconUrl",
            render: (iconUrl) => <Avatar shape="square" size={64} src={iconUrl} />,
        },
        { title: "Tên", dataIndex: "name", key: "name" },
        { title: "Tạo vào", dataIndex: "createAt", key: "createAt" },
        { title: "Cập nhật vào", dataIndex: "updateAt", key: "updateAt" },
        {
            title: "Hành động",
            key: "action",
            render: (_, record) => (
                <Space size="middle">
                    <Tooltip title="Chỉnh sửa">
                        <Button icon={<EditOutlined />} type="link" onClick={() => openModal(record)} />
                    </Tooltip>
                    <Tooltip title="Xóa">
                        <Button icon={<DeleteOutlined />} type="link" danger onClick={() => confirmDelete(record.id)} />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <div>
            {/* Header */}
            <Flex align="center" justify="space-between">
                <Flex align="center" gap="small">
                    <Title level={4} style={{ margin: 0 }}>Quản lý Ngành nghề</Title>
                    <Tag color="blue" icon={<FireOutlined />}>
                        {jobCategories?.length || 0} ngành nghề
                    </Tag>
                </Flex>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal()}>
                    Thêm ngành nghề mới
                </Button>
            </Flex>

            {/* Bảng dữ liệu */}
            <Table loading={tableLoading} dataSource={jobCategories} columns={columns} rowKey="id" />

            {/* Modal Thêm/Sửa */}
            <Modal
                title={editingCategory ? "Chỉnh sửa ngành nghề" : "Thêm ngành nghề mới"}
                open={modalVisible}
                onCancel={closeModal}
                onOk={handleSave}
                okText="Lưu"
                cancelText="Hủy"
            >
                <Form form={form} layout="vertical">
                    <Form.Item label="Tên ngành nghề" name="name" rules={[{ required: true, message: "Vui lòng nhập tên ngành nghề!" }]}>
                        <Input placeholder="Nhập tên ngành nghề" />
                    </Form.Item>

                    <Form.Item label="Chọn ảnh">
                        <Upload
                            listType="picture-card"
                            fileList={fileList}
                            beforeUpload={() => false} // Ngăn upload tự động
                            onChange={handleUploadChange}
                        >
                            {fileList.length >= 1 ? null : <UploadOutlined />}
                        </Upload>
                        {previewImage && <Avatar shape="square" size={64} src={previewImage} />}
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}

export default JobCategories;
