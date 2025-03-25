import { Card, Flex, Tag, Typography, message, Table, Select, Input } from "antd";
import { FireOutlined, SearchOutlined } from "@ant-design/icons";
import jobService from "../../services/jobService";
import { useEffect, useState } from "react";

const { Title } = Typography;
const { Option } = Select;

const JobseekerList = () => {
  const [jobseekerList, setJobseekerList] = useState([]);
  const [tableLoading, setTableLoading] = useState(false);

  // Bộ lọc
  const [searchText, setSearchText] = useState("");
  const [industry, setIndustry] = useState(null);
  const [experience, setExperience] = useState(null);
  const [level, setLevel] = useState(null);
  const [education, setEducation] = useState(null);
  const [location, setLocation] = useState(null);
  const [workType, setWorkType] = useState(null);
  const [gender, setGender] = useState(null);
  const [maritalStatus, setMaritalStatus] = useState(null);
  const [city, setCity] = useState(null);

  const loadJobseekerList = async () => {
    setTableLoading(true);
    try {
      const params = {
        search: searchText || undefined,
        industry: industry || undefined,
        experience: experience || undefined,
        level: level || undefined,
        education: education || undefined,
        location: location || undefined,
        workType: workType || undefined,
        gender: gender || undefined,
        maritalStatus: maritalStatus || undefined,
        city: city || undefined,
      };

      const resData = await jobService.getAllJobseekers(params);
      setJobseekerList(resData.data.results);
    } catch (error) {
      console.error("Error fetching jobseekers:", error);
      message.error("Không thể tải danh sách người tìm việc");
    } finally {
      setTableLoading(false);
    }
  };

  useEffect(() => {
    loadJobseekerList();
  }, [searchText, industry, experience, level, education, location, workType, gender, maritalStatus, city]);

  const columns = [
    {
      title: "Tên",
      dataIndex: ["userDict", "fullName"],
      key: "name",
    },
    {
      title: "Ngành nghề",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Lương",
      render: (text, record) => `${record.salaryMin} - ${record.salaryMax}`,
      key: "salary",
    },
    {
      title: "Kinh nghiệm",
      dataIndex: "experience",
      key: "experience",
    },
    {
      title: "Cập nhật lần cuối",
      dataIndex: "updateAt",
      key: "updateAt",
    },
    {
      title: "Lượt xem",
      dataIndex: "viewEmployerNumber",
      key: "viewEmployerNumber",
    },

  ];

  return (
    <Card>
      {/* Header */}
      <Flex vertical gap="middle">
        <Flex align="center" justify="space-between">
          <Title level={4} style={{ margin: 0 }}>
            Quản lý người tìm việc
          </Title>
          <Tag color="blue" icon={<FireOutlined />}>
            {jobseekerList?.length || 0} người tìm việc
          </Tag>
        </Flex>

        {/* Bộ lọc */}
        <Flex gap="middle" style={{ marginBottom: 16, flexWrap: "wrap" }}>
          <Input
            placeholder="Tìm kiếm theo tên, tiêu đề..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 300 }}
          />

          <Select placeholder="Ngành nghề" allowClear onChange={setIndustry} style={{ width: 200 }}>
            <Option value="it">IT</Option>
            <Option value="marketing">Marketing</Option>
            <Option value="finance">Tài chính</Option>
          </Select>

          <Select placeholder="Kinh nghiệm" allowClear onChange={setExperience} style={{ width: 200 }}>
            <Option value="0">Dưới 1 năm</Option>
            <Option value="1-3">1 - 3 năm</Option>
            <Option value="3-5">3 - 5 năm</Option>
          </Select>

          <Select placeholder="Cấp bậc" allowClear onChange={setLevel} style={{ width: 200 }}>
            <Option value="intern">Thực tập</Option>
            <Option value="staff">Nhân viên</Option>
            <Option value="manager">Quản lý</Option>
          </Select>

          <Select placeholder="Học vấn" allowClear onChange={setEducation} style={{ width: 200 }}>
            <Option value="college">Cao đẳng</Option>
            <Option value="university">Đại học</Option>
            <Option value="master">Thạc sĩ</Option>
          </Select>

          <Select placeholder="Nơi làm việc" allowClear onChange={setLocation} style={{ width: 200 }}>
            <Option value="remote">Từ xa</Option>
            <Option value="office">Tại văn phòng</Option>
          </Select>

          <Select placeholder="Hình thức làm việc" allowClear onChange={setWorkType} style={{ width: 200 }}>
            <Option value="fulltime">Toàn thời gian</Option>
            <Option value="parttime">Bán thời gian</Option>
          </Select>

          <Select placeholder="Giới tính" allowClear onChange={setGender} style={{ width: 200 }}>
            <Option value="male">Nam</Option>
            <Option value="female">Nữ</Option>
            <Option value="other">Khác</Option>
          </Select>

          <Select placeholder="Tình trạng hôn nhân" allowClear onChange={setMaritalStatus} style={{ width: 200 }}>
            <Option value="single">Độc thân</Option>
            <Option value="married">Đã kết hôn</Option>
          </Select>

          <Select placeholder="Tỉnh/Thành phố" allowClear onChange={setCity} style={{ width: 200 }}>
            <Option value="hanoi">Hà Nội</Option>
            <Option value="hcm">Hồ Chí Minh</Option>
            <Option value="danang">Đà Nẵng</Option>
          </Select>
        </Flex>

        {/* Bảng dữ liệu */}
        <Table
          loading={tableLoading}
          dataSource={jobseekerList}
          columns={columns}
          rowKey="id"
          pagination={{
            defaultPageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Tổng cộng ${total} người tìm việc`,
          }}
        />
      </Flex>
    </Card>
  );
};

export default JobseekerList;
