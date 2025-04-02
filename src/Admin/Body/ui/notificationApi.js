import dayjs from "dayjs"

// Mock notification data
const mockNotifications = [
  {
    id: 1,
    title: "Người dùng mới đăng ký",
    message: "Người dùng Nguyễn Văn A vừa đăng ký tài khoản. Vui lòng xem xét và phê duyệt.",
    date: dayjs().subtract(30, "minute").toISOString(),
    read: false,
    type: "info",
    imageUrl: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    id: 2,
    title: "Công ty ABC cập nhật thông tin",
    message: "Công ty ABC đã cập nhật thông tin công ty. Vui lòng kiểm tra và xác nhận thông tin.",
    date: dayjs().subtract(2, "hour").toISOString(),
    read: true,
    type: "info",
    imageUrl: "https://logo.clearbit.com/microsoft.com",
  },
  {
    id: 3,
    title: "Lỗi hệ thống",
    message: "Đã xảy ra lỗi khi xử lý thanh toán. Vui lòng kiểm tra hệ thống thanh toán.",
    date: dayjs().subtract(1, "day").toISOString(),
    read: false,
    type: "error",
    imageUrl: null,
  },
  {
    id: 4,
    title: "Tin tuyển dụng hết hạn",
    message: "5 tin tuyển dụng sẽ hết hạn trong 24 giờ tới. Vui lòng thông báo cho các công ty liên quan.",
    date: dayjs().subtract(3, "day").toISOString(),
    read: false,
    type: "warning",
    imageUrl: null,
  },
  {
    id: 5,
    title: "Thanh toán thành công",
    message: "Công ty XYZ đã thanh toán gói dịch vụ Premium thành công. Gói dịch vụ đã được kích hoạt.",
    date: dayjs().subtract(5, "day").toISOString(),
    read: true,
    type: "success",
    imageUrl: "https://logo.clearbit.com/apple.com",
  },
  {
    id: 6,
    title: "Báo cáo hàng tuần",
    message: "Báo cáo hoạt động hàng tuần đã được tạo. Vui lòng xem xét số liệu thống kê.",
    date: dayjs().subtract(1, "week").toISOString(),
    read: true,
    type: "info",
    imageUrl: null,
  },
  {
    id: 7,
    title: "Cảnh báo bảo mật",
    message: "Phát hiện nhiều lần đăng nhập thất bại từ địa chỉ IP lạ. Vui lòng kiểm tra nhật ký bảo mật.",
    date: dayjs().subtract(2, "day").toISOString(),
    read: false,
    type: "warning",
    imageUrl: null,
  },
  {
    id: 8,
    title: "Ứng viên mới ứng tuyển",
    message: "Có 15 ứng viên mới đã ứng tuyển vào các vị trí đang tuyển dụng trong 24 giờ qua.",
    date: dayjs().subtract(12, "hour").toISOString(),
    read: false,
    type: "info",
    imageUrl: null,
  },
  {
    id: 9,
    title: "Cập nhật hệ thống",
    message: "Hệ thống sẽ được nâng cấp vào ngày 15/07/2023. Dự kiến thời gian bảo trì là 2 giờ.",
    date: dayjs().subtract(2, "week").toISOString(),
    read: true,
    type: "info",
    imageUrl: null,
  },
  {
    id: 10,
    title: "Phản hồi từ người dùng",
    message: "Người dùng Trần Thị B đã gửi phản hồi về trải nghiệm sử dụng. Vui lòng xem xét.",
    date: dayjs().subtract(4, "day").toISOString(),
    read: true,
    type: "info",
    imageUrl: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    id: 11,
    title: "Lỗi kết nối cơ sở dữ liệu",
    message: "Đã xảy ra lỗi kết nối đến cơ sở dữ liệu. Vui lòng kiểm tra cấu hình kết nối.",
    date: dayjs().subtract(6, "hour").toISOString(),
    read: false,
    type: "error",
    imageUrl: null,
  },
  {
    id: 12,
    title: "Hoàn thành mục tiêu",
    message: "Chúc mừng! Đã đạt 100% mục tiêu đăng ký người dùng mới trong tháng này.",
    date: dayjs().subtract(3, "day").toISOString(),
    read: true,
    type: "success",
    imageUrl: null,
  },
  {
    id: 13,
    title: "Yêu cầu hỗ trợ mới",
    message:
      "Công ty DEF đã gửi yêu cầu hỗ trợ kỹ thuật về vấn đề đăng tin tuyển dụng. Vui lòng phản hồi trong vòng 24 giờ.",
    date: dayjs().subtract(8, "hour").toISOString(),
    read: false,
    type: "info",
    imageUrl: "https://logo.clearbit.com/company.com",
  },
  {
    id: 14,
    title: "Bảo trì hệ thống",
    message: "Hệ thống sẽ được bảo trì vào ngày mai từ 22:00 đến 24:00. Vui lòng thông báo cho người dùng.",
    date: dayjs().subtract(1, "day").toISOString(),
    read: true,
    type: "warning",
    imageUrl: null,
  },
  {
    id: 15,
    title: "Đánh giá mới",
    message: "Người dùng Lê Văn C đã đánh giá 5 sao cho dịch vụ của chúng ta. Xem chi tiết đánh giá.",
    date: dayjs().subtract(5, "hour").toISOString(),
    read: false,
    type: "success",
    imageUrl: "https://randomuser.me/api/portraits/men/67.jpg",
  },
]

