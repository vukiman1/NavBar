import { useEffect, useState } from "react";
import jobService from "../../services/jobService";
import {
  Card,
  Table,
  Tag,
  Space,
  Typography,
  Button,
  Flex,
  Spin,
  Tooltip,
  Modal,
  message,
  Select,
} from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  EyeOutlined,
  FireOutlined,
  ClockCircleOutlined,
  UserOutlined,
  DollarOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import dayjs from "dayjs";

const { Title, Text } = Typography;

const JobPost = () => {
  const [jobList, setJobList] = useState([]);
  const [tableLoading, setTableLoading] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const loadJobList = async () => {
    setTableLoading(true);
    try {
      const resData = await jobService.getAllJobPost();
      setJobList(resData);
      console.log(jobList);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      message.error("Không thể tải danh sách tin tuyển dụng");
    } finally {
      setTableLoading(false);
    }
  };

  useEffect(() => {
    loadJobList();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      await jobService.updateJobStatus(id, status);
      message.success("Cập nhật trạng thái thành công");
      loadJobList();
    } catch (error) {
      console.error("Error updating status:", error);
      message.error("Không thể cập nhật trạng thái");
    }
  };

  const handleDelete = async () => {
    try {
      await jobService.deleteJobPost(selectedJobId);
      message.success("Xóa tin tuyển dụng thành công");
      setIsModalVisible(false);
      loadJobList();
    } catch (error) {
      console.error("Error deleting job:", error);
      message.error("Không thể xóa tin tuyển dụng");
    }
  };

  const showDeleteConfirm = (id) => {
    setSelectedJobId(id);
    setIsModalVisible(true);
  };

  

  const handleStatusChange = (value, record) => {
    handleUpdateStatus(record.id, value);
  };

  const columns = [
    {
      title: "Tin tuyển dụng",
      dataIndex: "jobName",
      key: "jobName",
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <Link to={`/job-post/edit/${record.id}`}>
            <Text strong>{record.jobName}</Text>
          </Link>
          <Space size={[0, 8]} wrap>
            {record.isHot && (
              <Tag icon={<FireOutlined />} color="volcano">
                Hot
              </Tag>
            )}
            {record.isUrgent && (
              <Tag icon={<ClockCircleOutlined />} color="error">
                Gấp
              </Tag>
            )}
            <Tag icon={<UserOutlined />}>{record.quantity} người</Tag>
            <Tag icon={<DollarOutlined />}>
              {record.salaryMin.toLocaleString()} - {record.salaryMax.toLocaleString()} VNĐ
            </Tag>
          </Space>
          <Text type="secondary" style={{ fontSize: "12px" }}>
            <EnvironmentOutlined /> {record.typeOfWorkplace === 1 ? "Tại văn phòng" : "Từ xa"}
          </Text>
        </Space>
      ),
    },
    {
      title: "Người đăng",
      dataIndex: "contactPersonName",
      key: "contactPersonName",
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <Text>{record.contactPersonName}</Text>
          <Text type="secondary" style={{ fontSize: "12px" }}>
            {record.contactPersonEmail}
          </Text>
          <Text type="secondary" style={{ fontSize: "12px" }}>
            {record.contactPersonPhone}
          </Text>
        </Space>
      ),
    },
    {
      title: "Thời hạn",
      dataIndex: "deadline",
      key: "deadline",
      render: (deadline) => (
        <Text>{dayjs(deadline).format("DD/MM/YYYY")}</Text>
      ),
    },
    {
      title: "Trạng thái",
      key: "status",
      dataIndex: "status",
      width: "200px",
      render: (status, record) => (
        <Space direction="vertical" size="small" style={{ width: '100%' }}>
          <Select
            value={status}
            style={{ width: '100%' }}
            onChange={(value) => handleStatusChange(value, record)}
            options={[
              {
                value: 1,
                label: 'Chờ duyệt',
                icon: <ClockCircleOutlined />,
                className: 'status-pending'
              },
              {
                value: 3,
                label: 'Phê duyệt',
                icon: <CheckCircleOutlined />,
                className: 'status-approved'
              },
              {
                value: 2,
                label: 'Từ chối',
                icon: <CloseCircleOutlined />,
                className: 'status-rejected'
              }
            ]}
            optionRender={(option) => (
              <Space>
                <Tag
                  icon={option.data.icon}
                  color={
                    option.value === 1 ? 'warning' :
                    option.value === 2 ? 'error' :
                    option.value === 3 ? 'success' : 'default'
                  }
                  style={{ margin: 0 }}
                >
                  {option.data.label}
                </Tag>
              </Space>
            )}
            dropdownStyle={{ minWidth: '160px' }}
          />
        </Space>
      ),
    },
    {
      title: "Thống kê",
      key: "stats",
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <Text>Lượt xem: {record.views}</Text>
          <Text>Lượt chia sẻ: {record.shares}</Text>
        </Space>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      width: "120px",
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Xem chi tiết">
            <Button
              icon={<EyeOutlined />}
              type="link"
              onClick={() => window.open(`/jobs/${record.slug}`, '_blank')}
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
              onClick={() => showDeleteConfirm(record.id)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <Card>
      <Flex vertical gap="middle">
        <Flex align="center" justify="space-between">
          <Flex align="center" gap="small">
            <Title level={4} style={{ margin: 0 }}>
              Quản lý tin tuyển dụng
            </Title>
            <Tag color="blue" icon={<FireOutlined />}>{jobList?.length || 0} tin tuyển dụng</Tag>
          </Flex>
        </Flex>

        {tableLoading ? (
          <Flex align="center" justify="center" style={{ minHeight: 400 }}>
            <Spin size="large" />
          </Flex>
        ) : (
          <Table
            columns={columns}
            dataSource={jobList}
            rowKey="id"
            pagination={{
              defaultPageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Tổng cộng ${total} tin tuyển dụng`,
            }}
          />
        )}

        <Modal
          title="Xác nhận xóa"
          open={isModalVisible}
          onOk={handleDelete}
          onCancel={() => setIsModalVisible(false)}
          okText="Xóa"
          cancelText="Hủy"
        >
          <p>Bạn có chắc chắn muốn xóa tin tuyển dụng này?</p>
        </Modal>
      </Flex>
    </Card>
  );
};

export default JobPost;