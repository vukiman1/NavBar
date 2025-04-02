"use client"

import { useContext, useState, useEffect, useRef } from "react"
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SolutionOutlined,
  LogoutOutlined,
  BellOutlined,
  SearchOutlined,
  UserOutlined,
  BankOutlined,
  FileTextOutlined,
  LoadingOutlined,
} from "@ant-design/icons"
import { Button, Badge, Avatar, Typography, Layout, Dropdown, Space, Input, List, Spin } from "antd"
import { DataContext } from "../../Context/DataContext"
import "./Header.css"
import { Link, useNavigate } from "react-router-dom"
import { searchEntities } from "./searchApi"

const { Text } = Typography
const { Header } = Layout

const HeaderBar = () => {
  const { collapsed, setCollapsed, themeStyle } = useContext(DataContext)
  const [searchValue, setSearchValue] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [userData, setUserData] = useState(null)
  const searchRef = useRef(null)
  const navigate = useNavigate()

  // Get user data from localStorage on component mount
  useEffect(() => {
    const userStr = localStorage.getItem("user")
    if (userStr) {
      try {
        const user = JSON.parse(userStr)
        setUserData(user)
      } catch (error) {
        console.error("Error parsing user data from localStorage:", error)
      }
    }
  }, [])

  const items = [
    {
      key: "1",
      label: (
        <Link to="/info" className="dropdown-item">
          <SolutionOutlined style={{ marginRight: "8px" }} />
          Thông tin cá nhân
        </Link>
      ),
    },
    {
      key: "4",
      danger: true,
      label: (
        <div
          className="dropdown-item"
          onClick={() => {
            localStorage.removeItem("user")
            navigate("/login")
          }}
        >
          <LogoutOutlined style={{ marginRight: "8px" }} />
          Đăng xuất
        </div>
      ),
    },
  ]

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value
    setSearchValue(value)

    if (value.trim()) {
      setIsSearching(true)
      setShowResults(true)

      // Debounce search to avoid too many API calls
      const timeoutId = setTimeout(() => {
        searchEntities(value)
          .then((results) => {
            setSearchResults(results)
            setIsSearching(false)
          })
          .catch((error) => {
            console.error("Search error:", error)
            setIsSearching(false)
          })
      }, 300)

      return () => clearTimeout(timeoutId)
    } else {
      setSearchResults([])
      setIsSearching(false)
      setShowResults(false)
    }
  }

  // Handle click on search result
  const handleResultClick = (item) => {
    setSearchValue("")
    setShowResults(false)

    // Navigate to the appropriate edit page based on entity type
    switch (item.type) {
      case "user":
        navigate(`/users/edit/${item.id}`)
        break
      case "company":
        navigate(`/companies/edit/${item.id}`)
        break
      case "jobpost":
        navigate(`/jobposts/edit/${item.id}`)
        break
      default:
        console.error("Unknown entity type:", item.type)
    }
  }

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Render icon based on entity type
  const getEntityIcon = (type) => {
    switch (type) {
      case "user":
        return <UserOutlined style={{ color: "#1890ff" }} />
      case "company":
        return <BankOutlined style={{ color: "#52c41a" }} />
      case "jobpost":
        return <FileTextOutlined style={{ color: "#fa8c16" }} />
      default:
        return <SearchOutlined />
    }
  }

  // Render entity type label
  const getEntityLabel = (type) => {
    switch (type) {
      case "user":
        return <span className="entity-label user">Người dùng</span>
      case "company":
        return <span className="entity-label company">Công ty</span>
      case "jobpost":
        return <span className="entity-label jobpost">Tin tuyển dụng</span>
      default:
        return null
    }
  }

  return (
    <Header
      className="Header_Container"
      style={{
        ...themeStyle,
        padding: "0 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxShadow: "0 3px 10px rgba(0,0,0,0.08)",
        height: "64px",
        position: "sticky",
        top: 0,
        zIndex: 1000,
        transition: "all 0.3s ease",
      }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(!collapsed)}
          style={{
            ...themeStyle,
            fontSize: "18px",
            width: 48,
            height: 48,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginRight: "16px",
            borderRadius: "8px",
            transition: "all 0.2s ease",
          }}
          className="menu-toggle-button"
        />
        <Text
          strong
          style={{
            fontSize: "22px",
            ...themeStyle,
            marginRight: "24px",
            letterSpacing: "0.5px",
          }}
        >
          Dashboard
        </Text>

        <div
          className="search-container"
          style={{ display: "flex", alignItems: "center", position: "relative" }}
          ref={searchRef}
        >
          <Input
            prefix={
              isSearching ? (
                <Spin indicator={<LoadingOutlined style={{ fontSize: 16, color: "rgba(0,0,0,0.45)" }} spin />} />
              ) : (
                <SearchOutlined style={{ color: "rgba(0,0,0,0.45)" }} />
              )
            }
            placeholder="Tìm kiếm người dùng, công ty, tin tuyển dụng..."
            style={{
              width: "350px",
              borderRadius: "8px",
              backgroundColor: themeStyle.backgroundColor === "#fff" ? "#f5f5f5" : "rgba(255,255,255,0.1)",
              border: "none",
              transition: "all 0.3s ease",
            }}
            className="search-input"
            value={searchValue}
            onChange={handleSearchChange}
            onFocus={() => {
              if (searchResults.length > 0) {
                setShowResults(true)
              }
            }}
          />

          {/* Search Results Dropdown */}
          {showResults && (
            <div
              className="search-results-dropdown"
              style={{
                position: "absolute",
                top: "100%",
                left: 0,
                width: "100%",
                backgroundColor: themeStyle.backgroundColor === "#fff" ? "#fff" : "#333",
                boxShadow: "0 6px 16px rgba(0,0,0,0.12)",
                borderRadius: "8px",
                marginTop: "8px",
                zIndex: 1001,
                maxHeight: "400px",
                overflowY: "auto",
              }}
            >
              {isSearching ? (
                <div className="search-loading" style={{ padding: "20px", textAlign: "center" }}>
                  <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
                  <div style={{ marginTop: "8px", ...themeStyle }}>Đang tìm kiếm...</div>
                </div>
              ) : searchResults.length > 0 ? (
                <List
                  itemLayout="horizontal"
                  dataSource={searchResults}
                  renderItem={(item) => (
                    <List.Item
                      className="search-result-item"
                      onClick={() => handleResultClick(item)}
                      style={{
                        cursor: "pointer",
                        padding: "12px 16px",
                        transition: "background-color 0.2s ease",
                        borderBottom:
                          themeStyle.backgroundColor === "#fff"
                            ? "1px solid rgba(0,0,0,0.06)"
                            : "1px solid rgba(255,255,255,0.1)",
                      }}
                    >
                      <List.Item.Meta
                        avatar={getEntityIcon(item.type)}
                        title={
                          <div style={{ ...themeStyle, display: "flex", justifyContent: "space-between" }}>
                            <span>{item.name}</span>
                            {getEntityLabel(item.type)}
                          </div>
                        }
                        description={
                          <Text
                            style={{
                              color:
                                themeStyle.backgroundColor === "#fff" ? "rgba(0,0,0,0.45)" : "rgba(255,255,255,0.65)",
                              fontSize: "12px",
                            }}
                          >
                            {item.description}
                          </Text>
                        }
                      />
                    </List.Item>
                  )}
                />
              ) : (
                searchValue.trim() !== "" && (
                  <div
                    className="no-results"
                    style={{
                      padding: "20px",
                      textAlign: "center",
                      ...themeStyle,
                    }}
                  >
                    Không tìm thấy kết quả nào
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </div>

      <Space size={24} style={{ height: "100%" }}>
        <Badge
          count={3}
          size="small"
          style={{
            backgroundColor: "#1890ff",
            boxShadow: "0 2px 5px rgba(24,144,255,0.3)",
          }}
        >
          <Button
            type="text"
            icon={<BellOutlined style={{ fontSize: "20px" }} />}
            style={{
              ...themeStyle,
              width: 40,
              height: 40,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "8px",
              transition: "all 0.2s ease",
            }}
            className="notification-button"
          />
        </Badge>

        <Dropdown
          menu={{
            items,
          }}
          placement="bottomRight"
          trigger={["click"]}
          overlayStyle={{
            minWidth: "180px",
            borderRadius: "8px",
            boxShadow: "0 6px 16px rgba(0,0,0,0.08)",
          }}
        >
          <div
            style={{
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              padding: "4px 8px",
              borderRadius: "24px",
              transition: "all 0.3s ease",
              backgroundColor: themeStyle.backgroundColor === "#fff" ? "rgba(0,0,0,0.02)" : "rgba(255,255,255,0.05)",
              border:
                themeStyle.backgroundColor === "#fff"
                  ? "1px solid rgba(0,0,0,0.06)"
                  : "1px solid rgba(255,255,255,0.1)",
            }}
            className="user-profile-container"
          >
            <Text
              strong
              style={{
                marginRight: "12px",
                fontSize: "14px",
                ...themeStyle,
              }}
            >
              {userData?.fullName && `Xin chào, ${userData.fullName}`}
            </Text>
            <Avatar
              size={40}
              src={userData?.avatarUrl}
              style={{
                backgroundColor: "#1890ff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                border: "2px solid #fff",
              }}
            >
              {userData?.fullName ? userData.fullName[0].toUpperCase() : "U"}
            </Avatar>
          </div>
        </Dropdown>
      </Space>
    </Header>
  )
}

export default HeaderBar

