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
  Input,
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
  SearchOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import dayjs from "dayjs";

const { Title, Text } = Typography;
const { Option } = Select;

const JobPost = () => {
  const [jobList, setJobList] = useState([]);
  const [tableLoading, setTableLoading] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Bộ lọc
  const [searchText, setSearchText] = useState("");
  const [approvalStatus, setApprovalStatus] = useState(null);
  const [recruitmentStatus, setRecruitmentStatus] = useState(null);

  const loadJobList = async () => {
    setTableLoading(true);
    try {
      const params = {
        search: searchText || undefined,
        approvalStatus: approvalStatus !== null ? approvalStatus : undefined,
        recruitmentStatus: recruitmentStatus !== null ? recruitmentStatus : undefined,
      };

      const resData = await jobService.getAllJobPost(params);
      setJobList(resData);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      message.error("Không thể tải danh sách tin tuyển dụng");
    } finally {
      setTableLoading(false);
    }
  };

  useEffect(() => {
    loadJobList();
  }, [searchText, approvalStatus, recruitmentStatus]);

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
      title: "Thời hạn",
      dataIndex: "deadline",
      key: "deadline",
      render: (deadline) => <Text>{dayjs(deadline).format("DD/MM/YYYY")}</Text>,
    },
    {
      title: "Trạng thái duyệt",
      key: "status",
      dataIndex: "status",
      width: "200px",
      render: (status, record) => (
        <Select
          value={status}
          style={{ width: "100%" }}
          onChange={(value) => handleStatusChange(value, record)}
          options={[
            { value: 1, label: "Chờ duyệt", icon: <ClockCircleOutlined /> },
            { value: 3, label: "Phê duyệt", icon: <CheckCircleOutlined /> },
            { value: 2, label: "Từ chối", icon: <CloseCircleOutlined /> },
          ]}
        />
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
              onClick={() => window.open(`/jobs/${record.slug}`, "_blank")}
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
        {/* Header */}
        <Flex align="center" justify="space-between">
          <Flex align="center" gap="small">
            <Title level={4} style={{ margin: 0 }}>
              Quản lý tin tuyển dụng
            </Title>
            <Tag color="blue" icon={<FireOutlined />}>
              {jobList?.length || 0} tin tuyển dụng
            </Tag>
          </Flex>
        </Flex>

        {/* Bộ lọc */}
        <Flex gap="middle" style={{ marginBottom: 16 }}>
          <Input
            placeholder="Tìm kiếm tin tuyển dụng..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 300 }}
          />

          <Select
            placeholder="Trạng thái duyệt"
            allowClear
            onChange={(value) => setApprovalStatus(value)}
            style={{ width: 200 }}
          >
            <Option value={1}>Chờ duyệt</Option>
            <Option value={3}>Phê duyệt</Option>
            <Option value={2}>Từ chối</Option>
          </Select>

          <Select
            placeholder="Trạng thái tuyển dụng"
            allowClear
            onChange={(value) => setRecruitmentStatus(value)}
            style={{ width: 200 }}
          >
            <Option value={1}>Còn hạn</Option>
            <Option value={0}>Hết hạn</Option>
          </Select>
        </Flex>

        {/* Bảng dữ liệu */}
        <Table columns={columns} dataSource={jobList} rowKey="id" loading={tableLoading} />

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
