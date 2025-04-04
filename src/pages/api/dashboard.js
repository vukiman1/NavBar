import moment from "moment"
import {
  FileTextTwoTone,
  UserAddOutlined,
  ShopTwoTone,
  TeamOutlined,
  EyeOutlined,
  ThunderboltOutlined,
  FireOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons"

// This function would be replaced with an actual API call in production
export const fetchDashboardData = async (filters) => {
  // In a real application, this would be an API call like:
  // const response = await fetch('/api/dashboard', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(filters)
  // });
  // return await response.json();

  // For demo purposes, we'll simulate an API response with mock data
  return new Promise((resolve) => {
    setTimeout(() => {
      // This is the data structure that would be returned by the backend
      const data = generateMockData(filters)
      resolve(data)
    }, 500)
  })
}

// Generate mock data based on filters
// In a real application, this would be handled by the backend
const generateMockData = (filters) => {
  // Sample data - in a real app this would come from the backend
  const jobs = [
    {
      id: 1,
      title: "Frontend Developer",
      industry: "CNTT",
      status: "open",
      createAt: "2025-03-01",
      company: "FPT Software",
      applications: 12,
      trend: "up",
    },
    {
      id: 2,
      title: "Backend Developer",
      industry: "CNTT",
      status: "closed",
      createAt: "2025-02-15",
      company: "VNG Corporation",
      applications: 8,
      trend: "down",
    },
    {
      id: 3,
      title: "Data Engineer",
      industry: "CNTT",
      status: "open",
      createAt: "2025-03-10",
      company: "Tiki",
      applications: 5,
      trend: "up",
    },
    {
      id: 4,
      title: "UI/UX Designer",
      industry: "Thiết kế",
      status: "expired",
      createAt: "2025-01-20",
      company: "FPT Software",
      applications: 15,
      trend: "up",
    },
    {
      id: 5,
      title: "Marketing Manager",
      industry: "Marketing",
      status: "open",
      createAt: "2025-03-15",
      company: "VNG Corporation",
      applications: 7,
      trend: "down",
    },
  ]

  const candidates = [
    {
      id: 1,
      name: "Nguyen Van A",
      appliedIndustry: "CNTT",
      status: "accepted",
      createAt: "2025-03-30T10:00:00.000Z",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      id: 2,
      name: "Tran Thi B",
      appliedIndustry: "CNTT",
      status: "pending",
      createAt: "2025-03-30T12:00:00.000Z",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      id: 3,
      name: "Le Van C",
      appliedIndustry: "Marketing",
      status: "rejected",
      createAt: "2025-03-29T09:00:00.000Z",
      avatar: "https://randomuser.me/api/portraits/men/67.jpg",
    },
    {
      id: 4,
      name: "Pham Thi D",
      appliedIndustry: "Thiết kế",
      status: "accepted",
      createAt: "2025-03-28T14:00:00.000Z",
      avatar: "https://randomuser.me/api/portraits/women/17.jpg",
    },
  ]

  const companies = [
    {
      id: 1,
      name: "FPT Software",
      industry: "CNTT",
      createAt: "2025-03-01",
      logo: "https://logo.clearbit.com/fpt.com.vn",
    },
    {
      id: 2,
      name: "VNG Corporation",
      industry: "CNTT",
      createAt: "2025-03-15",
      logo: "https://logo.clearbit.com/vng.com.vn",
    },
    {
      id: 3,
      name: "Tiki",
      industry: "Thương mại",
      createAt: "2025-02-20",
      logo: "https://logo.clearbit.com/tiki.vn",
    },
  ]

  const users = [
    { id: 1, email: "user1@example.com", isActive: true, createAt: "2025-01-10", lastLogin: "2025-03-30" },
    { id: 2, email: "user2@example.com", isActive: false, createAt: "2025-02-05", lastLogin: "2025-03-25" },
    { id: 3, email: "user3@example.com", isActive: true, createAt: "2025-03-01", lastLogin: "2025-03-29" },
    { id: 4, email: "user4@example.com", isActive: true, createAt: "2025-03-15", lastLogin: "2025-03-30" },
  ]

  const pageViews = [
    { date: "27/03", views: 120, users: 80 },
    { date: "28/03", views: 150, users: 95 },
    { date: "29/03", views: 200, users: 120 },
    { date: "30/03", views: 180, users: 110 },
    { date: "31/03", views: 220, users: 140 },
    { date: "01/04", views: 250, users: 160 },
    { date: "02/04", views: 210, users: 130 },
  ]

  const notifications = [
    {
      id: 1,
      message: "Công việc 'Frontend Developer' vừa được đăng",
      date: "2025-03-30T09:00:00.000Z",
      type: "job",
      icon: <FileTextTwoTone twoToneColor="#1890ff" />,
    },
    {
      id: 2,
      message: "Ứng viên 'Nguyen Van A' ứng tuyển vào 'CNTT'",
      date: "2025-03-30T10:00:00.000Z",
      type: "candidate",
      icon: <UserAddOutlined style={{ color: "#52c41a" }} />,
    },
    {
      id: 3,
      message: "Công ty 'Tiki' vừa đăng ký",
      date: "2025-03-29T15:00:00.000Z",
      type: "company",
      icon: <ShopTwoTone twoToneColor="#fa8c16" />,
    },
    {
      id: 4,
      message: "Ứng viên 'Tran Thi B' được chấp nhận vào vị trí 'Backend Developer'",
      date: "2025-03-29T11:00:00.000Z",
      type: "success",
      icon: <CheckCircleOutlined style={{ color: "#52c41a" }} />,
    },
    {
      id: 5,
      message: "Công việc 'UI/UX Designer' sắp hết hạn",
      date: "2025-03-28T14:00:00.000Z",
      type: "warning",
      icon: <ClockCircleOutlined style={{ color: "#faad14" }} />,
    },
  ]

  // Chart data
  const jobPostingData = [
    { month: "Tháng 1", CNTT: 10, "Thiết kế": 5, Marketing: 2 },
    { month: "Tháng 2", CNTT: 15, "Thiết kế": 8, Marketing: 3 },
    { month: "Tháng 3", CNTT: 25, "Thiết kế": 10, Marketing: 5 },
  ]

  const candidateTrendData = [
    { date: "27/03", CNTT: 3, "Thiết kế": 1, Marketing: 1 },
    { date: "28/03", CNTT: 5, "Thiết kế": 2, Marketing: 2 },
    { date: "29/03", CNTT: 8, "Thiết kế": 3, Marketing: 4 },
    { date: "30/03", CNTT: 10, "Thiết kế": 4, Marketing: 5 },
    { date: "31/03", CNTT: 12, "Thiết kế": 5, Marketing: 6 },
    { date: "01/04", CNTT: 15, "Thiết kế": 7, Marketing: 8 },
    { date: "02/04", CNTT: 18, "Thiết kế": 9, Marketing: 10 },
  ]

  const jobStatusData = [
    { name: "Đang mở", value: jobs.filter((j) => j.status === "open").length },
    { name: "Đã đóng", value: jobs.filter((j) => j.status === "closed").length },
    { name: "Hết hạn", value: jobs.filter((j) => j.status === "expired").length },
  ]

  const industryDemandData = [
    { name: "CNTT", value: candidates.filter((c) => c.appliedIndustry === "CNTT").length },
    { name: "Thiết kế", value: candidates.filter((c) => c.appliedIndustry === "Thiết kế").length },
    { name: "Marketing", value: candidates.filter((c) => c.appliedIndustry === "Marketing").length },
    { name: "Thương mại", value: candidates.filter((c) => c.appliedIndustry === "Thương mại").length },
  ]

  const userRegistrationData = [
    { month: "Tháng 1", users: 5 },
    { month: "Tháng 2", users: 8 },
    { month: "Tháng 3", users: 15 },
  ]

  const applicationSuccessData = [
    { name: "Thành công", value: candidates.filter((c) => c.status === "accepted").length },
    { name: "Đang chờ", value: candidates.filter((c) => c.status === "pending").length },
    { name: "Bị từ chối", value: candidates.filter((c) => c.status === "rejected").length },
  ]

  const applicationTrendData = [
    { date: "27/03", applications: 5, interviews: 2, hires: 1 },
    { date: "28/03", applications: 8, interviews: 3, hires: 1 },
    { date: "29/03", applications: 12, interviews: 5, hires: 2 },
    { date: "30/03", applications: 15, interviews: 7, hires: 3 },
    { date: "31/03", applications: 18, interviews: 8, hires: 4 },
    { date: "01/04", applications: 22, interviews: 10, hires: 5 },
    { date: "02/04", applications: 25, interviews: 12, hires: 6 },
  ]

  // Filter data based on industry if specified
  const filteredJobs = filters.industry !== "all" ? jobs.filter((job) => job.industry === filters.industry) : jobs

  const filteredCandidates =
    filters.industry !== "all"
      ? candidates.filter((candidate) => candidate.appliedIndustry === filters.industry)
      : candidates

  // Filter data based on date range if specified
  const dateFilteredJobs = filters.dateRange
    ? filteredJobs.filter((job) => {
        const jobDate = moment(job.createAt)
        return jobDate.isBetween(moment(filters.dateRange.startDate), moment(filters.dateRange.endDate), null, "[]")
      })
    : filteredJobs

  const dateFilteredCandidates = filters.dateRange
    ? filteredCandidates.filter((candidate) => {
        const candidateDate = moment(candidate.createAt)
        return candidateDate.isBetween(
          moment(filters.dateRange.startDate),
          moment(filters.dateRange.endDate),
          null,
          "[]",
        )
      })
    : filteredCandidates

  // Calculate stats based on filtered data
  const stats = [
    {
      title: "Công việc đang mở",
      value: dateFilteredJobs.filter((job) => job.status === "open").length,
      icon: <FileTextTwoTone twoToneColor="#1890ff" style={{ fontSize: "32px" }} />,
      color: "#1890ff",
      change: "+15%",
      trend: "up",
      suffix: "việc làm",
    },
    {
      title: "Ứng viên mới hôm nay",
      value: dateFilteredCandidates.filter((c) => moment(c.createAt).isSame(moment(), "day")).length,
      icon: <UserAddOutlined style={{ fontSize: "32px", color: "#52c41a" }} />,
      color: "#52c41a",
      change: "+8%",
      trend: "up",
      suffix: "ứng viên",
    },
    {
      title: "Công ty đăng ký",
      value: companies.length,
      icon: <ShopTwoTone twoToneColor="#fa8c16" style={{ fontSize: "32px" }} />,
      color: "#fa8c16",
      change: "+5%",
      trend: "up",
      suffix: "công ty",
    },
    {
      title: "Người dùng hoạt động",
      value: users.filter((user) => user.isActive).length,
      icon: <TeamOutlined style={{ fontSize: "32px", color: "#722ed1" }} />,
      color: "#722ed1",
      change: "+12%",
      trend: "up",
      suffix: "người dùng",
    },
  ]

  // Additional stats
  const additionalStats = [
    {
      title: "Tổng lượt xem",
      value: pageViews.reduce((sum, item) => sum + item.views, 0),
      icon: <EyeOutlined style={{ fontSize: "32px", color: "#13c2c2" }} />,
      color: "#13c2c2",
      change: "+20%",
      trend: "up",
      suffix: "lượt xem",
    },
    {
      title: "Tỷ lệ chuyển đổi",
      value: 4.8,
      icon: <ThunderboltOutlined style={{ fontSize: "32px", color: "#eb2f96" }} />,
      color: "#eb2f96",
      change: "+2.5%",
      trend: "up",
      suffix: "%",
    },
    {
      title: "Tỷ lệ tuyển dụng",
      value: 35,
      icon: <FireOutlined style={{ fontSize: "32px", color: "#f5222d" }} />,
      color: "#f5222d",
      change: "-3%",
      trend: "down",
      suffix: "%",
    },
    {
      title: "Thời gian tuyển dụng TB",
      value: 18,
      icon: <ClockCircleOutlined style={{ fontSize: "32px", color: "#faad14" }} />,
      color: "#faad14",
      change: "-2 ngày",
      trend: "up",
      suffix: "ngày",
    },
  ]

  // Sort top jobs by applications
  const topJobs = [...dateFilteredJobs].sort((a, b) => b.applications - a.applications).slice(0, 5)

  // Return the complete data structure
  return {
    jobs: dateFilteredJobs,
    candidates: dateFilteredCandidates,
    companies,
    users,
    pageViews,
    notifications,
    jobPostingData,
    candidateTrendData,
    jobStatusData,
    industryDemandData,
    userRegistrationData,
    applicationSuccessData,
    applicationTrendData,
    topJobs,
    stats,
    additionalStats,
  }
}

