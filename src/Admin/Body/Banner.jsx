import { useEffect, useState } from "react";
import { 
    Table, 
    Space, 
    Button, 
    message, 
    Image, 
    Modal, 
    Form, 
    Input, 
    Switch, 
    Card, 
    Typography, 
    Tooltip, 
    Popconfirm,
    Flex,
    Tag,
    Divider,
    Empty,
    Select, 
    Upload
} from "antd";
import { 
    PlusOutlined, 
    EditOutlined, 
    DeleteOutlined, 
    FireOutlined,
    InfoCircleOutlined,
    UploadOutlined
} from '@ant-design/icons';
import { bannerService } from "../../services/bannerService";

const { Title, Text } = Typography;
const { Option } = Select;

function Banner() {
    const [bannerList, setBannerList] = useState([]);
    const [tableLoading, setTableLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBanner, setEditingBanner] = useState(null);
    const [form] = Form.useForm();

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
        form.setFieldsValue(banner);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        try {
            message.success("Xóa banner thành công");
            loadBannerList();
        } catch (error) {
            console.error("Error deleting banner:", error);
            message.error("Không thể xóa banner");
        }
    };

    const handleSubmit = async (values) => {
        console.log(values)
        try {
            if (editingBanner) {
                // await bannerService.updateBanner(editingBanner.id, values);
                message.success("Cập nhật banner thành công");
            } else {
                // await bannerService.createBanner(values);
                message.success("Thêm banner thành công");
            }
            setIsModalOpen(false);
            form.resetFields();
            setEditingBanner(null);
            loadBannerList();
        } catch (error) {
            console.error("Error saving banner:", error);
            message.error("Không thể lưu banner");
        }
    };

    useEffect(() => {
        loadBannerList();
    }, []);

    return (
        <Card bordered={false}>
            <Flex vertical gap="middle">
                <Flex align="center" justify="space-between">
                    <Flex align="center" gap="small">
                        <Title level={4} style={{ margin: 0 }}>
                            Quản lý Banner
                        </Title>
                        <Tag color="blue" icon={<FireOutlined />}>
                            {bannerList?.length || 0} banner
                        </Tag>
                    </Flex>
                    <Button 
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => {
                            setEditingBanner(null);
                            form.resetFields();
                            setIsModalOpen(true);
                        }}
                    >
                        Thêm banner mới
                    </Button>
                </Flex>

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
            </Flex>

            <Modal
                title={
                    <Title level={4} style={{ margin: 0 }}>
                        {editingBanner ? "Chỉnh sửa Banner" : "Thêm Banner Mới"}
                    </Title>
                }
                open={isModalOpen}
                onCancel={() => {
                    setIsModalOpen(false);
                    setEditingBanner(null);
                    form.resetFields();
                }}
                footer={null}
                width={700}
            >
                <Divider />
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    initialValues={{
                        isShowButton: false,
                        descriptionLocation: 3
                    }}
                >
                    <Form.Item
                        name="type"
                        label="Loại"
                        rules={[{ required: true, message: 'Vui lòng chọn loại' }]}
                        tooltip={{
                            title: 'Chọn loại banner',
                            icon: <InfoCircleOutlined />
                        }}
                    >
                        <Select placeholder="Chọn loại">
                            <Option value="BANNER">BANNER</Option>
                            <Option value="POPUP">POPUP</Option>
                        </Select>
                    </Form.Item>

                   

                    
                         <Upload
                            action="http://localhost:8000/api/myjob/web/banner2"
                            listType="picture"
                            // defaultFileList={fileList}
                        >
                            <Button type="primary" icon={<UploadOutlined />}>
                            Tải ảnh lên
                            </Button>
                        </Upload>
       

                        
                   

                    <Form.Item
                        name="description"
                        label="Mô tả"
                        rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
                        tooltip={{
                            title: 'Mô tả chi tiết về banner',
                            icon: <InfoCircleOutlined />
                        }}
                    >
                        <Input.TextArea 
                            placeholder="Nhập mô tả" 
                            rows={4}
                        />
                    </Form.Item>

                    <div className="grid grid-cols-2 gap-4">
                      

                        <Form.Item
                            name="buttonLink"
                            label="Link nút"
                            tooltip={{
                                title: 'URL khi nhấn vào nút',
                                icon: <InfoCircleOutlined />
                            }}
                        >
                            <Input placeholder="Nhập link nút" />
                        </Form.Item>
                    </div>

                            

                    <Form.Item
                        name="isActive"
                        label="Trạng thái"
                        valuePropName="checked"
                        tooltip={{
                            title: 'Bật/tắt trạng thái banner',
                            icon: <InfoCircleOutlined />
                        }}
                    >
                        <Switch />
                    </Form.Item>

                    <Divider />

                    <Form.Item className="flex justify-end mb-0">
                        <Space>
                            <Button 
                                onClick={() => {
                                    setIsModalOpen(false);
                                    setEditingBanner(null);
                                    form.resetFields();
                                }}
                            >
                                Hủy
                            </Button>
                            <Button 
                                type="primary" 
                                htmlType="submit"
                            >
                                {editingBanner ? 'Cập nhật' : 'Thêm mới'}
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </Card>
    )
}

export default Banner;
