"use client"

import { useEffect, useState } from "react"
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
  Modal,
  Descriptions,
  Input,
  Select,
  Drawer,
  Divider,
  Badge,
  Row,
  Col,
  Statistic,
  Empty,
  Tabs,
} from "antd"
import {
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
  FilterOutlined,
  ReloadOutlined,
  PlusOutlined,
  InfoCircleOutlined,
  UserOutlined,
  NumberOutlined,
  FacebookOutlined,
  YoutubeOutlined,
  LinkedinOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons"
import { Link } from "react-router-dom"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import "dayjs/locale/vi"
import companyService from './../../services/companyService';

dayjs.extend(relativeTime)
dayjs.locale("vi")

const { Title, Text, Paragraph } = Typography
const { Option } = Select
const { TabPane } = Tabs

const Company = () => {
  const [companyList, setCompanyList] = useState([])
  const [filteredCompanies, setFilteredCompanies] = useState([])
  const [tableLoading, setTableLoading] = useState(false)
  const [selectedCompany, setSelectedCompany] = useState(null)
  const [isDetailDrawerVisible, setIsDetailDrawerVisible] = useState(false)
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false)
  const [filterDrawerVisible, setFilterDrawerVisible] = useState(false)
  const [activeFilters, setActiveFilters] = useState(0)

  // Bộ lọc
  const [searchText, setSearchText] = useState("")
  const [cityFilter, setCityFilter] = useState(null)
  const [sizeFilter, setSizeFilter] = useState(null)
  const [fieldFilter, setFieldFilter] = useState(null)
  const [hasWebsiteFilter, setHasWebsiteFilter] = useState(null)
  const [hasSocialMediaFilter, setHasSocialMediaFilter] = useState(null)

  // Pagination
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  })

  const loadCompanyList = async () => {
    setTableLoading(true)
    try {
      // For demo purposes, we'll use the provided data
      const mockData = [
        {
          "id": 2,
          "companyName": "vvvvvvv",
          "slug": "vvvvvvv",
          "companyImageUrl": "https://res.cloudinary.com/dtnpj540t/image/upload/v1682831706/my-job/images_default/company_image_default.png",
          "companyImagePublicId": null,
          "companyCoverImageUrl": "https://cdn1.vieclam24h.vn/tvn/images/assets/img/generic_18.jpg",
          "companyCoverImagePublicId": null,
          "facebookUrl": null,
          "youtubeUrl": null,
          "linkedinUrl": null,
          "companyEmail": "acount@gmail.com",
          "companyPhone": "0963258741",
          "websiteUrl": "",
          "taxCode": "11111",
          "since": "2025-03-02T17:00:00.000Z",
          "fieldOperation": "",
          "description": null,
          "employeeSize": 2,
          "createAt": "2025-03-06T17:12:56.860Z",
          "updateAt": "2025-03-06T17:12:56.860Z",
          "location": {
            "id": 5,
            "address": "12 Hà nội",
            "lat": null,
            "lng": null,
            "createAt": "2025-03-06T17:12:53.236Z",
            "updateAt": "2025-03-06T17:12:53.236Z",
            "city": {
              "id": 24,
              "name": "Hà Nội",
              "createAt": "2025-03-04T08:22:31.657Z",
              "updateAt": "2025-03-04T08:22:31.657Z"
            }
          },
          "user": {
            "id": 4,
            "email": "hr@viettel.com",
            "fullName": "Phuong Do",
            "password": "$2b$10$LsjjdwfmacAnsCqwmK.ZMOGmaCVRwbRTuVmo8zQcEz/SXccnQGa1q",
            "isActive": true,
            "isVerifyEmail": true,
            "isSupperuser": false,
            "isStaff": false,
            "hasCompany": true,
            "roleName": "EMPLOYER",
            "money": 0,
            "avatarUrl": "https://res.cloudinary.com/myjob/image/upload/c_scale,h_200,w_200/myjob/Avatar/defaultAvatar.jpg",
            "avatarPublicId": null,
            "lastLogin": null,
            "createAt": "2025-03-06T17:12:53.221Z",
            "updateAt": "2025-03-06T17:12:53.221Z"
          }
        },
        {
          "id": 1,
          "companyName": "Công ty TNHH Phần mềm FPT",
          "slug": "cong-ty-tnhh-phan-mem-fpt-1",
          "companyImageUrl": "https://res.cloudinary.com/myjob/image/upload/v1742112694/myjob/companyAvatar/2025/03/cong-ty-tnhh-phan-mem-fpt_1742112690939.png",
          "companyImagePublicId": "myjob/companyAvatar/2025/03/cong-ty-tnhh-phan-mem-fpt_1742112690939",
          "companyCoverImageUrl": "https://res.cloudinary.com/myjob/image/upload/v1743093753/myjob/companyCover/2025/03/cong-ty-tnhh-phan-mem-fpt-1_1743093751439.png",
          "companyCoverImagePublicId": "myjob/companyCover/2025/03/cong-ty-tnhh-phan-mem-fpt-1_1743093751439",
          "facebookUrl": "http://example.com",
          "youtubeUrl": "http://example.com",
          "linkedinUrl": "http://example.com",
          "companyEmail": "hr@fpt.com",
          "companyPhone": "1111111111111",
          "websiteUrl": "fpt.com",
          "taxCode": "111111111",
          "since": "2026-12-08T17:00:00.000Z",
          "fieldOperation": "Công nghệ thông tin",
          "description": "<p>FPT Software là công ty thành viên thuộc Tập đoàn FPT. Được thành lập từ năm 1999, FPT Software hiện là công ty chuyên cung cấp các dịch vụ và giải pháp phần mềm cho các khách hàng quốc tế, với hơn 28000 nhân viên, hiện diện tại 27 quốc gia trên toàn cầu. Nhiều năm liền, FPT Software được bình chọn là Nhà Tuyển dụng được yêu thích nhất và nằm trong TOP các công ty có môi trường làm việc tốt nhất châu Á.</p>\n",
          "employeeSize": 2,
          "createAt": "2025-03-04T09:36:20.847Z",
          "updateAt": "2025-03-27T09:42:35.643Z",
          "location": {
            "id": 7,
            "address": "Nhà hàng Thu Nga, Ngõ 2 Cầu Giấy, Phường Láng Thượng, Quận Đống Đa, Thành phố Hà Nội",
            "lat": 21.029079628000034,
            "lng": 105.80247579700006,
            "createAt": "2025-03-09T04:09:42.051Z",
            "updateAt": "2025-03-09T04:09:42.051Z",
            "city": {
              "id": 24,
              "name": "Hà Nội",
              "createAt": "2025-03-04T08:22:31.657Z",
              "updateAt": "2025-03-04T08:22:31.657Z"
            }
          },
          "user": {
            "id": 2,
            "email": "hr@fpt.com",
            "fullName": "HR FPT",
            "password": "$2b$10$PV4KEW3r3pVtECWgq4ESoeOBB5o/Bwmw8zbtCJt3FUOg2BQHywrai",
            "isActive": true,
            "isVerifyEmail": true,
            "isSupperuser": false,
            "isStaff": false,
            "hasCompany": true,
            "roleName": "EMPLOYER",
            "money": 100000,
            "avatarUrl": "https://res.cloudinary.com/myjob/image/upload/v1741191417/myjob/avatar/2025/03/2_1741191414195.jpg",
            "avatarPublicId": "myjob/avatar/2025/03/2_1741191414195",
            "lastLogin": "2025-03-31T07:56:29.385Z",
            "createAt": "2025-03-04T09:35:45.878Z",
            "updateAt": "2025-03-31T07:56:29.475Z"
          }
        },
        {
          "id": 3,
          "companyName": "NGÂN HÀNG THƯƠNG MẠI CỔ PHẦN QUÂN ĐỘI",
          "slug": "ngan-hang-thuong-mai-co-phan-quan-djoi-1",
          "companyImageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Logo_MB_new.png/1200px-Logo_MB_new.png",
          "companyImagePublicId": "myjob/companyAvatar/2025/03/ngan-hang-thuong-mai-co-phan-quan-djoi_1742117307898",
          "companyCoverImageUrl": "https://cdn1.vieclam24h.vn/tvn/images/assets/img/generic_18.jpg",
          "companyCoverImagePublicId": "myjob/companyCover/2025/03/ngan-hang-thuong-mai-co-phan-quan-djoi_1742117314597",
          "facebookUrl": null,
          "youtubeUrl": null,
          "linkedinUrl": null,
          "companyEmail": "mbbank@gmail.com",
          "companyPhone": "0654852324",
          "websiteUrl": "https://www.mbbank.com.vn",
          "taxCode": "0100283873",
          "since": "2000-01-01T17:00:00.000Z",
          "fieldOperation": "Tiền tệ",
          "description": "<p>Ngân hàng thương mại cổ phần Quân đội (tên giao dịch tiếng Anh là Military Commercial Joint Stock Bank), hay gọi tắt là Ngân hàng Quân đội, hay viết tắt là ngân hàng TMCP Quân đội hoặc MB, là một ngân hàng thương mại cổ phần của Việt Nam, một doanh nghiệp của Quân đội Nhân dân Việt Nam trực thuộc Bộ Quốc phòng.</p>\n<p>Ngoài dịch vụ ngân hàng, Ngân hàng Quân đội còn tham gia vào các dịch vụ môi giới chứng khoán, quản lý quỹ, kinh doanh địa ốc bằng cách nắm cổ phần chi phối của một số doanh nghiệp trong lĩnh vực này. Hiện nay, Ngân hàng Quân đội đã có mạng lưới khắp cả nước với trên 100 chi nhánh và 180 điểm giao dịch trải dài khắp 48 tỉnh thành phố.Ngân hàng còn có chi nhánh tại Lào và Campuchia.</p>\n",
          "employeeSize": 6,
          "createAt": "2025-03-16T09:04:34.073Z",
          "updateAt": "2025-03-16T09:28:39.655Z",
          "location": {
            "id": 15,
            "address": "Ngõ 2 Cầu Giấy, Phường Láng Thượng, Quận Đống Đa, Thành phố Hà Nội",
            "lat": 21.029077571002855,
            "lng": 105.80250854749983,
            "createAt": "2025-03-16T09:27:26.318Z",
            "updateAt": "2025-03-16T09:27:26.318Z",
            "city": {
              "id": 24,
              "name": "Hà Nội",
              "createAt": "2025-03-04T08:22:31.657Z",
              "updateAt": "2025-03-04T08:22:31.657Z"
            }
          },
          "user": {
            "id": 14,
            "email": "mbbank@gmail.com",
            "fullName": "MB Bank",
            // "password": \"$2b$10$Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Yd.Yd/Y

            "isActive": true,
            "isVerifyEmail": true,
            "isSupperuser": false,
            "isStaff": false,
            "hasCompany": true,
            "roleName": "EMPLOYER",
            "money": 0,
            "avatarUrl": "https://res.cloudinary.com/myjob/image/upload/c_scale,h_200,w_200/myjob/Avatar/defaultAvatar.jpg",
            "avatarPublicId": null,
            "lastLogin": "2025-03-16T09:04:34.073Z",
            "createAt": "2025-03-16T09:04:34.073Z",
            "updateAt": "2025-03-16T09:04:34.073Z"
          }
        }
      ]
      const resData = await companyService.getAllCompany()
      console.log(resData)
      setCompanyList(resData)
      setFilteredCompanies(resData)

      // Count active filters
      let filterCount = 0
      if (searchText) filterCount++
      if (cityFilter) filterCount++
      if (sizeFilter) filterCount++
      if (fieldFilter) filterCount++
      if (hasWebsiteFilter !== null) filterCount++
      if (hasSocialMediaFilter !== null) filterCount++
      setActiveFilters(filterCount)
    } catch (error) {
      console.error("Error fetching companies:", error)
      message.error("Không thể tải danh sách công ty")
    } finally {
      setTableLoading(false)
    }
  }

  useEffect(() => {
    loadCompanyList()
  }, [])

  // Xử lý tìm kiếm & bộ lọc
  useEffect(() => {
    let filtered = companyList

    if (searchText) {
      filtered = filtered.filter((company) => company.companyName.toLowerCase().includes(searchText.toLowerCase()))
    }

    if (cityFilter) {
      filtered = filtered.filter((company) => company.location?.city?.name === cityFilter)
    }

    if (sizeFilter) {
      filtered = filtered.filter((company) => company.employeeSize === Number.parseInt(sizeFilter))
    }

    if (fieldFilter) {
      filtered = filtered.filter((company) => company.fieldOperation?.toLowerCase().includes(fieldFilter.toLowerCase()))
    }

    if (hasWebsiteFilter !== null) {
      filtered = filtered.filter((company) => (hasWebsiteFilter ? !!company.websiteUrl : !company.websiteUrl))
    }

    if (hasSocialMediaFilter !== null) {
      filtered = filtered.filter((company) =>
        hasSocialMediaFilter
          ? !!company.facebookUrl || !!company.youtubeUrl || !!company.linkedinUrl
          : !company.facebookUrl && !company.youtubeUrl && !company.linkedinUrl,
      )
    }

    setFilteredCompanies(filtered)
  }, [searchText, cityFilter, sizeFilter, fieldFilter, hasWebsiteFilter, hasSocialMediaFilter, companyList])

  const handleTableChange = (pagination) => {
    setPagination(pagination)
  }

  const handleDelete = async () => {
    try {
      // In a real application, you would call an API
      // await companyService.deleteCompany(selectedCompany.id);

      // Update local state
      const updatedList = companyList.filter((item) => item.id !== selectedCompany.id)
      setCompanyList(updatedList)
      setFilteredCompanies(updatedList.filter((item) => item.id !== selectedCompany.id))

      setIsDeleteModalVisible(false)
      message.success("Xóa công ty thành công")
    } catch (error) {
      console.error("Error deleting company:", error)
      message.error("Không thể xóa công ty")
    }
  }

  const showCompanyDetails = (company) => {
    setSelectedCompany(company)
    setIsDetailDrawerVisible(true)
  }

  const resetFilters = () => {
    setSearchText("")
    setCityFilter(null)
    setSizeFilter(null)
    setFieldFilter(null)
    setHasWebsiteFilter(null)
    setHasSocialMediaFilter(null)
    setPagination({
      current: 1,
      pageSize: 10,
    })
    message.success("Đã xóa tất cả bộ lọc")
  }

  const columns = [
    {
      title: "Công ty",
      key: "company",
      render: (_, record) => (
        <Flex align="center" gap="middle">
          <Avatar
            src={record.companyImageUrl}
            size={64}
            shape="square"
            style={{
              border: "1px solid #f0f0f0",
              backgroundColor: "white",
              objectFit: "contain",
            }}
          />
          <Flex vertical>
            <Text strong style={{ fontSize: 16 }}>
              {record.companyName}
            </Text>
            <Text type="secondary">
              <BankOutlined style={{ marginRight: 8 }} />
              {record.fieldOperation || "Chưa cập nhật ngành nghề"}
            </Text>
            <Space size={[0, 8]} wrap style={{ marginTop: 4 }}>
              <Tag icon={<TeamOutlined />}>{record.employeeSize} nhân viên</Tag>
              <Tag icon={<EnvironmentOutlined />}>{record.location?.city?.name || "Chưa cập nhật"}</Tag>
            </Space>
          </Flex>
        </Flex>
      ),
      width: "40%",
    },
    {
      title: "Liên hệ",
      key: "contact",
      render: (_, record) => (
        <Flex vertical>
          <Text>
            <MailOutlined style={{ marginRight: 8 }} />
            {record.companyEmail}
          </Text>
          <Text style={{ marginTop: 4 }}>
            <PhoneOutlined style={{ marginRight: 8 }} />
            {record.companyPhone}
          </Text>
          {record.websiteUrl ? (
            <Text style={{ marginTop: 4 }}>
              <GlobalOutlined style={{ marginRight: 8 }} />
              <a
                href={record.websiteUrl.startsWith("http") ? record.websiteUrl : `https://${record.websiteUrl}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {record.websiteUrl}
              </a>
            </Text>
          ) : (
            <Text type="secondary" style={{ marginTop: 4 }}>
              <GlobalOutlined style={{ marginRight: 8 }} />
              Chưa cập nhật website
            </Text>
          )}
        </Flex>
      ),
      width: "25%",
    },
    {
      title: "Địa chỉ",
      key: "location",
      render: (_, record) => (
        <Flex vertical>
          <Text>
            <EnvironmentOutlined style={{ marginRight: 8 }} />
            {record.location?.address || "Chưa cập nhật địa chỉ"}
          </Text>
          <Text style={{ marginTop: 4 }}>
            <CalendarOutlined style={{ marginRight: 8 }} />
            Thành lập: {dayjs(record.since).format("DD/MM/YYYY")}
          </Text>
          <Text style={{ marginTop: 4 }}>
            <NumberOutlined style={{ marginRight: 8 }} />
            MST: {record.taxCode || "Chưa cập nhật"}
          </Text>
        </Flex>
      ),
      width: "20%",
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button type="primary" icon={<EyeOutlined />} onClick={() => showCompanyDetails(record)}>
            Chi tiết
          </Button>
          <Link to={`/company/edit/${record.id}`}>
            <Button icon={<EditOutlined />}>Sửa</Button>
          </Link>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => {
              setSelectedCompany(record)
              setIsDeleteModalVisible(true)
            }}
          >
            Xóa
          </Button>
        </Space>
      ),
      width: "15%",
    },
  ]

  // Danh sách thành phố
  const cityOptions = [
    { value: "Hà Nội", label: "Hà Nội" },
    { value: "TP.Hồ Chí Minh", label: "TP.Hồ Chí Minh" },
    { value: "Đà Nẵng", label: "Đà Nẵng" },
  ]

  // Danh sách quy mô
  const sizeOptions = [
    { value: "2", label: "2 nhân viên" },
    { value: "6", label: "6 nhân viên" },
    { value: "10", label: "10 nhân viên" },
    { value: "50", label: "50 nhân viên" },
    { value: "100", label: "100 nhân viên" },
  ]

  // Danh sách ngành nghề
  const fieldOptions = [
    { value: "Công nghệ thông tin", label: "Công nghệ thông tin" },
    { value: "Tiền tệ", label: "Tiền tệ" },
    { value: "Ngân hàng", label: "Ngân hàng" },
    { value: "Bán lẻ", label: "Bán lẻ" },
  ]

  return (
    <div style={{ padding: "24px", backgroundColor: "#f0f2f5", minHeight: "100vh" }}>
      <Card
        bordered={false}
        style={{
          borderRadius: 8,
          boxShadow: "0 1px 2px rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px rgba(0, 0, 0, 0.02)",
        }}
      >
        {/* Header */}
        <Flex align="center" justify="space-between" style={{ marginBottom: 24 }}>
          <Title level={3} style={{ margin: 0 }}>
            Quản lý công ty
          </Title>
          <Space>
            <Statistic
              title="Tổng số công ty"
              value={filteredCompanies.length}
              prefix={<BankOutlined />}
              style={{ marginRight: 24 }}
            />
            {activeFilters > 0 && (
              <Badge count={activeFilters} offset={[0, 0]}>
                <Tag color="blue" style={{ padding: "6px 8px" }}>
                  Đang áp dụng {activeFilters} bộ lọc
                </Tag>
              </Badge>
            )}
          </Space>
        </Flex>

        <Divider style={{ margin: "12px 0 24px" }} />

        {/* Thanh tìm kiếm và bộ lọc */}
        <Flex justify="space-between" align="center" style={{ marginBottom: 24 }}>
          <Space size="middle">
            <Input.Search
              placeholder="Tìm kiếm công ty..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 300 }}
              allowClear
              enterButton
            />

            <Select
              placeholder="Thành phố"
              allowClear
              onChange={setCityFilter}
              value={cityFilter}
              style={{ width: 180 }}
              options={cityOptions}
            />

            <Select
              placeholder="Ngành nghề"
              allowClear
              onChange={setFieldFilter}
              value={fieldFilter}
              style={{ width: 180 }}
              options={fieldOptions}
            />
          </Space>

          <Space>
            <Button
              icon={<FilterOutlined />}
              onClick={() => setFilterDrawerVisible(true)}
              type={activeFilters > 0 ? "primary" : "default"}
            >
              Bộ lọc nâng cao
            </Button>

            {activeFilters > 0 && (
              <Button icon={<ReloadOutlined />} onClick={resetFilters}>
                Xóa bộ lọc
              </Button>
            )}

            <Link to="/company/add">
              <Button type="primary" icon={<PlusOutlined />}>
                Thêm công ty mới
              </Button>
            </Link>
          </Space>
        </Flex>

        {/* Bảng dữ liệu */}
        {filteredCompanies.length > 0 ? (
          <Table
            loading={tableLoading}
            dataSource={filteredCompanies}
            columns={columns}
            rowKey="id"
            pagination={{
              ...pagination,
              total: filteredCompanies.length,
              showSizeChanger: true,
              showTotal: (total) => `Tổng cộng ${total} công ty`,
              pageSizeOptions: ["10", "20", "50"],
            }}
            onChange={handleTableChange}
            style={{ marginTop: 16 }}
          />
        ) : (
          <Empty
            description={
              <span>
                {activeFilters > 0
                  ? "Không tìm thấy công ty nào phù hợp với bộ lọc"
                  : "Chưa có công ty nào trong hệ thống"}
              </span>
            }
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            style={{ margin: "48px 0" }}
          />
        )}
      </Card>

      {/* Modal xác nhận xóa */}
      <Modal
        title={
          <>
            <ExclamationCircleOutlined style={{ color: "#ff4d4f", marginRight: 8 }} /> Xác nhận xóa
          </>
        }
        open={isDeleteModalVisible}
        onOk={handleDelete}
        onCancel={() => setIsDeleteModalVisible(false)}
        okText="Xóa"
        cancelText="Hủy"
        okButtonProps={{ danger: true }}
      >
        <p>
          Bạn có chắc chắn muốn xóa công ty <strong>{selectedCompany?.companyName}</strong>? Hành động này không thể
          hoàn tác.
        </p>
      </Modal>

      {/* Drawer xem chi tiết */}
      <Drawer
        title={selectedCompany?.companyName}
        placement="right"
        onClose={() => setIsDetailDrawerVisible(false)}
        open={isDetailDrawerVisible}
        width={800}
        extra={
          <Space>
            <Link to={`/company/edit/${selectedCompany?.id}`}>
              <Button type="primary" icon={<EditOutlined />}>
                Chỉnh sửa
              </Button>
            </Link>
          </Space>
        }
      >
        {selectedCompany && (
          <>
            <div
              style={{
                height: 200,
                width: "100%",
                backgroundImage: `url(${selectedCompany.companyCoverImageUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                borderRadius: 8,
                marginBottom: 24,
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  bottom: -50,
                  left: 24,
                  width: 100,
                  height: 100,
                  backgroundColor: "white",
                  borderRadius: 8,
                  border: "4px solid white",
                  overflow: "hidden",
                }}
              >
                <img
                  src={selectedCompany.companyImageUrl || "/placeholder.svg"}
                  alt={selectedCompany.companyName}
                  style={{ width: "100%", height: "100%", objectFit: "contain" }}
                />
              </div>
            </div>

            <div style={{ marginTop: 60 }}>
              <Tabs defaultActiveKey="1">
                <TabPane
                  tab={
                    <span>
                      <InfoCircleOutlined />
                      Thông tin cơ bản
                    </span>
                  }
                  key="1"
                >
                  <Row gutter={[24, 24]}>
                    <Col span={12}>
                      <Card title="Thông tin chung" bordered={false}>
                        <Descriptions column={1} layout="vertical">
                          <Descriptions.Item label="Tên công ty">{selectedCompany.companyName}</Descriptions.Item>
                          <Descriptions.Item label="Ngành nghề">
                            {selectedCompany.fieldOperation || "Chưa cập nhật"}
                          </Descriptions.Item>
                          <Descriptions.Item label="Quy mô">{selectedCompany.employeeSize} nhân viên</Descriptions.Item>
                          <Descriptions.Item label="Mã số thuế">
                            {selectedCompany.taxCode || "Chưa cập nhật"}
                          </Descriptions.Item>
                          <Descriptions.Item label="Ngày thành lập">
                            {dayjs(selectedCompany.since).format("DD/MM/YYYY")}
                          </Descriptions.Item>
                        </Descriptions>
                      </Card>
                    </Col>
                    <Col span={12}>
                      <Card title="Thông tin liên hệ" bordered={false}>
                        <Descriptions column={1} layout="vertical">
                          <Descriptions.Item label="Email">{selectedCompany.companyEmail}</Descriptions.Item>
                          <Descriptions.Item label="Số điện thoại">{selectedCompany.companyPhone}</Descriptions.Item>
                          <Descriptions.Item label="Website">
                            {selectedCompany.websiteUrl ? (
                              <a
                                href={
                                  selectedCompany.websiteUrl.startsWith("http")
                                    ? selectedCompany.websiteUrl
                                    : `https://${selectedCompany.websiteUrl}`
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {selectedCompany.websiteUrl}
                              </a>
                            ) : (
                              "Chưa cập nhật"
                            )}
                          </Descriptions.Item>
                          <Descriptions.Item label="Địa chỉ">
                            {selectedCompany.location?.address || "Chưa cập nhật"}
                          </Descriptions.Item>
                          <Descriptions.Item label="Thành phố">
                            {selectedCompany.location?.city?.name || "Chưa cập nhật"}
                          </Descriptions.Item>
                        </Descriptions>
                      </Card>
                    </Col>
                    <Col span={24}>
                      <Card title="Mạng xã hội" bordered={false}>
                        <Flex gap="middle">
                          <Button
                            type="link"
                            icon={<FacebookOutlined />}
                            href={selectedCompany.facebookUrl || "#"}
                            target="_blank"
                            disabled={!selectedCompany.facebookUrl}
                          >
                            Facebook
                          </Button>
                          <Button
                            type="link"
                            icon={<YoutubeOutlined />}
                            href={selectedCompany.youtubeUrl || "#"}
                            target="_blank"
                            disabled={!selectedCompany.youtubeUrl}
                          >
                            Youtube
                          </Button>
                          <Button
                            type="link"
                            icon={<LinkedinOutlined />}
                            href={selectedCompany.linkedinUrl || "#"}
                            target="_blank"
                            disabled={!selectedCompany.linkedinUrl}
                          >
                            LinkedIn
                          </Button>
                        </Flex>
                      </Card>
                    </Col>
                    <Col span={24}>
                      <Card title="Mô tả công ty" bordered={false}>
                        {selectedCompany.description ? (
                          <div dangerouslySetInnerHTML={{ __html: selectedCompany.description }} />
                        ) : (
                          <Empty description="Chưa có mô tả" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                        )}
                      </Card>
                    </Col>
                  </Row>
                </TabPane>
                <TabPane
                  tab={
                    <span>
                      <UserOutlined />
                      Thông tin người dùng
                    </span>
                  }
                  key="2"
                >
                  <Card bordered={false}>
                    <Flex align="center" gap="middle" style={{ marginBottom: 24 }}>
                      <Avatar src={selectedCompany.user?.avatarUrl} size={80} icon={<UserOutlined />} />
                      <Flex vertical>
                        <Title level={4} style={{ margin: 0 }}>
                          {selectedCompany.user?.fullName}
                        </Title>
                        <Text>{selectedCompany.user?.email}</Text>
                        <Space style={{ marginTop: 8 }}>
                          <Tag color="blue">{selectedCompany.user?.roleName}</Tag>
                          <Tag color={selectedCompany.user?.isActive ? "success" : "error"}>
                            {selectedCompany.user?.isActive ? "Đang hoạt động" : "Đã khóa"}
                          </Tag>
                        </Space>
                      </Flex>
                    </Flex>

                    <Descriptions title="Thông tin chi tiết" bordered column={2}>
                      <Descriptions.Item label="ID người dùng">{selectedCompany.user?.id}</Descriptions.Item>
                      <Descriptions.Item label="Email đã xác thực">
                        {selectedCompany.user?.isVerifyEmail ? "Đã xác thực" : "Chưa xác thực"}
                      </Descriptions.Item>
                      <Descriptions.Item label="Đăng nhập lần cuối">
                        {selectedCompany.user?.lastLogin
                          ? dayjs(selectedCompany.user.lastLogin).format("DD/MM/YYYY HH:mm:ss")
                          : "Chưa đăng nhập"}
                      </Descriptions.Item>
                      <Descriptions.Item label="Ngày tạo">
                        {dayjs(selectedCompany.user?.createAt).format("DD/MM/YYYY HH:mm:ss")}
                      </Descriptions.Item>
                    </Descriptions>
                  </Card>
                </TabPane>
              </Tabs>
            </div>
          </>
        )}
      </Drawer>

      {/* Drawer bộ lọc nâng cao */}
      <Drawer
        title="Bộ lọc nâng cao"
        placement="right"
        onClose={() => setFilterDrawerVisible(false)}
        open={filterDrawerVisible}
        width={400}
        extra={
          <Button type="primary" onClick={() => setFilterDrawerVisible(false)}>
            Áp dụng
          </Button>
        }
        footer={
          <Flex justify="space-between">
            <Button onClick={resetFilters}>Xóa tất cả</Button>
            <Button type="primary" onClick={() => setFilterDrawerVisible(false)}>
              Áp dụng bộ lọc
            </Button>
          </Flex>
        }
      >
        <Flex vertical gap="middle">
          <div>
            <Text strong>Thành phố</Text>
            <Select
              placeholder="Chọn thành phố"
              allowClear
              onChange={setCityFilter}
              value={cityFilter}
              style={{ width: "100%", marginTop: 8 }}
              options={cityOptions}
            />
          </div>

          <div>
            <Text strong>Quy mô công ty</Text>
            <Select
              placeholder="Chọn quy mô"
              allowClear
              onChange={setSizeFilter}
              value={sizeFilter}
              style={{ width: "100%", marginTop: 8 }}
              options={sizeOptions}
            />
          </div>

          <div>
            <Text strong>Ngành nghề</Text>
            <Select
              placeholder="Chọn ngành nghề"
              allowClear
              onChange={setFieldFilter}
              value={fieldFilter}
              style={{ width: "100%", marginTop: 8 }}
              options={fieldOptions}
            />
          </div>

          <Divider />

          <div>
            <Text strong>Có website</Text>
            <Select
              placeholder="Lọc theo website"
              allowClear
              onChange={setHasWebsiteFilter}
              value={hasWebsiteFilter}
              style={{ width: "100%", marginTop: 8 }}
            >
              <Option value={true}>Có website</Option>
              <Option value={false}>Chưa có website</Option>
            </Select>
          </div>

          <div>
            <Text strong>Có mạng xã hội</Text>
            <Select
              placeholder="Lọc theo mạng xã hội"
              allowClear
              onChange={setHasSocialMediaFilter}
              value={hasSocialMediaFilter}
              style={{ width: "100%", marginTop: 8 }}
            >
              <Option value={true}>Có mạng xã hội</Option>
              <Option value={false}>Chưa có mạng xã hội</Option>
            </Select>
          </div>
        </Flex>
      </Drawer>

      <style jsx global>{`
        .ant-table-thead > tr > th {
          background-color: #fafafa;
          font-weight: 600;
        }
        
        .ant-drawer-body {
          padding: 24px;
        }
        
        .ant-statistic-title {
          font-size: 14px;
        }
      `}</style>
    </div>
  )
}

export default Company

