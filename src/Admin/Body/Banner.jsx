import { useEffect, useState } from "react";
import { 
    Table, Space, Button, message, Image, Modal, Form, Input, Switch, 
    Card, Typography, Tooltip, Popconfirm, Flex, Tag, Divider, Empty, 
    Select, Upload
} from "antd";
import { 
    PlusOutlined, EditOutlined, DeleteOutlined, FireOutlined, 
    InfoCircleOutlined, UploadOutlined 
} from '@ant-design/icons';
import { bannerService } from "../../services/bannerService";

const { Title, Text } = Typography;
const { Option } = Select;

// Hàm render bảng (giữ nguyên)
const renderBannerTable = (
    bannerList, 
    tableLoading, 
    handleToggleBanner, 
    handleEdit, 
    handleDelete
) => {
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 80,
            render: (id) => <Text>{id}</Text>,
        },
        {
            title: 'Loại',
            dataIndex: 'type',
            key: 'type',
            width: 100,
            render: (type) => <Tag color="blue">{type}</Tag>,
        },
        {
            title: 'Hình ảnh',
            dataIndex: 'imageUrl',
            key: 'imageUrl',
            width: 200,
            render: (imageUrl) => (
                <Image 
                    src={imageUrl} 
                    alt="Banner Image" 
                    width={100}
                    height={60}
                    style={{ borderRadius: '8px' }}
                />
            )
        },
        {
            title: 'Ngày Tạo',
            dataIndex: 'createAt',
            key: 'createAt',
            render: (createAt) => <Text>{new Date(createAt).toLocaleDateString()}</Text>,
        },
        {
            title: 'Thao tác',
            key: 'action',
            width: 120,
            align: 'center',
            render: (_, record) => (
                <Space size="middle">
                    <Switch 
                        checked={record.isActive} 
                        onChange={(checked) => handleToggleBanner(checked, record)} 
                    />
                    <Tooltip title="Chỉnh sửa">
                        <Button 
                            type="link"
                            icon={<EditOutlined />}
                            onClick={() => handleEdit(record)}
                        />
                    </Tooltip>
                    <Tooltip title="Xóa">
                        <Popconfirm
                            title="Xóa banner"
                            description="Bạn có chắc chắn muốn xóa banner này?"
                            onConfirm={() => handleDelete(record.id)}
                            okText="Xóa"
                            cancelText="Hủy"
                            okButtonProps={{ danger: true }}
                        >
                            <Button 
                                type="link"
                                danger
                                icon={<DeleteOutlined />}
                            />
                        </Popconfirm>
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <Table 
            columns={columns} 
            dataSource={bannerList} 
            loading={tableLoading}
            rowKey="id"
            locale={{
                emptyText: <Empty 
                    image={Empty.PRESENTED_IMAGE_SIMPLE} 
                    description="Chưa có banner nào"
                />
            }}
            pagination={{
                pageSize: 5,
                showSizeChanger: true,
                showTotal: (total) => `Tổng số ${total} banner`,
            }}
        />
    );
};

// Hàm render form trong modal
const renderBannerForm = (form, editingBanner, handleSubmit, onCancel, imageUrl, setImageUrl) => {
    const customRequest = async ({ file, onSuccess, onError }) => {
        const formData = new FormData();
        formData.append('file', file);
        
        try {
            // console.log(object)
            const resData = await bannerService.uploadBannerFile(formData);
            console.log(resData.data.imageUrl);
            setImageUrl(resData.data.imageUrl); // Lưu URL vào state
            form.setFieldsValue({ imageUrl: resData.data.imageUrl }); // Cập nhật giá trị vào form
            onSuccess("ok");
            message.success("Tải ảnh lên thành công");
        } catch (error) {
            onError(error);
            message.error("Tải ảnh lên thất bại");
        }
    };

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={(values) => handleSubmit({ ...values, imageUrl })} // Gửi imageUrl cùng form
            initialValues={editingBanner ? { ...editingBanner, imageUrl: imageUrl || editingBanner.imageUrl } : {
                isShowButton: false,
                descriptionLocation: 3,
                isActive: false,
                type: undefined, // Reset loại
                description: "", // Reset mô tả
                buttonLink: "", // Reset link
                imageUrl: null // Reset ảnh
            }}
        >
            <Form.Item
                name="type"
                label="Loại"
                rules={[{ required: true, message: 'Vui lòng chọn loại' }]}
                tooltip={{ title: 'Chọn loại banner', icon: <InfoCircleOutlined /> }}
            >
                <Select placeholder="Chọn loại">
                    <Option value="BANNER">BANNER</Option>
                    <Option value="POPUP">POPUP</Option>
                </Select>
            </Form.Item>

            <Form.Item
                name="imageUrl"
                label="Hình ảnh"
                rules={[{ required: true, message: 'Vui lòng tải lên hình ảnh' }]}
            >
                <Upload
                    customRequest={customRequest}
                    listType="picture"
                    maxCount={1}
                >
                    <Button type="primary" icon={<UploadOutlined />}>
                        Tải ảnh lên
                    </Button>
                </Upload>
                {imageUrl && (
                    <Image src={imageUrl} width={100} style={{ marginTop: 10 }} />
                )}
            </Form.Item>

            <Form.Item
                name="description"
                label="Mô tả"
                rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
                tooltip={{ title: 'Mô tả chi tiết về banner', icon: <InfoCircleOutlined /> }}
            >
                <Input.TextArea placeholder="Nhập mô tả" rows={4} />
            </Form.Item>

            <div className="grid grid-cols-2 gap-4">
                <Form.Item
                    name="buttonLink"
                    label="Link điều hướng"
                    tooltip={{ title: 'URL khi nhấn vào banner', icon: <InfoCircleOutlined /> }}
                >
                    <Input placeholder="Nhập link điều hướng" />
                </Form.Item>
            </div>

            <Form.Item
                name="isActive"
                label="Trạng thái"
                valuePropName="checked"
                tooltip={{ title: 'Bật/tắt trạng thái banner', icon: <InfoCircleOutlined /> }}
            >
                <Switch />
            </Form.Item>

            <Divider />

            <Form.Item className="flex justify-end mb-0">
                <Space>
                    <Button onClick={onCancel}>Hủy</Button>
                    <Button type="primary" htmlType="submit">
                        {editingBanner ? 'Cập nhật' : 'Thêm mới'}
                    </Button>
                </Space>
            </Form.Item>
        </Form>
    );
};

