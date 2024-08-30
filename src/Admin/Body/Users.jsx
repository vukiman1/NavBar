import React, { useRef, useState } from "react";
import { SearchOutlined, UserAddOutlined } from "@ant-design/icons";
import {
  Avatar,
  Badge,
  Button,
  Flex,
  Input,
  message,
  Popconfirm,
  Space,
  Spin,
  Table,
} from "antd";
import Highlighter from "react-highlight-words";

import { Link } from "react-router-dom";
import { BASE_URL } from "../../Config/config";
import useFetch from "../../hooks/useFetch";

const Users = () => {
  const { data: user, isLoading } = useFetch(`${BASE_URL}/users`);
  console.log(user, isLoading);

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
            Search
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
          color: filtered ? "#1677ff" : undefined,
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
        message.success("Xóa thành công").then(() => {
          window.location.reload();
        });
      }
    } catch (error) {
      console.error("Xóa thất bại:", error);
    }
  };

  const columns = [
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
      width: "10%",
      ...getColumnSearchProps("name"),
    },
    {
      title: "Ảnh",
      key: "avatar",
      width: "10%",

      render: (record) => (
        <>
          <Avatar src={<img src={record.avatar} alt="avatar" />} />
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
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Tình trạng",
      key: "status",
      render: (record) => (
        <>
          {record.status === "active" ? (
            <>
              <Badge status="success" text="Active" />
            </>
          ) : (
            <Badge status="warning" text="Disabled" />
          )}
        </>
      ),
    },
    {
      title: "",
      dataIndex: "",
      key: "x",
      render: (record) => (
        <>
          <Link to={`/users/edit/${record.name}`}>Sửa</Link>
          <Popconfirm
            title="Xoá tài khoản"
            description="Xác nhận xoá tài khoản này?"
            onConfirm={() => handleDeleteUser(record.id)}
            onCancel={cancel}
            okText="Xoá"
            cancelText="Bỏ"
          >
            <Button type="link" danger>
              Xoá
            </Button>
          </Popconfirm>
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
