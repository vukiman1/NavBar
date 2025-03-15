import React, { useEffect, useRef, useState } from "react";
import {
  SearchOutlined,
  UserAddOutlined,
  EditOutlined,
  DeleteFilled,
  CheckCircleOutlined,
  ReloadOutlined,
  DownloadOutlined,
  FilterOutlined,
  UserSwitchOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Card,
  Dropdown,
  Flex,
  Input,
  message,
  Popconfirm,
  Space,
  Spin,
  Table,
  Tag,
  Tooltip,
  Typography,
  theme,
} from "antd";
import Highlighter from "react-highlight-words";
import { Link } from "react-router-dom";
import { BASE_URL } from "../../Config/config";
import useFetch from "../../hooks/useFetch";
import * as XLSX from 'xlsx';
import userService from "../../services/userService";
// import userService from "../../services/userService";

const { Title, Text } = Typography;
const { useToken } = theme;

const Users = () => {
  const { token } = useToken();
  const { isLoading } = useFetch(`${BASE_URL}/users`);
  const [userList, setUserList] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [tableLoading, setTableLoading] = useState(false);
  const searchInput = useRef(null);
  // const userlist = await userService.getUserList();
  // console.log(userlist);

  useEffect(() => {
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

    loadUserList();
  }, []); // Chỉ gọi 1 lần khi component mount (khi refresh trang)

  useEffect(() => {
    console.log("User List Updated:", userList);
  }, [userList]);



  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const handleExportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(userList.map(item => ({
      'ID': item.id,
      'Tên': item.fullName,
      'Email': item.email,
      'Trạng thái': item.isActive ? 'Hoạt động' : 'Khoá',
      'Role': item.roleName,
      'Tạo vào': item.createAt,
    })));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
    XLSX.writeFile(workbook, "users.xlsx");
    message.success('Xuất file Excel thành công');
  };

  const handleBulkStatusChange = async (status) => {
    setTableLoading(true);
    try {
      const promises = selectedRowKeys.map(id =>
        fetch(`${BASE_URL}/users/${id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        })
      );
      await Promise.all(promises);
      message.success(`Cập nhật trạng thái thành công cho ${selectedRowKeys.length} người dùng`);
      setSelectedRowKeys([]);
      window.location.reload();
    } catch (error) {
      message.error("Cập nhật trạng thái thất bại");
    }
    setTableLoading(false);
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <Card
        size="small"
        style={{
          padding: 12,
          width: 300,
          boxShadow: token.boxShadowSecondary,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Tìm kiếm ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 12,
            display: "block",
          }}
          suffix={
            <Tooltip title="Nhập từ khoá để tìm kiếm">
              <InfoCircleOutlined style={{ color: token.colorTextSecondary }} />
            </Tooltip>
          }
        />
        <Space style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Space>
            <Button
              type="primary"
              onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
              icon={<SearchOutlined />}
              size="small"
            >
              Tìm kiếm
            </Button>
            <Button
              onClick={() => clearFilters && handleReset(clearFilters)}
              size="small"
            >
              Đặt lại
            </Button>
          </Space>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            Đóng
          </Button>
        </Space>
      </Card>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? token.colorPrimary : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex]?.toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const handleDeleteUser = async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/users/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        message.success("Xóa người dùng thành công");
        setTimeout(() => {
          window.location.reload();
        }, 600);
      }
    } catch (error) {
      message.error("Xóa người dùng thất bại");
    }
  };

  const columns = [
    {
      title: "Tên",
      key: "name",
      width: "35%",
      ...getColumnSearchProps("name"),
      render: (record) => (
        <Space>
          <Avatar
            size={40}
            src={record.avatarUrl}
            style={{ 
              backgroundColor: !record.avatarUrl ? token.colorPrimary : undefined,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {!record.avatarUrl && record.fullName?.[0]?.toUpperCase()}
          </Avatar>
          <Link to={`/users/edit/${record.id}`}>
            <Typography.Text strong>{record.fullName}</Typography.Text>
            <br />
            <Typography.Text type="secondary" style={{ fontSize: '12px' }}>
              ID: {record.id}
            </Typography.Text>
          </Link>
        </Space>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: "30%",
      ...getColumnSearchProps("email"),
    },
    {
      title: "Role",
      dataIndex: "roleName",
      key: "roleName",
      width: "30%",
      ...getColumnSearchProps("roleName"),
    },
    {
      title: "Trạng thái",
      key: "status",
      width: "15%",
      filters: [
        { text: "Hoạt động", value: "active" },
        { text: "Khoá", value: "inactive" },
      ],
      onFilter: (value, record) => record.status === value,
      render: (record) => (
        <Tag
          color={record.isActive  ? "success" : "error"}
          icon={record.isActive ? <CheckCircleOutlined /> : <DeleteFilled />}
          style={{ minWidth: 85, textAlign: 'center' }}
        >
          {record.isActive ? "Hoạt động" : "Khoá"}
        </Tag>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      width: "20%",
      render: (record) => (
        <Space>
          <Tooltip title="Chỉnh sửa thông tin">
            <Button type="primary" ghost icon={<EditOutlined />}>
              <Link to={`/users/edit/${record.id}`} />
            </Button>
          </Tooltip>
          <Tooltip title="Xoá người dùng">
            <Popconfirm
              title="Xoá người dùng"
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

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const bulkActionItems = [
    {
      key: 'active',
      label: 'Kích hoạt người dùng',
      icon: <CheckCircleOutlined />,
      onClick: () => handleBulkStatusChange('active')
    },
    {
      key: 'inactive',
      label: 'Khoá người dùng',
      icon: <DeleteFilled />,
      onClick: () => handleBulkStatusChange('inactive')
    }
  ];

  return (
    <Card bodyStyle={{ padding: 24 }}>
      <Flex vertical gap="middle">
        <Flex align="center" justify="space-between">
          <Flex align="center" gap="small">
            <Title level={4} style={{ margin: 0 }}>Quản lý người dùng</Title>
            <Tag icon={<UserSwitchOutlined />} color="blue">
              {userList?.length || 0} người dùng
            </Tag>
          </Flex>
          <Space>
            <Tooltip title="Làm mới danh sách">
              <Button 
                icon={<ReloadOutlined />}
                onClick={() => window.location.reload()}
              />
            </Tooltip>
            <Tooltip title="Xuất danh sách Excel">
              <Button 
                icon={<DownloadOutlined />}
                onClick={handleExportExcel}
              />
            </Tooltip>
            <Button type="primary">
              <Link to="/users/add">
                <Space>
                  Thêm mới
                  <UserAddOutlined />
                </Space>
              </Link>
            </Button>
          </Space>
        </Flex>

        {selectedRowKeys.length > 0 && (
          <Card size="small" style={{ backgroundColor: token.colorBgTextHover }}>
            <Flex align="center" justify="space-between">
              <Text>
                Đã chọn <Text strong>{selectedRowKeys.length}</Text> người dùng
              </Text>
              <Space>
                <Dropdown
                  menu={{ items: bulkActionItems }}
                  placement="bottomRight"
                >
                  <Button icon={<FilterOutlined />}>
                    Thao tác hàng loạt
                  </Button>
                </Dropdown>
              </Space>
            </Flex>
          </Card>
        )}

        {isLoading ? (
          <Flex align="center" justify="center" style={{ minHeight: 400 }}>
            <Spin size="large" />
          </Flex>
        ) : (
          <Table
            rowSelection={rowSelection}
            columns={columns}
            dataSource={userList}
            rowKey="id"
            loading={tableLoading}
            pagination={{
              defaultPageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Tổng cộng ${total} người dùng`,
              showQuickJumper: true,
            }}
          />
        )}
      </Flex>
    </Card>
  );
};

export default Users;