// Component chính
function Banner() {
    const [bannerList, setBannerList] = useState([]);
    const [tableLoading, setTableLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBanner, setEditingBanner] = useState(null);
    const [imageUrl, setImageUrl] = useState(null); // State để lưu đường dẫn ảnh
    const [form] = Form.useForm();
    const loadBannerList = async () => {
        setTableLoading(true);
        try {
            const resData = await bannerService.getAllBanner();
            setBannerList(resData.data);
        } catch (error) {
            console.error("Error fetching banners:", error);
            message.error("Không thể tải danh sách banner");
        } finally {
            setTableLoading(false);
        }
    };

    const handleToggleBanner = async (checked, record) => {
        try {
            await bannerService.updateBannerStatus(record.id, checked);
            setBannerList(prevList => prevList.map(banner => 
                banner.id === record.id ? { ...banner, isActive: checked } : banner
            ));
            message.success(`Banner ${checked ? 'activated' : 'deactivated'} successfully.`);
        } catch (error) {
            console.error("Error updating banner status:", error);
            message.error("Không thể cập nhật trạng thái banner");
        }
    };

    const handleEdit = (banner) => {
        setEditingBanner(banner);
        setImageUrl(banner.imageUrl); // Load ảnh hiện tại khi edit
        form.setFieldsValue(banner); // Đặt giá trị cho form
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        try {
            const deleteBanner = await bannerService.deleteBanner(id);
            console.log(deleteBanner)
            message.success(deleteBanner.message);
            loadBannerList();
        } catch (error) {
            console.error("Error deleting banner:", error);
            message.error("Không thể xóa banner");
        }
    };

    const handleSubmit = async (values) => {
        console.log("Form values:", values);
        try {
            if (editingBanner) {
                console.log(editingBanner.id)
                await bannerService.updateBanner(editingBanner.id, values);
                message.success("Cập nhật banner thành công");
            } else {
                // await bannerService.createBanner(values);
                const banner = await bannerService.createBanner(values);
                console.log("Banner created:", banner);
                message.success("Thêm banner thành công");
            }
            setIsModalOpen(false);
            form.resetFields(); // Reset form sau khi submit
            setEditingBanner(null);
            setImageUrl(null); // Reset ảnh sau khi submit
            loadBannerList();
        } catch (error) {
            console.error("Error saving banner:", error);
            message.error("Không thể lưu banner");
        }
    };

    useEffect(() => {
        loadBannerList();
    }, []);

    const handleCancel = () => {
        setIsModalOpen(false);
        setEditingBanner(null);
        setImageUrl(null); // Reset ảnh khi hủy
        form.resetFields(); // Reset form khi hủy
    };

    return (
        <Card bordered={false}>
            <Flex vertical gap="middle">
                <Flex align="center" justify="space-between">
                    <Flex align="center" gap="small">
                        <Title level={4} style={{ margin: 0 }}>Quản lý Banner</Title>
                        <Tag color="blue" icon={<FireOutlined />}>
                            {bannerList?.length || 0} banner
                        </Tag>
                    </Flex>
                    <Button 
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => {
                            setEditingBanner(null); // Đặt chế độ thêm mới
                            setImageUrl(null); // Reset ảnh
                            form.resetFields(); // Reset form trước khi mở modal
                            setIsModalOpen(true);
                        }}
                    >
                        Thêm banner mới
                    </Button>
                </Flex>

                {renderBannerTable(
                    bannerList,
                    tableLoading,
                    handleToggleBanner,
                    handleEdit,
                    handleDelete
                )}
            </Flex>

            <Modal
                title={<Title level={4} style={{ margin: 0 }}>
                    {editingBanner ? "Chỉnh sửa Banner" : "Thêm Banner Mới"}
                </Title>}
                open={isModalOpen}
                onCancel={handleCancel}
                footer={null}
                width={700}
            >
                {renderBannerForm(form, editingBanner, handleSubmit, handleCancel, imageUrl, setImageUrl)}
            </Modal>
        </Card>
    );
}

export default Banner;