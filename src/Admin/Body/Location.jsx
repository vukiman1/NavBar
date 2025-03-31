import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Table, Button, message, Card, Space, Input, Tooltip, Modal, Form, Flex, Tag
} from 'antd';
import {
    SearchOutlined, EditOutlined, DeleteOutlined, FireOutlined, PlusOutlined, ExclamationCircleOutlined
} from '@ant-design/icons';
import locationService from '../../services/locationService';
import Title from 'antd/es/typography/Title';

const { confirm } = Modal;

function Location() {
    const [locationList, setLocationList] = useState([]);
    const [filteredLocations, setFilteredLocations] = useState([]);
    const [tableLoading, setTableLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingCity, setEditingCity] = useState(null);
    const [form] = Form.useForm();
    const navigate = useNavigate();

    // Load danh sách thành phố
    const loadLocationList = async () => {
        setTableLoading(true);
        try {
            const resData = await locationService.getAllLocation();
            setLocationList(resData);
            setFilteredLocations(resData);
        } catch (error) {
            console.error("Error fetching locations:", error);
            message.error("Không thể tải danh sách thành phố");
        } finally {
            setTableLoading(false);
        }
    };

    useEffect(() => {
        loadLocationList();
    }, []);

    // Xử lý tìm kiếm
    const handleSearch = (e) => {
        const value = e.target.value.toLowerCase();
        const filtered = locationList.filter(location => location.name.toLowerCase().includes(value));
        setFilteredLocations(filtered);
    };

    // Mở modal thêm/sửa
    const openModal = (city = null) => {
        setEditingCity(city);
        setModalVisible(true);
        form.setFieldsValue(city || { name: '' });
    };

    // Đóng modal
    const closeModal = () => {
        setModalVisible(false);
        form.resetFields();
    };

    // Xử lý lưu thành phố (Thêm/Sửa)
    const handleSave = async () => {
        try {
            const values = await form.validateFields();
            if (editingCity) {
                await locationService.updateLocation(editingCity.id, values);
                message.success("Cập nhật thành phố thành công!");
            } else {
                await locationService.createLocation(values);
                message.success("Thêm thành phố mới thành công!");
            }
            closeModal();
            loadLocationList();
        } catch (error) {
            console.error("Error saving city:", error);
            message.error("Lưu thất bại!");
        }
    };

    // Xác nhận xoá thành phố
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
                    await locationService.deleteLocation(id);
                    message.success("Xoá thành phố thành công!");
                    loadLocationList();
                } catch (error) {
                    console.error("Error deleting city:", error);
                    message.error("Xoá thất bại!");
                }
            },
        });
    };

    // Cấu hình cột Table
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Tên tỉnh/thành phố',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => (
                <Button type="link" onClick={() => navigate(`/cities/${record.id}`)}>
                    {text}
                </Button>
            ),
        },
        {
            title: 'Hành động',
            key: 'actions',
            render: (_, record) => (
                <Space size="middle">
                    <Tooltip title="Chỉnh sửa">
                        <Button
                            icon={<EditOutlined />}
                            type="link"
                            onClick={() => openModal(record)}
                        />
                    </Tooltip>
                    <Tooltip title="Xóa">
                        <Button
                            icon={<DeleteOutlined />}
                            type="link"
                            danger
                            onClick={() => confirmDelete(record.id)}
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <Card>
            {/* Header */}
            <Flex align="center" justify="space-between">
                <Flex align="center" gap="small">
                    <Title level={4} style={{ margin: 0 }}>Quản lý Tỉnh/Thành phố</Title>
                    <Tag color="blue" icon={<FireOutlined />}>
                        {locationList?.length || 0} thành phố
                    </Tag>
                </Flex>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal()}>
                    Thêm Tỉnh/Thành phố
                </Button>
            </Flex>

            {/* Thanh tìm kiếm */}
            <Input
                placeholder="Tìm kiếm theo tên..."
                prefix={<SearchOutlined />}
                onChange={handleSearch}
                style={{ margin: '16px 0' }}
            />

            {/* Bảng dữ liệu */}
            <Table
                loading={tableLoading}
                dataSource={filteredLocations}
                columns={columns}
                rowKey="id"
                pagination={{ pageSize: 5, pageSizeOptions: ['5', '10', '20', '50'], showSizeChanger: true }}
            />

            {/* Modal Thêm/Sửa */}
            <Modal
                title={editingCity ? "Chỉnh sửa  Tỉnh/Thành phố" : "Thêm  Tỉnh/Thành phố"}
                open={modalVisible}
                onCancel={closeModal}
                onOk={handleSave}
                okText="Lưu"
                cancelText="Hủy"
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        label="Tên Tỉnh/Thành phố"
                        name="name"
                        rules={[{ required: true, message: "Vui lòng nhập tên thành phố!" }]}
                    >
                        <Input placeholder="Nhập tên thành phố" />
                    </Form.Item>
                </Form>
            </Modal>
        </Card>
    );
}

export default Location;
