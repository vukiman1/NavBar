import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Table, Button, message, Space, Tooltip, Modal, Form, Input } from 'antd';
import locationService from '../../services/locationService';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

function District() {
    const { cityId } = useParams();
    const [districtList, setDistrictList] = useState([]);
    const [tableLoading, setTableLoading] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [editingDistrict, setEditingDistrict] = useState(null);

    const loadDistrictList = useCallback(async () => {
        setTableLoading(true);
        try {
            const resData = await locationService.getDistrictsByCityId(cityId);
            console.log(resData);
            // Ensure the response is an array
            if (Array.isArray(resData)) {
                setDistrictList(resData);
            } else if (resData && Array.isArray(resData.data)) {
                setDistrictList(resData.data);
            } else {
                console.error("Unexpected data format", resData);
                message.error("Dữ liệu không đúng định dạng");
            }
        } catch (error) {
            console.error("Error fetching districts:", error);
            message.error("Không thể tải danh sách quận huyện");
        } finally {
            setTableLoading(false);
        }
    }, [cityId]);

    useEffect(() => {
        loadDistrictList();
    }, [loadDistrictList]);

    const showEditModal = (district) => {
        setEditingDistrict(district);
        setIsEditModalVisible(true);
    };

    const showAddModal = () => {
        setIsAddModalVisible(true);
    };

    const handleEditOk = () => {
        // Logic to save changes
        setIsEditModalVisible(false);
    };

    const handleAddOk = () => {
        // Logic to add new district
        setIsAddModalVisible(false);
    };

    const handleCancel = () => {
        setIsEditModalVisible(false);
        setIsAddModalVisible(false);
    };

    const columns = [
        {
            title: 'Id',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => <button  >{text}</button>,
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (text, record) => (
                <Space size="middle">
                <Tooltip title="Chỉnh sửa">
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        size="small"
                        style={{ backgroundColor: "#52c41a", borderColor: "#52c41a" }}
                        onClick={() => showEditModal(record)}
                    />
                </Tooltip>
                <Tooltip title="Xóa">
                    <Button
                        type="primary"
                        danger
                        icon={<DeleteOutlined />}
                        size="small"
                    />
                </Tooltip>
            </Space>
            ),
        },
    ];

    return (
        <div>
            <Button type="primary" onClick={showAddModal} style={{ marginBottom: 16 }}>Thêm quận/huyện</Button>
            <Table columns={columns} dataSource={districtList} loading={tableLoading} rowKey="id" />
            <Modal title="Chỉnh sửa quận/huyện" visible={isEditModalVisible} onOk={handleEditOk} onCancel={handleCancel}>
                <Form layout="vertical">
                    <Form.Item label="Tên quận/huyện">
                        <Input defaultValue={editingDistrict ? editingDistrict.name : ''} />
                    </Form.Item>
                </Form>
            </Modal>
            <Modal title="Thêm mới quận/huyện" visible={isAddModalVisible} onOk={handleAddOk} onCancel={handleCancel}>
                <Form layout="vertical">
                    <Form.Item label="Tên quận/huyện">
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}

export default District;