// Local storage key
const STORAGE_KEY = "mock_notifications"

// Helper to get notifications from storage or initialize with mock data
const getStoredNotifications = () => {
  const storedData = localStorage.getItem(STORAGE_KEY)
  if (storedData) {
    try {
      return JSON.parse(storedData)
    } catch (error) {
      console.error("Error parsing stored notifications:", error)
      return [...mockNotifications]
    }
  }
  return [...mockNotifications]
}

// Helper to save notifications to storage
const saveNotifications = (notifications) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications))
}

/**
 * Fetch all notifications
 * @returns {Promise<Array>} Array of notification objects
 */
export const fetchNotifications = async () => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  // Get notifications from storage or initialize with mock data
  const notifications = getStoredNotifications()

  // Sort by date (newest first)
  return notifications.sort((a, b) => new Date(b.date) - new Date(a.date))
}

/**
 * Mark a notification as read
 * @param {number} id - Notification ID
 * @returns {Promise<Object>} Updated notification
 */
export const markAsRead = async (id) => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  const notifications = getStoredNotifications()
  const index = notifications.findIndex((n) => n.id === id)

  if (index === -1) {
    throw new Error(`Notification with ID ${id} not found`)
  }

  notifications[index].read = true
  saveNotifications(notifications)

  return notifications[index]
}

/**
 * Mark a notification as unread
 * @param {number} id - Notification ID
 * @returns {Promise<Object>} Updated notification
 */
export const markAsUnread = async (id) => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  const notifications = getStoredNotifications()
  const index = notifications.findIndex((n) => n.id === id)

  if (index === -1) {
    throw new Error(`Notification with ID ${id} not found`)
  }

  notifications[index].read = false
  saveNotifications(notifications)

  return notifications[index]
}

/**
 * Delete a notification
 * @param {number} id - Notification ID
 * @returns {Promise<boolean>} Success status
 */
export const deleteNotification = async (id) => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  const notifications = getStoredNotifications()
  const index = notifications.findIndex((n) => n.id === id)

  if (index === -1) {
    throw new Error(`Notification with ID ${id} not found`)
  }

  notifications.splice(index, 1)
  saveNotifications(notifications)

  return true
}

/**
 * Mark all notifications as read
 * @returns {Promise<Array>} Updated notifications array
 */
export const markAllAsRead = async () => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  const notifications = getStoredNotifications()

  const updatedNotifications = notifications.map((notification) => ({
    ...notification,
    read: true,
  }))

  saveNotifications(updatedNotifications)

  return updatedNotifications
}

/**
 * Create a new notification (for testing)
 * @param {Object} notification - Notification object
 * @returns {Promise<Object>} Created notification
 */
export const createNotification = async (notification) => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  const notifications = getStoredNotifications()

  // Generate a new ID
  const maxId = notifications.reduce((max, n) => Math.max(max, n.id), 0)
  const newNotification = {
    ...notification,
    id: maxId + 1,
    date: notification.date || new Date().toISOString(),
    read: notification.read || false,
  }

  notifications.unshift(newNotification)
  saveNotifications(notifications)

  return newNotification
}

