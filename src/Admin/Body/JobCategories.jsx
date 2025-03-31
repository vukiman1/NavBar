import { useState, useEffect } from "react";
import {
    message, Table, Space, Avatar, Button, Tooltip, Modal, Form, Input, Upload, Input as SearchInput
} from "antd";
import {
    EditOutlined, DeleteOutlined, FireOutlined, PlusOutlined, ExclamationCircleOutlined, UploadOutlined, SearchOutlined
} from "@ant-design/icons";
import { Flex, Tag, Typography } from "antd";
import jobService from "../../services/jobService";
import { bannerService } from "../../services/bannerService";

const { Title } = Typography;
const { confirm } = Modal;

function JobCategories() {
    const [jobCategories, setJobCategories] = useState([]);
    const [filteredCategories, setFilteredCategories] = useState([]);
    const [tableLoading, setTableLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [fileList, setFileList] = useState([]);
    const [form] = Form.useForm();
    const [searchText, setSearchText] = useState("");
    const [uploading, setUploading] = useState(false); // Trạng thái upload
    const [imageUrl, setImageUrl] = useState("")
    // Load danh sách ngành nghề
    const loadJobCategories = async () => {
        setTableLoading(true);
        try {
            const resData = await jobService.getAllJobCategories();
            setJobCategories(resData);
            setFilteredCategories(resData);
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

    // Xử lý tìm kiếm
    const handleSearch = (value) => {
        setSearchText(value);
        const filtered = jobCategories.filter((category) =>
            category.name.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredCategories(filtered);
    };

    // Mở modal thêm/sửa
    const openModal = (category = null) => {
        setEditingCategory(category);
        setModalVisible(true);
        form.setFieldsValue(category || { name: "", iconUrl: "" });
        setPreviewImage(category?.iconUrl || null);
        setFileList(category?.iconUrl ? [{ url: category.iconUrl, status: "done" }] : []);
        setUploading(false); // Reset trạng thái uploading khi mở modal
    };

    // Đóng modal
    const closeModal = () => {
        setModalVisible(false);
        form.resetFields();
        setPreviewImage(null);
        setFileList([]);
        setUploading(false); // Reset trạng thái uploading khi đóng modal
    };

    // Xử lý lưu (Thêm/Sửa)
    const handleSave = async () => {
        try {
            const values = await form.validateFields();
            console.log(values)
            if (editingCategory) {
                await jobService.updateJobCategory(editingCategory.id, values);
                message.success("Cập nhật ngành nghề thành công!");
            } else {
                await jobService.createJobCategory({iconUrl: imageUrl, name: values.name});
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

    const customRequest = async ({ file, onSuccess, onError }) => {
        setUploading(true); // Bắt đầu upload, đặt uploading thành true
        const formData = new FormData();
        formData.append("file", file);

        try {
            const resData = await bannerService.uploadBannerFile(formData);
            const imageUrl = resData.data.imageUrl;

            form.setFieldsValue({ iconUrl: imageUrl });
            setPreviewImage(imageUrl);
            setImageUrl(imageUrl);
            onSuccess("ok");
            message.success("Tải ảnh lên thành công");
        } catch (error) {
            console.error("Error uploading file:", error);
            onError(error);
            message.error("Tải ảnh lên thất bại");
        } finally {
            setUploading(false); // Kết thúc upload, đặt uploading thành false
        }
    };

    return (
        <div style={{ padding: "0 16px" }}>
            {/* Header */}
            <Flex
                vertical={window.innerWidth < 768}
                justify="space-between"
                align="center"
                wrap="wrap"
                gap="middle"
                style={{ marginBottom: 24 }}
            >
                <Flex align="center" gap="small" style={{ flexShrink: 0 }}>
                    <Title level={4} style={{ margin: 0 }}>Quản lý Ngành nghề</Title>
                    <Tag color="blue" icon={<FireOutlined />}>
                        {filteredCategories?.length || 0} ngành nghề
                    </Tag>
                </Flex>
                <Flex
                    align="center"
                    gap="small"
                    wrap="wrap"
                    style={{ width: window.innerWidth < 768 ? "100%" : "auto" }}
                >
                    <SearchInput
                        placeholder="Tìm kiếm theo tên ngành nghề"
                        value={searchText}
                        onChange={(e) => handleSearch(e.target.value)}
                        prefix={<SearchOutlined />}
                        allowClear
                        style={{
                            width: window.innerWidth < 768 ? "100%" : 300,
                            maxWidth: "100%",
                        }}
                    />
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => openModal()}
                        style={{ width: window.innerWidth < 768 ? "100%" : "auto" }}
                    >
                        Thêm ngành nghề mới
                    </Button>
                </Flex>
            </Flex>

            {/* Bảng dữ liệu */}
            <Table
                loading={tableLoading}
                dataSource={filteredCategories}
                columns={columns}
                rowKey="id"
                scroll={{ x: 800 }}
            />

            {/* Modal Thêm/Sửa */}
            <Modal
                title={editingCategory ? "Chỉnh sửa ngành nghề" : "Thêm ngành nghề mới"}
                open={modalVisible}
                onCancel={closeModal}
                onOk={handleSave}
                okText="Lưu"
                cancelText="Hủy"
                width={window.innerWidth < 768 ? "90%" : 520}
                okButtonProps={{ disabled: uploading }} // Vô hiệu hóa nút "Lưu" khi đang upload
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        label="Tên ngành nghề"
                        name="name"
                        rules={[{ required: true, message: "Vui lòng nhập tên ngành nghề!" }]}
                    >
                        <Input placeholder="Nhập tên ngành nghề" />
                    </Form.Item>

                    <Form.Item label="Chọn ảnh" name="iconUrl">
                        <Upload
                            customRequest={customRequest}
                            listType="picture"
                            fileList={fileList}
                            onChange={({ fileList }) => setFileList(fileList)}
                            maxCount={1}
                            className="mb-3"
                        >
                            <Button type="primary" icon={<UploadOutlined />} loading={uploading}>
                                {uploading ? "Đang tải lên..." : "Tải ảnh lên"}
                            </Button>
                        </Upload>
                        {previewImage && (
                            <Avatar shape="square" size={64} style={{ marginTop: 10 }} src={previewImage} />
                        )}
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}

export default JobCategories;