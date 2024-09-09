import React, { useRef, useState } from "react";

import {
  SearchOutlined,
  UserAddOutlined,
  EditOutlined,
  DeleteFilled,
  CheckCircleOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Badge,
  Button,
  Flex,
  Image,
  Input,
  message,
  Popconfirm,
  Space,
  Spin,
  Table,
  Tag,
  Tooltip,
} from "antd";
import Highlighter from "react-highlight-words";

import { Link } from "react-router-dom";
import { BASE_URL } from "../../Config/config";
import useFetch from "../../hooks/useFetch";

const Users = () => {
  const { data: user, isLoading } = useFetch(`${BASE_URL}/users`);

  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Tìm kiếm
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#0577fb" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
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

  const cancel = (e) => {
    console.log(e);
    message.error("Xoá thất bại");
  };

  const handleDeleteUser = async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/users/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        message.success("Xóa thành công");
        setTimeout(() => {
          window.location.reload();
        }, 600);
      }
    } catch (error) {
      console.error("Xóa thất bại:", error);
    }
  };

  const columns = [
    {
      title: "Tên",
      key: "name",
      width: "40%",
      ...getColumnSearchProps("name"),
      render: (record) => (
        <>
          <Avatar
            shape="square"
            size="large"
            src={<Image width={40} src={record.avatar} />}
            style={{ marginRight: "10px" }}
          />
          <Link to={`/users/edit/${record.id}`}>
            <b>{record.name}</b>
          </Link>
        </>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: "20%",
    },

    {
      title: "Tình trạng",
      key: "status",
      render: (record) => (
        <>
          {record.status === "active" ? (
            <>
              <Badge status="success" text="H.Động" />
            </>
          ) : (
            <Badge status="error" text="Khoá" />
          )}
        </>
      ),
    },
    {
      title: "Hành động",
      dataIndex: "",
      key: "x",
      width: "15%",

      render: (record) => (
        <>
          <Space.Compact block>
            <Tooltip title="Sửa">
              <Button>
                <Link to={`/users/edit/${record.id}`}>
                  <EditOutlined />
                </Link>
              </Button>
            </Tooltip>
            <Tooltip title="Xoá">
              <Popconfirm
                title="Xoá tài khoản"
                description="Xác nhận xoá tài khoản này?"
                onConfirm={() => handleDeleteUser(record.id)}
                onCancel={cancel}
                okText="Xoá"
                cancelText="Bỏ"
              >
                <Button danger>
                  <DeleteFilled />
                </Button>
              </Popconfirm>
            </Tooltip>
          </Space.Compact>
        </>
      ),
    },
  ];

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const start = (e) => {
    setLoading(true);
    // ajax request after empty completing
    setTimeout(() => {
      setSelectedRowKeys([]);
      setLoading(false);
    }, 1000);
  };
  const onSelectChange = (newSelectedRowKeys) => {
    console.log("selectedRowKeys changed: ", newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const hasSelected = selectedRowKeys.length > 0;
  return (
    <Flex gap="middle" vertical>
      <Flex align="center" gap="small">
        <h1 style={{ margin: 0 }}>Quản lý người dùng</h1>
        <span>
          <Tag icon={<CheckCircleOutlined />} color="success">
            {user.length} Người
          </Tag>
        </span>
      </Flex>
      <Flex align="center" gap="middle" justify="space-between">
        <Button type="primary">
          <Link to="/users/add">
            Thêm mới <UserAddOutlined />
          </Link>
        </Button>
        {hasSelected && (
          <div>
            <Button
              type="primary"
              danger
              onClick={start}
              disabled={!hasSelected}
              loading={loading}
            >
              Xoá
            </Button>
            {"  "}
            Đã chọn {selectedRowKeys.length} người dùng
          </div>
        )}
      </Flex>

      {!isLoading ? (
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={user}
          rowKey="id"
        />
      ) : (
        <Spin size="large" />
      )}
    </Flex>
  );
};
export default Users;
