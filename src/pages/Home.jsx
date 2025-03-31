import React, { useState } from "react";
import { Card, Col, Row, Statistic, Typography, Select, DatePicker, List, Badge } from "antd";
import {
  FileTextTwoTone,
  UserAddOutlined,
  ShopTwoTone,
  UsergroupAddTwoTone,
  BarChartOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import moment from "moment";
import "./Home.css"; // File CSS tùy chỉnh

const { Title } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

function Home() {
  const [dateRange, setDateRange] = useState(null);
  const [industryFilter, setIndustryFilter] = useState("all");

  // Dữ liệu mẫu
  const jobs = [
    { id: 1, title: "Frontend Developer", industry: "CNTT", status: "open", createAt: "2025-03-01" },
    { id: 2, title: "Backend Developer", industry: "CNTT", status: "closed", createAt: "2025-02-15" },
    { id: 3, title: "Data Engineer", industry: "CNTT", status: "open", createAt: "2025-03-10" },
    { id: 4, title: "UI/UX Designer", industry: "Thiết kế", status: "expired", createAt: "2025-01-20" },
    { id: 5, title: "Marketing Manager", industry: "Marketing", status: "open", createAt: "2025-03-15" },
  ];

  const candidates = [
    { id: 1, name: "Nguyen Van A", appliedIndustry: "CNTT", status: "accepted", createAt: "2025-03-30T10:00:00.000Z" },
    { id: 2, name: "Tran Thi B", appliedIndustry: "CNTT", status: "pending", createAt: "2025-03-30T12:00:00.000Z" },
    { id: 3, name: "Le Van C", appliedIndustry: "Marketing", status: "rejected", createAt: "2025-03-29T09:00:00.000Z" },
    { id: 4, name: "Pham Thi D", appliedIndustry: "Thiết kế", status: "accepted", createAt: "2025-03-28T14:00:00.000Z" },
  ];

  const companies = [
    { id: 1, name: "FPT Software", industry: "CNTT", createAt: "2025-03-01" },
    { id: 2, name: "VNG Corporation", industry: "CNTT", createAt: "2025-03-15" },
    { id: 3, name: "Tiki", industry: "Thương mại", createAt: "2025-02-20" },
  ];

  const users = [
    { id: 1, email: "user1@example.com", isActive: true, createAt: "2025-01-10", lastLogin: "2025-03-30" },
    { id: 2, email: "user2@example.com", isActive: false, createAt: "2025-02-05", lastLogin: "2025-03-25" },
    { id: 3, email: "user3@example.com", isActive: true, createAt: "2025-03-01", lastLogin: "2025-03-29" },
    { id: 4, email: "user4@example.com", isActive: true, createAt: "2025-03-15", lastLogin: "2025-03-30" },
  ];

  const pageViews = [
    { date: "27/03", views: 120 },
    { date: "28/03", views: 150 },
    { date: "29/03", views: 200 },
    { date: "30/03", views: 180 },
  ];

  const notifications = [
    { id: 1, message: "Công việc 'Frontend Developer' vừa được đăng", time: "2025-03-30T09:00:00.000Z" },
    { id: 2, message: "Ứng viên 'Nguyen Van A' ứng tuyển vào 'CNTT'", time: "2025-03-30T10:00:00.000Z" },
    { id: 3, message: "Công ty 'Tiki' vừa đăng ký", time: "2025-03-29T15:00:00.000Z" },
  ];

  // Dữ liệu mẫu cho biểu đồ
  const jobPostingData = [
    { month: "Tháng 1", "CNTT": 10, "Thiết kế": 5, "Marketing": 2 },
    { month: "Tháng 2", "CNTT": 15, "Thiết kế": 8, "Marketing": 3 },
    { month: "Tháng 3", "CNTT": 25, "Thiết kế": 10, "Marketing": 5 },
  ];

  const candidateTrendData = [
    { date: "27/03", "CNTT": 3, "Thiết kế": 1, "Marketing": 1 },
    { date: "28/03", "CNTT": 5, "Thiết kế": 2, "Marketing": 2 },
    { date: "29/03", "CNTT": 8, "Thiết kế": 3, "Marketing": 4 },
    { date: "30/03", "CNTT": 10, "Thiết kế": 4, "Marketing": 5 },
  ];

  const jobStatusData = [
    { name: "Đang mở", value: jobs.filter(j => j.status === "open").length },
    { name: "Đã đóng", value: jobs.filter(j => j.status === "closed").length },
    { name: "Hết hạn", value: jobs.filter(j => j.status === "expired").length },
  ];

  const industryDemandData = [
    { name: "CNTT", value: candidates.filter(c => c.appliedIndustry === "CNTT").length },
    { name: "Thiết kế", value: candidates.filter(c => c.appliedIndustry === "Thiết kế").length },
    { name: "Marketing", value: candidates.filter(c => c.appliedIndustry === "Marketing").length },
    { name: "Thương mại", value: candidates.filter(c => c.appliedIndustry === "Thương mại").length },
  ];

  const userRegistrationData = [
    { month: "Tháng 1", users: 5 },
    { month: "Tháng 2", users: 8 },
    { month: "Tháng 3", users: 15 },
  ];

  const applicationSuccessData = [
    { name: "Thành công", value: candidates.filter(c => c.status === "accepted").length },
    { name: "Đang chờ", value: candidates.filter(c => c.status === "pending").length },
    { name: "Bị từ chối", value: candidates.filter(c => c.status === "rejected").length },
  ];

  const COLORS = ["#1890ff", "#52c41a", "#ff4d4f", "#fa8c16", "#722ed1"];

  // Thống kê
  const stats = [
    { title: "Công việc đang mở", value: jobs.filter(job => job.status === "open").length, icon: <FileTextTwoTone style={{ fontSize: "32px" }} />, color: "#1890ff" },
    { title: "Ứng viên mới hôm nay", value: candidates.filter(c => new Date(c.createAt).toDateString() === new Date().toDateString()).length, icon: <UserAddOutlined style={{ fontSize: "32px", color: "#52c41a" }} />, color: "#52c41a" },
    { title: "Công ty đăng ký", value: companies.length, icon: <ShopTwoTone style={{ fontSize: "32px" }} />, color: "#fa8c16" },
    { title: "Người dùng hoạt động", value: users.filter(user => user.isActive).length, icon: <ShopTwoTone style={{ fontSize: "32px" }} />, color: "#722ed1" },
  ];

  // Hàm lọc dữ liệu theo thời gian
  const filterByDateRange = (dates, data, key) => {
    if (!dates) return data;
    const [start, end] = dates;
    return data.filter(item => moment(item[key]).isBetween(start, end, null, "[]"));
  };

  return (
    <div style={{ padding: "24px", maxWidth: "1400px", margin: "0 auto" }}>
      <Title level={2} style={{ marginBottom: "24px" }}>Dashboard Tuyển Dụng</Title>

      {/* Bộ lọc */}
      <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
        <Col><RangePicker format="DD/MM/YYYY" onChange={setDateRange} /></Col>
        <Col>
          <Select defaultValue="all" style={{ width: 200 }} onChange={setIndustryFilter}>
            <Option value="all">Tất cả ngành nghề</Option>
            <Option value="CNTT">CNTT</Option>
            <Option value="Thiết kế">Thiết kế</Option>
            <Option value="Marketing">Marketing</Option>
            <Option value="Thương mại">Thương mại</Option>
          </Select>
        </Col>
      </Row>

      {/* Thẻ thống kê */}
      <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
        {stats.map((stat, index) => (
          <Col xs={24} sm={12} md={6} key={index}>
            <Card hoverable bordered={false} style={{ borderRadius: "8px", textAlign: "center", padding: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Statistic title={stat.title} value={stat.value} valueStyle={{ color: stat.color }} />
                {stat.icon}
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Biểu đồ */}
      <Row gutter={[16, 16]}>
        {/* Xu hướng đăng việc theo ngành nghề */}
        <Col xs={24} md={12}>
          <Card title="Xu hướng đăng việc theo ngành nghề" bordered={false} style={{ borderRadius: "8px" }}>
            <BarChart width={500} height={300} data={jobPostingData} style={{ margin: "0 auto" }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => `${value} công việc`} />
              <Legend />
              <Bar dataKey="CNTT" fill="#1890ff" name="CNTT" />
              <Bar dataKey="Thiết kế" fill="#52c41a" name="Thiết kế" />
              <Bar dataKey="Marketing" fill="#ff4d4f" name="Marketing" />
            </BarChart>
          </Card>
        </Col>

        {/* Xu hướng ứng viên theo ngành nghề */}
        <Col xs={24} md={12}>
          <Card title="Xu hướng ứng viên theo ngành nghề" bordered={false} style={{ borderRadius: "8px" }}>
            <LineChart width={500} height={300} data={candidateTrendData} style={{ margin: "0 auto" }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value) => `${value} ứng viên`} />
              <Legend />
              <Line type="monotone" dataKey="CNTT" stroke="#1890ff" name="CNTT" />
              <Line type="monotone" dataKey="Thiết kế" stroke="#52c41a" name="Thiết kế" />
              <Line type="monotone" dataKey="Marketing" stroke="#ff4d4f" name="Marketing" />
            </LineChart>
          </Card>
        </Col>

        {/* Số người đăng ký theo tháng */}
        <Col xs={24} md={12}>
          <Card title="Số người đăng ký theo tháng" bordered={false} style={{ borderRadius: "8px" }}>
            <BarChart width={500} height={300} data={userRegistrationData} style={{ margin: "0 auto" }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => `${value} người dùng`} />
              <Legend />
              <Bar dataKey="users" fill="#722ed1" />
            </BarChart>
          </Card>
        </Col>

        {/* Lượt truy cập trang web */}
        <Col xs={24} md={12}>
          <Card title="Lượt truy cập trang web" bordered={false} style={{ borderRadius: "8px" }}>
            <LineChart width={500} height={300} data={pageViews} style={{ margin: "0 auto" }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value) => `${value} lượt xem`} />
              <Legend />
              <Line type="monotone" dataKey="views" stroke="#fa8c16" />
            </LineChart>
          </Card>
        </Col>

        {/* Phân bố trạng thái công việc */}
        <Col xs={24} md={12}>
          <Card title="Phân bố trạng thái công việc" bordered={false} style={{ borderRadius: "8px" }}>
            <PieChart width={500} height={300} style={{ margin: "0 auto" }}>
              <Pie data={jobStatusData} cx="50%" cy="50%" outerRadius={100} fill="#8884d8" dataKey="value" label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}>
                {jobStatusData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(value) => `${value} công việc`} />
              <Legend />
            </PieChart>
          </Card>
        </Col>

        {/* Nhu cầu ngành nghề của ứng viên */}
        <Col xs={24} md={12}>
          <Card title="Nhu cầu ngành nghề của ứng viên" bordered={false} style={{ borderRadius: "8px" }}>
            <PieChart width={500} height={300} style={{ margin: "0 auto" }}>
              <Pie data={industryDemandData} cx="50%" cy="50%" outerRadius={100} fill="#8884d8" dataKey="value" label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}>
                {industryDemandData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(value) => `${value} ứng viên`} />
              <Legend />
            </PieChart>
          </Card>
        </Col>

        {/* Tỷ lệ ứng tuyển thành công */}
        <Col xs={24} md={12}>
          <Card title="Tỷ lệ ứng tuyển thành công" bordered={false} style={{ borderRadius: "8px" }}>
            <PieChart width={500} height={300} style={{ margin: "0 auto" }}>
              <Pie data={applicationSuccessData} cx="50%" cy="50%" outerRadius={100} fill="#8884d8" dataKey="value" label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}>
                {applicationSuccessData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(value) => `${value} ứng viên`} />
              <Legend />
            </PieChart>
          </Card>
        </Col>

        {/* Thông báo */}
        <Col xs={24} md={12}>
          <Card title="Thông báo mới" bordered={false} style={{ borderRadius: "8px" }}>
            <List
              dataSource={notifications}
              renderItem={item => (
                <List.Item>
                  <Badge status="processing" />
                  <span>{item.message} - <small>{moment(item.time).fromNow()}</small></span>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Home;