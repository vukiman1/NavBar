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
  Input,
  Select,
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
  SearchOutlined,
  FilterOutlined
} from "@ant-design/icons";
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;

const Company = () => {
  const [companyList, setCompanyList] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [tableLoading, setTableLoading] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  
  const [searchText, setSearchText] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [sizeFilter, setSizeFilter] = useState("");
  const [taxFilter, setTaxFilter] = useState("");

  const loadCompanyList = async () => {
    setTableLoading(true);
    try {
      const resData = await companyService.getAllCompany();
      setCompanyList(resData);
      setFilteredCompanies(resData);
    } catch (error) {
      message.error("Không thể tải danh sách công ty");
    } finally {
      setTableLoading(false);
    }
  };

  useEffect(() => {
    loadCompanyList();
  }, []);

  // Xử lý tìm kiếm & bộ lọc
  useEffect(() => {
    let filtered = companyList;
    
    if (searchText) {
      filtered = filtered.filter(company =>
        company.companyName.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (cityFilter) {
      filtered = filtered.filter(company =>
        company.location?.city === cityFilter
      );
    }

    if (sizeFilter) {
      filtered = filtered.filter(company =>
        company.employeeSize === sizeFilter
      );
    }

    if (taxFilter) {
      filtered = filtered.filter(company =>
        company.taxCode.includes(taxFilter)
      );
    }

    setFilteredCompanies(filtered);
  }, [searchText, cityFilter, sizeFilter, taxFilter, companyList]);

  const handleDelete = async (id) => {
    try {
      await companyService.deleteCompany(id);
      message.success("Xóa công ty thành công");
      setIsDeleteModalVisible(false);
      loadCompanyList();
    } catch (error) {
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
          <Avatar size={64} src={record.companyImageUrl} shape="square" />
          <Space direction="vertical">
            <Link to={`/company/edit/${record.id}`}>
              <Text strong>{record.companyName}</Text>
            </Link>
            <Text type="secondary"><BankOutlined /> {record.fieldOperation}</Text>
            <Text type="secondary"><TeamOutlined /> {record.employeeSize} nhân viên</Text>
          </Space>
        </Space>
      ),
    },
    {
      title: "Liên hệ",
      key: "contact",
      render: (_, record) => (
        <Space direction="vertical">
          <Text><MailOutlined /> {record.companyEmail}</Text>
          <Text><PhoneOutlined /> {record.companyPhone}</Text>
          <Text><GlobalOutlined /> {record.websiteUrl}</Text>
        </Space>
      ),
    },
    {
      title: "Địa chỉ",
      key: "location",
      render: (_, record) => (
        <Text><EnvironmentOutlined /> {record.location?.address}</Text>
      ),
    },
    {
      title: "Thành lập",
      dataIndex: "since",
      key: "since",
      render: (since) => (
        <Text><CalendarOutlined /> {dayjs(since).format("DD/MM/YYYY")}</Text>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      width: 150,
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Xem chi tiết">
            <Button icon={<EyeOutlined />} type="link" onClick={() => showCompanyDetails(record)} />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Link to={`/company/edit/${record.id}`}>
              <Button icon={<EditOutlined />} type="link" />
            </Link>
          </Tooltip>
          <Tooltip title="Xóa">
            <Button type="link" danger icon={<DeleteOutlined />}
              onClick={() => { setSelectedCompany(record); setIsDeleteModalVisible(true); }} />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <Card>
      <Flex vertical gap="middle">
        {/* Header với Tìm kiếm & Bộ lọc */}
        <Flex justify="space-between" align="center">
          <Flex align="center" gap="small">
            <Title level={4}>Quản lý công ty</Title>
            <Tag color="blue" icon={<FireOutlined />}>{filteredCompanies.length} công ty</Tag>
          </Flex>
          <Link to="/company/add">
            <Button type="primary">Thêm công ty mới</Button>
          </Link>
        </Flex>

        {/* Thanh tìm kiếm và bộ lọc */}
        <Flex gap="middle">
          <Input
            placeholder="Tìm kiếm công ty..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
          />
          <Select placeholder="Thành phố" allowClear onChange={setCityFilter}>
            <Option value="Hà Nội">Hà Nội</Option>
            <Option value="Hồ Chí Minh">Hồ Chí Minh</Option>
            <Option value="Đà Nẵng">Đà Nẵng</Option>
          </Select>
          <Select placeholder="Quy mô" allowClear onChange={setSizeFilter}>
            <Option value="10-50">10-50</Option>
            <Option value="50-200">50-200</Option>
            <Option value="200-500">200-500</Option>
          </Select>
          <Input
            placeholder="Mã số thuế"
            value={taxFilter}
            onChange={(e) => setTaxFilter(e.target.value)}
            allowClear
          />
        </Flex>

        {/* Bảng hiển thị danh sách công ty */}
        <Table
          loading={tableLoading}
          columns={columns}
          dataSource={filteredCompanies}
          rowKey="id"
          pagination={{
            defaultPageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Tổng cộng ${total} công ty`,
          }}
        />
      </Flex>
    </Card>
  );
};

export default Company;
