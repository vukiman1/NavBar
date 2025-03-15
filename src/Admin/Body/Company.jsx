import React, { useEffect, useState } from 'react';
import companyService from '../../services/companyService';
import {
  Card,
  Flex,
  message,
  Tag,
  Typography,
  Table,
  Space,
  Button,
  Avatar,
  Tooltip,
  Modal,
  Descriptions,
  Image,
} from 'antd';
import {
  FireOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  GlobalOutlined,
  EnvironmentOutlined,
  TeamOutlined,
  CalendarOutlined,
  PhoneOutlined,
  MailOutlined,
  BankOutlined,
} from "@ant-design/icons";
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

const Company = () => {
  const [companyList, setCompanyList] = useState([]);
  const [tableLoading, setTableLoading] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  const loadCompanyList = async () => {
    setTableLoading(true);
    try {
      const resData = await companyService.getAllCompany();
      setCompanyList(resData);
    } catch (error) {
      console.error("Error fetching companies:", error);
      message.error("Không thể tải danh sách công ty");
    } finally {
      setTableLoading(false);
    }
  };

  useEffect(() => {
    loadCompanyList();
  }, []);

  const handleDelete = async (id) => {
    try {
      await companyService.deleteCompany(id);
      message.success("Xóa công ty thành công");
      setIsDeleteModalVisible(false);
      loadCompanyList();
    } catch (error) {
      console.error("Error deleting company:", error);
      message.error("Không thể xóa công ty");
    }
  };

  const showCompanyDetails = (company) => {
    setSelectedCompany(company);
    setIsModalVisible(true);
  };

  const columns = [
    {
      title: "Công ty",
      dataIndex: "companyName",
      key: "companyName",
      render: (_, record) => (
        <Space size="middle" align="start">
          <Avatar
            size={64}
            src={record.companyImageUrl}
            shape="square"
            style={{ 
              backgroundColor: '#f5f5f5',
              border: '1px solid #d9d9d9'
            }}
          />
          <Space direction="vertical" size={0}>
            <Link to={`/company/edit/${record.id}`}>
              <Text strong>{record.companyName}</Text>
            </Link>
            <Text type="secondary">
              <BankOutlined /> {record.fieldOperation}
            </Text>
            <Text type="secondary">
              <TeamOutlined /> {record.employeeSize} nhân viên
            </Text>
          </Space>
        </Space>
      ),
    },
    {
      title: "Liên hệ",
      key: "contact",
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Text>
            <MailOutlined /> {record.companyEmail}
          </Text>
          <Text>
            <PhoneOutlined /> {record.companyPhone}
          </Text>
          <Text>
            <GlobalOutlined /> {record.websiteUrl}
          </Text>
        </Space>
      ),
    },
    {
      title: "Địa chỉ",
      key: "location",
      render: (_, record) => (
        <Text>
          <EnvironmentOutlined /> {record.location?.address}
        </Text>
      ),
    },
    {
      title: "Thành lập",
      dataIndex: "since",
      key: "since",
      render: (since) => (
        <Text>
          <CalendarOutlined /> {dayjs(since).format("DD/MM/YYYY")}
        </Text>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      width: 150,
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Xem chi tiết">
            <Button
              icon={<EyeOutlined />}
              type="link"
              onClick={() => showCompanyDetails(record)}
            />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Link to={`/company/edit/${record.id}`}>
              <Button
                icon={<EditOutlined />}
                type="link"
              />
            </Link>
          </Tooltip>
          <Tooltip title="Xóa">
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
              onClick={() => {
                setSelectedCompany(record);
                setIsDeleteModalVisible(true);
              }}
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
              Quản lý công ty
            </Title>
            <Tag color="blue" icon={<FireOutlined />}>
              {companyList?.length || 0} công ty
            </Tag>
          </Flex>
          <Link to="/company/add">
            <Button type="primary">
              Thêm công ty mới
            </Button>
          </Link>
        </Flex>

        <Table
          loading={tableLoading}
          columns={columns}
          dataSource={companyList}
          rowKey="id"
          pagination={{
            defaultPageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Tổng cộng ${total} công ty`,
          }}
        />

        <Modal
          title="Chi tiết công ty"
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
          width={800}
        >
          {selectedCompany && (
            <Flex vertical gap="middle">
              <Flex gap="middle">
                <Image
                  width={200}
                  src={selectedCompany.companyImageUrl}
                  fallback="data:image/png;base64,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"
                />
                <Descriptions column={1}>
                  <Descriptions.Item label="Tên công ty">
                    {selectedCompany.companyName}
                  </Descriptions.Item>
                  <Descriptions.Item label="Lĩnh vực">
                    {selectedCompany.fieldOperation}
                  </Descriptions.Item>
                  <Descriptions.Item label="Quy mô">
                    {selectedCompany.employeeSize} nhân viên
                  </Descriptions.Item>
                  <Descriptions.Item label="Mã số thuế">
                    {selectedCompany.taxCode}
                  </Descriptions.Item>
                  <Descriptions.Item label="Thành lập">
                    {dayjs(selectedCompany.since).format("DD/MM/YYYY")}
                  </Descriptions.Item>
                </Descriptions>
              </Flex>
              <Descriptions title="Thông tin liên hệ" column={1}>
                <Descriptions.Item label="Email">
                  {selectedCompany.companyEmail}
                </Descriptions.Item>
                <Descriptions.Item label="Số điện thoại">
                  {selectedCompany.companyPhone}
                </Descriptions.Item>
                <Descriptions.Item label="Website">
                  {selectedCompany.websiteUrl}
                </Descriptions.Item>
                <Descriptions.Item label="Địa chỉ">
                  {selectedCompany.location?.address}
                </Descriptions.Item>
              </Descriptions>
            </Flex>
          )}
        </Modal>

        <Modal
          title="Xác nhận xóa"
          open={isDeleteModalVisible}
          onOk={() => handleDelete(selectedCompany?.id)}
          onCancel={() => setIsDeleteModalVisible(false)}
          okText="Xóa"
          cancelText="Hủy"
        >
          <p>Bạn có chắc chắn muốn xóa công ty này?</p>
        </Modal>
      </Flex>
    </Card>
  );
};

export default Company;
