import React, { useEffect, useState } from "react";
import { Card, Table, Input, Select, Tag, Space, DatePicker, Statistic, Row, Col, Image, message } from "antd";
import { BellOutlined, SearchOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const { Option } = Select;
const { RangePicker } = DatePicker;

function Notification() {
  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  // State cho thanh tìm kiếm và các bộ lọc
  const [globalSearch, setGlobalSearch] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterStatus, setFilterStatus] = useState(""); // "read" hoặc "unread"
  const [dateRange, setDateRange] = useState([]);

  // Load danh sách thông báo từ backend
  const loadNotifications = async () => {
    setLoading(true);
    try {
    //   const data = await notificationService.getAllNotifications(); // Phải trả về mảng các thông báo
    //   setNotifications(data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      message.error("Không thể tải danh sách thông báo");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  // Lọc danh sách thông báo dựa trên tìm kiếm và các bộ lọc
  useEffect(() => {
    let filtered = [...notifications];

    // Tìm kiếm theo tiêu đề hoặc nội dung
    if (globalSearch) {
      filtered = filtered.filter(
        (notif) =>
          notif.title.toLowerCase().includes(globalSearch.toLowerCase()) ||
          notif.message.toLowerCase().includes(globalSearch.toLowerCase())
      );
    }

    // Lọc theo loại thông báo (ví dụ: info, warning, error)
    if (filterType) {
      filtered = filtered.filter((notif) => notif.type === filterType);
    }

    // Lọc theo trạng thái đọc
    if (filterStatus) {
      const isRead = filterStatus === "read";
      filtered = filtered.filter((notif) => notif.read === isRead);
    }

    // Lọc theo khoảng thời gian
    if (dateRange && dateRange.length === 2) {
      const [start, end] = dateRange;
      filtered = filtered.filter((notif) =>
        dayjs(notif.date).isBetween(start, end, null, "[]")
      );
    }

    setFilteredNotifications(filtered);
  }, [notifications, globalSearch, filterType, filterStatus, dateRange]);

  // Thống kê
  const totalNotifications = notifications.length;
  const unreadNotifications = notifications.filter((notif) => !notif.read).length;

  const columns = [
    {
      title: "Hình ảnh",
      dataIndex: "imageUrl",
      key: "imageUrl",
      render: (url) => (
        <Image
          width={50}
          src={url}
          alt="notification"
          placeholder={<Image preview={false} src={url} width={50} />}
        />
      ),
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
      render: (title) => <strong>{title}</strong>,
    },
    {
      title: "Nội dung",
      dataIndex: "message",
      key: "message",
      ellipsis: true,
    },
    {
      title: "Ngày",
      dataIndex: "date",
      key: "date",
      render: (date) => dayjs(date).format("DD/MM/YYYY HH:mm"),
    },
    {
      title: "Trạng thái",
      dataIndex: "read",
      key: "read",
      render: (read) =>
        read ? (
          <Tag color="green">Đã đọc</Tag>
        ) : (
          <Tag color="red">Chưa đọc</Tag>
        ),
    },
  ];

  return (
    <Card title={<><BellOutlined /> Quản lý thông báo</>}>
      {/* Thống kê */}
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col span={8}>
          <Statistic title="Tổng số thông báo" value={totalNotifications} />
        </Col>
        <Col span={8}>
          <Statistic title="Thông báo chưa đọc" value={unreadNotifications} valueStyle={{ color: "#cf1322" }} />
        </Col>
      </Row>

      {/* Thanh tìm kiếm và bộ lọc */}
      <Space style={{ marginBottom: 16 }} size="middle">
        <Input
          placeholder="Tìm kiếm theo tiêu đề hoặc nội dung..."
          prefix={<SearchOutlined />}
          allowClear
          value={globalSearch}
          onChange={(e) => setGlobalSearch(e.target.value)}
          style={{ width: 300 }}
        />
        <Select
          placeholder="Lọc theo loại thông báo"
          allowClear
          value={filterType || undefined}
          onChange={(value) => setFilterType(value)}
          style={{ width: 200 }}
        >
          <Option value="info">Thông tin</Option>
          <Option value="warning">Cảnh báo</Option>
          <Option value="error">Lỗi</Option>
        </Select>
        <Select
          placeholder="Lọc trạng thái"
          allowClear
          value={filterStatus || undefined}
          onChange={(value) => setFilterStatus(value)}
          style={{ width: 200 }}
        >
          <Option value="read">Đã đọc</Option>
          <Option value="unread">Chưa đọc</Option>
        </Select>
        <RangePicker
          placeholder={["Ngày bắt đầu", "Ngày kết thúc"]}
          value={dateRange}
          onChange={(dates) => setDateRange(dates)}
        />
      </Space>

      {/* Danh sách thông báo */}
      <Table
        columns={columns}
        dataSource={filteredNotifications}
        rowKey="id"
        loading={loading}
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Tổng cộng ${total} thông báo`,
        }}
      />
    </Card>
  );
}

export default Notification;
