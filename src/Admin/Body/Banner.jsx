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
    Empty 
} from "antd";
import { 
    PlusOutlined, 
    EditOutlined, 
    DeleteOutlined, 
    LinkOutlined, 
    EyeOutlined,
    FireOutlined,
    GlobalOutlined,
    PictureOutlined,
    InfoCircleOutlined
} from '@ant-design/icons';
import webService from "../../services/webService";

const { Title, Text } = Typography;

function Banner() {
    const [bannerList, setBannerList] = useState([]);
    const [tableLoading, setTableLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBanner, setEditingBanner] = useState(null);
    const [form] = Form.useForm();

    const columns = [
        {
            title: 'Hình ảnh & Mô tả',
            dataIndex: 'imageUrl',
            key: 'imageUrl',
            width: 400,
            render: (imageUrl, record) => (
                <Space size="middle" align="start">
                    <div className="relative group">
                        <Image 
                            src={imageUrl} 
                            alt={record.description} 
                            width={120}
                            height={80}
                            className="rounded-lg object-cover"
                            style={{ 
                                backgroundColor: '#f5f5f5',
                                border: '1px solid #d9d9d9'
                            }}
                            preview={{
                                maskClassName: 'rounded-lg',
                                title: record.description
                            }}
                            fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3PTWBSGcbGzM6GCKqlIBRV0dHRJFarQ0eUT8LH4BnRU0NHR0UEFVdIlFRV7TzRksomPY8uykTk/zewQfKw/9znv4yvJynLv4uLiV2dBoDiBf4qP3/ARuCRABEFAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghgg0Aj8i0JO4OzsrPv69Wv+hi2qPHr0qNvf39+iI97soRIh4f3z58/u7du3SXX7Xt7Z2enevHmzfQe+oSN2apSAPj09TSrb+XKI/f379+08+A0cNRE2ANkupk+ACNPvkSPcAAEibACyXUyfABGm3yNHuAECRNgAZLuYPgEirKlHu7u7XdyytGwHAd8jjNyng4OD7vnz51dbPT8/7z58+NB9+/bt6jU/TI+AGWHEnrx48eJ/EsSmHzx40L18+fLyzxF3ZVMjEyDCiEDjMYZZS5wiPXnyZFbJaxMhQIQRGzHvWR7XCyOCXsOmiDAi1HmPMMQjDpbpEiDCiL358eNHurW/5SnWdIBbXiDCiA38/Pnzrce2YyZ4//59F3ePLNMl4PbpiL2J0L979+7yDtHDhw8vtzzvdGnEXdvUigSIsCLAWavHp/+qM0BcXMd/q25n1vF57TYBp0a3mUzilePj4+7k5KSLb6gt6ydAhPUzXnoPR0dHl79WGTNCfBnn1uvSCJdegQhLI1vvCk+fPu2ePXt2tZOYEV6/fn31dz+shwAR1sP1cqvLntbEN9MxA9xcYjsxS1jWR4AIa2Ibzx0tc44fYX/16lV6NDFLXH+YL32jwiACRBiEbf5KcXoTIsQSpzXx4N28Ja4BQoK7rgXiydbHjx/P25TaQAJEGAguWy0+2Q8PD6/Ki4R8EVl+bzBOnZY95fq9rj9zAkTI2SxdidBHqG9+skdw43borCXO/ZcJdraPWdv22uIEiLA4q7nvvCug8WTqzQveOH26fodo7g6uFe/a17W3+nFBAkRYENRdb1vkkz1CH9cPsVy/jrhr27PqMYvENYNlHAIesRiBYwRy0V+8iXP8+/fvX11Mr7L7ECueb/r48eMqm7FuI2BGWDEG8cm+7G3NEOfmdcTQw4h9/55lhm7DekRYKQPZF2ArbXTAyu4kDYB2YxUzwg0gi/41ztHnfQG26HbGel/crVrm7tNY+/1btkOEAZ2M05r4FB7r9GbAIdxaZYrHdOsgJ/wCEQY0J74TmOKnbxxT9n3FgGGWWsVdowHtjt9Nnvf7yQM2aZU/TIAIAxrw6dOnAWtZZcoEnBpNuTuObWMEiLAx1HY0ZQJEmHJ3HNvGCBBhY6jtaMoEiJB0Z29vL6ls58vxPcO8/zfrdo5qvKO+d3Fx8Wu8zf1dW4p/cPzLly/dtv9Ts/EbcvGAHhHyfBIhZ6NSiIBTo0LNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiEC/wGgKKC4YMA4TAAAAABJRU5ErkJggg=="
                        />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg bg-black/30">
                            <EyeOutlined className="text-2xl text-white" />
                        </div>
                    </div>
                    <Space direction="vertical" size={1}>
                        <Text strong className="flex items-center gap-1">
                            <PictureOutlined /> Banner #{record.id}
                        </Text>
                        <Text type="secondary" className="max-w-[250px] line-clamp-2">
                            {record.description}
                        </Text>
                    </Space>
                </Space>
            )
        },
        {
            title: 'Nút & Link',
            key: 'button',
            width: 300,
            render: (_, record) => (
                <Space direction="vertical" size={4}>
                    {record.isShowButton ? (
                        <>
                            <Text>
                                <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm">
                                    {record.buttonText}
                                </span>
                            </Text>
                            <Text type="secondary">
                                <GlobalOutlined className="mr-1" />
                                <a 
                                    href={record.buttonLink} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-gray-500 hover:text-blue-600"
                                >
                                    {record.buttonLink}
                                </a>
                            </Text>
                        </>
                    ) : (
                        <Text type="secondary" italic>Không hiển thị nút</Text>
                    )}
                </Space>
            )
        },
        {
            title: 'Vị trí',
            dataIndex: 'descriptionLocation',
            key: 'descriptionLocation',
            width: 120,
            render: (location) => {
                const positions = {
                    1: { text: 'Trên', color: 'blue' },
                    2: { text: 'Giữa', color: 'purple' },
                    3: { text: 'Dưới', color: 'orange' }
                };
                const pos = positions[location] || { text: location, color: 'default' };
                return <Tag color={pos.color}>{pos.text}</Tag>;
            }
        },
        {
            title: 'Thao tác',
            key: 'action',
            width: 120,
            align: 'center',
            render: (_, record) => (
                <Space size="middle">
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
            const resData = await webService.getAllBanner();
            setBannerList(resData.data);
        } catch (error) {
            console.error("Error fetching banners:", error);
            message.error("Không thể tải danh sách banner");
        } finally {
            setTableLoading(false);
        }
    };

    const handleEdit = (banner) => {
        setEditingBanner(banner);
        form.setFieldsValue(banner);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        try {
            // await webService.deleteBanner(id);
            message.success("Xóa banner thành công");
            loadBannerList();
        } catch (error) {
            console.error("Error deleting banner:", error);
            message.error("Không thể xóa banner");
        }
    };

    const handleSubmit = async (values) => {
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
                        name="imageUrl"
                        label="URL Hình ảnh"
                        rules={[{ required: true, message: 'Vui lòng nhập URL hình ảnh' }]}
                        tooltip={{
                            title: 'URL của hình ảnh banner',
                            icon: <InfoCircleOutlined />
                        }}
                    >
                        <Input placeholder="Nhập URL hình ảnh" />
                    </Form.Item>

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
                            name="buttonText"
                            label="Nội dung nút"
                            tooltip={{
                                title: 'Văn bản hiển thị trên nút',
                                icon: <InfoCircleOutlined />
                            }}
                        >
                            <Input placeholder="Nhập nội dung nút" />
                        </Form.Item>

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

                    <div className="grid grid-cols-2 gap-4">
                        <Form.Item
                            name="isShowButton"
                            label="Hiển thị nút"
                            valuePropName="checked"
                            tooltip={{
                                title: 'Bật/tắt hiển thị nút trên banner',
                                icon: <InfoCircleOutlined />
                            }}
                        >
                            <Switch />
                        </Form.Item>

                        <Form.Item
                            name="descriptionLocation"
                            label="Vị trí mô tả"
                            rules={[{ required: true, message: 'Vui lòng nhập vị trí mô tả' }]}
                            tooltip={{
                                title: 'Vị trí hiển thị mô tả (1: Trên, 2: Giữa, 3: Dưới)',
                                icon: <InfoCircleOutlined />
                            }}
                        >
                            <Input 
                                type="number" 
                                min={1}
                                max={3}
                                placeholder="Nhập vị trí mô tả (1-3)" 
                            />
                        </Form.Item>
                    </div>

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

export default Banner
