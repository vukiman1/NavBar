import React, { useEffect, useState } from 'react';
import { Table, Space, Avatar, Button, Typography, Tooltip, Card, message, Switch, Modal, Form, Input, Rate, Flex, Tag } from 'antd';
import {  DeleteOutlined, EditOutlined, FireOutlined } from '@ant-design/icons';
import feedbackService from "../../services/feedbackService";

const { Text, Title } = Typography;

function Feedback() {

    const [feedbackList, setFeedbackList] = useState([]);
    const [tableLoading, setTableLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentFeedback, setCurrentFeedback] = useState(null);

    const loadFeedbackList = async () => {
        setTableLoading(true);
        try {
            const resData = await feedbackService.getAllFeedback();
            setFeedbackList(resData.data);
        } catch (error) {
            console.error("Error fetching feedbacks:", error);
            message.error("Không thể tải danh sách feedback");
        } finally {
            setTableLoading(false);
        }
    };

    useEffect(() => {
        loadFeedbackList();
    }, []);

    const updateFeedbackStatus = async (id, isActive) => {
        try {
            await feedbackService.updateFeedbackStatus(id, isActive);
            setFeedbackList(prevList => prevList.map(feedback => 
                feedback.id === id ? { ...feedback, isActive } : feedback
            ));
            message.success(`Feedback ${isActive ? 'activated' : 'deactivated'} successfully.`);
        } catch (error) {
            console.error("Error updating feedback status:", error);
            message.error("Không thể cập nhật trạng thái feedback");
        }
    };

    const handleToggleFeedback = (checked, record) => {
        // Optimistically update UI
        setFeedbackList(prevList => prevList.map(feedback => 
            feedback.id === record.id ? { ...feedback, isActive: checked } : feedback
        ));
        updateFeedbackStatus(record.id, checked);
    };

    const handleEditFeedback = (record) => {
        setCurrentFeedback(record);
        setIsModalVisible(true);
    };

    const handleUpdateFeedback = async (values) => {
        try {
            await feedbackService.updateFeedback(currentFeedback.id, values);
            setFeedbackList(prevList => prevList.map(feedback => 
                feedback.id === currentFeedback.id ? { ...feedback, ...values } : feedback
            ));
            message.success("Feedback updated successfully.");
            setIsModalVisible(false);
        } catch (error) {
            console.error("Error updating feedback:", error);
            message.error("Không thể cập nhật feedback");
        }
    };

    const columns = [
        {
            title: 'Người dùng',
            dataIndex: 'userDict',
            key: 'user',
            render: (userDict) => (
                <Space size="middle">
                    <Avatar src={userDict.avatarUrl} />
                    <Text>{userDict.fullName}</Text>
                </Space>
            ),
        },
        {
            title: 'Nội dung',
            dataIndex: 'content',
            key: 'content',
        },
        {
            title: 'Đánh giá',
            dataIndex: 'rating',
            key: 'rating',
            render: (rating) => <Text>{rating} / 5</Text>,
        },
        {
            title: 'Thời gian',
            dataIndex: 'createAt',
            key: 'createAt',
            render: (createAt) => <Text>{createAt}</Text>,
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Switch 
                        checked={record.isActive} 
                        onChange={(checked) => handleToggleFeedback(checked, record)} 
                    />
                    <Tooltip title="Chỉnh sửa">
                        <Button icon={<EditOutlined />} type="link" onClick={() => handleEditFeedback(record)} />
                    </Tooltip>
                    <Tooltip title="Xóa">
                        <Button icon={<DeleteOutlined />} type="link" danger />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <Card>
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <Flex align="center" gap="small">
                    <Title level={4} style={{ margin: 0 }}>
                        Quản lý phản hồi
                    </Title>
                    <Tag color="blue" icon={<FireOutlined />}>
                        {feedbackList?.length || 0} phản hồi
                    </Tag>
                </Flex>
                <Table
                    loading={tableLoading}
                    columns={columns}
                    dataSource={feedbackList}
                    rowKey="id"
                />
            </Space>
            <Modal
                title="Chỉnh sửa phản hồi"
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
            >
                <Form
                    layout="vertical"
                    initialValues={currentFeedback}
                    onFinish={handleUpdateFeedback}
                >
                    <Form.Item
                        name="content"
                        label="Nội dung"
                        rules={[{ required: true, message: 'Vui lòng nhập nội dung' }]}
                    >
                        <Input.TextArea rows={4} />
                    </Form.Item>
                    <Form.Item
                        name="rating"
                        label="Đánh giá"
                        rules={[{ required: true, message: 'Vui lòng nhập đánh giá' }]}
                    >
                        <Rate count={5} />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Cập nhật
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </Card>
    )
}

export default Feedback;
