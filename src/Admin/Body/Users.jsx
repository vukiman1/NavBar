import React, { useEffect, useState } from "react";
import {
  SearchOutlined,
  UserAddOutlined,
  EditOutlined,
  DeleteFilled,
  ReloadOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Card,
  Input,
  message,
  Popconfirm,
  Space,
  Spin,
  Table,
  Tag,
  Tooltip,
  Typography,
  Select,
  theme,
} from "antd";
import { Link } from "react-router-dom";
import * as XLSX from "xlsx";
import userService from "../../services/userService";

const { Title, Text } = Typography;
const { Option } = Select;

const Users = () => {
  const [userList, setUserList] = useState([]);
  const [filteredUserList, setFilteredUserList] = useState([]);
  const [tableLoading, setTableLoading] = useState(false);

  // State cho thanh tìm kiếm & bộ lọc
  const [globalSearch, setGlobalSearch] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [filterActive, setFilterActive] = useState("");
  const [filterEmailVerified, setFilterEmailVerified] = useState("");

  useEffect(() => {
    loadUserList();
  }, []);

  const loadUserList = async () => {
    setTableLoading(true);
    try {
      const resData = await userService.getUserList();
      setUserList(resData.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setTableLoading(false);
    }
  };

  // Lọc danh sách người dùng dựa trên tìm kiếm và các bộ lọc
  useEffect(() => {
    let filtered = [...userList];

    if (globalSearch) {
      filtered = filtered.filter(
        (user) =>
          user.fullName.toLowerCase().includes(globalSearch.toLowerCase()) ||
          user.email.toLowerCase().includes(globalSearch.toLowerCase())
      );
    }

    if (filterRole) {
      filtered = filtered.filter((user) => user.roleName === filterRole);
    }

    if (filterActive !== "") {
      const isActive = filterActive === "active";
      filtered = filtered.filter((user) => user.isActive === isActive);
    }

    if (filterEmailVerified !== "") {
      const isVerified = filterEmailVerified === "verified";
      filtered = filtered.filter((user) => user.isEmailVerified === isVerified);
    }

    setFilteredUserList(filtered);
  }, [userList, globalSearch, filterRole, filterActive, filterEmailVerified]);

  const handleExportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredUserList.map((item) => ({
        ID: item.id,
        "Tên đầy đủ": item.fullName,
        Email: item.email,
        "Trạng thái": item.isActive ? "Hoạt động" : "Khoá",
        "Xác nhận Email": item.isEmailVerified ? "Đã xác nhận" : "Chưa xác nhận",
        Role: item.roleName,
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
    XLSX.writeFile(workbook, "users.xlsx");
    message.success("Xuất file Excel thành công");
  };

  const handleDeleteUser = async (id) => {
    try {
      await userService.deleteUser(id);
      message.success("Xóa người dùng thành công");
      loadUserList();
    } catch (error) {
      message.error("Xóa người dùng thất bại");
    }
  };

  const columns = [
    {
      title: "Tên",
      key: "name",
      width: "25%",
      render: (record) => (
        <Space>
          <Avatar size={40} src={record.avatarUrl} />
          <Link to={`/users/edit/${record.id}`}>
            <Text strong>{record.fullName}</Text>
          </Link>
        </Space>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: "20%",
    },
    {
      title: "Role",
      dataIndex: "roleName",
      key: "roleName",
      width: "15%",
      filters: [
        { text: "Ứng viên", value: "JOB_SEEKER" },
        { text: "Nhà tuyển dụng", value: "EMPLOYER" },
      ],
      onFilter: (value, record) => record.roleName === value,
      render: (role) => <Tag color={role === "JOB_SEEKER" ? "blue" : "green"}>{role}</Tag>,
    },
    {
      title: "Trạng thái",
      key: "status",
      width: "10%",
      filters: [
        { text: "Hoạt động", value: true },
        { text: "Khoá", value: false },
      ],
      onFilter: (value, record) => record.isActive === value,
      render: (record) => (
        <Tag color={record.isActive ? "success" : "error"}>
          {record.isActive ? "Hoạt động" : "Khoá"}
        </Tag>
      ),
    },
    {
      title: "Xác nhận Email",
      key: "isVerifyEmail",
      width: "15%",
      filters: [
        { text: "Đã xác nhận", value: true },
        { text: "Chưa xác nhận", value: false },
      ],
      onFilter: (value, record) => record.isVerifyEmail === value,
      render: (record) => (
        <Tag color={record.isVerifyEmail ? "blue" : "warning"}>
          {record.isVerifyEmail ? "Đã xác nhận" : "Chưa xác nhận"}
        </Tag>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      width: "15%",
      render: (record) => (
        <Space>
          <Tooltip title="Chỉnh sửa">
          <Link to={`/users/edit/${record.id}`}>
          <Button type="primary" ghost icon={<EditOutlined />}/>
          </Link>
          </Tooltip>
          <Tooltip title="Xoá người dùng">
            <Popconfirm
              title="Xoá người dùng?"
              description="Bạn có chắc chắn muốn xoá người dùng này?"
              onConfirm={() => handleDeleteUser(record.id)}
              okText="Xoá"
              cancelText="Huỷ"
              placement="left"
              okButtonProps={{ danger: true }}
            >
              <Button danger icon={<DeleteFilled />} />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <Card bodyStyle={{ padding: 24 }}>
      <Space direction="vertical" style={{ width: "100%" }} size="middle">
        {/* Header và các thao tác chung */}
        <Space style={{ justifyContent: "space-between", width: "100%" }}>
          <Title level={4}>Quản lý người dùng</Title>
          <Space>
            <Button icon={<ReloadOutlined />} onClick={loadUserList} />
            <Button icon={<DownloadOutlined />} onClick={handleExportExcel} />
            <Button type="primary">
              <Link to="/users/add">
                <Space>
                  Thêm mới <UserAddOutlined />
                </Space>
              </Link>
            </Button>
          </Space>
        </Space>

        {/* Thanh tìm kiếm và bộ lọc */}
        <Space style={{ flexWrap: "wrap" }} size="middle">
          <Input
            placeholder="Tìm kiếm theo tên hoặc email..."
            prefix={<SearchOutlined />}
            allowClear
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            style={{ width: 300 }}
          />
          <Select
            placeholder="Lọc theo Role"
            allowClear
            value={filterRole || undefined}
            onChange={(value) => setFilterRole(value)}
            style={{ width: 200 }}
          >
            <Option value="JOB_SEEKER">Ứng viên</Option>
            <Option value="EMPLOYER">Nhà tuyển dụng</Option>
          </Select>
          <Select
            placeholder="Lọc trạng thái"
            allowClear
            value={filterActive || undefined}
            onChange={(value) => setFilterActive(value)}
            style={{ width: 200 }}
          >
            <Option value="active">Hoạt động</Option>
            <Option value="inactive">Khoá</Option>
          </Select>
          <Select
            placeholder="Lọc xác nhận Email"
            allowClear
            value={filterEmailVerified || undefined}
            onChange={(value) => setFilterEmailVerified(value)}
            style={{ width: 200 }}
          >
            <Option value="verified">Đã xác nhận</Option>
            <Option value="unverified">Chưa xác nhận</Option>
          </Select>
        </Space>

        {/* Bảng danh sách */}
        {tableLoading ? (
          <Spin size="large" style={{ display: "block", marginTop: 50 }} />
        ) : (
          <Table
            columns={columns}
            dataSource={filteredUserList}
            rowKey="id"
            pagination={{
              defaultPageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Tổng cộng ${total} người dùng`,
              showQuickJumper: true,
            }}
          />
        )}
      </Space>
    </Card>
  );
};

export default Users;
