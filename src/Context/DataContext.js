"use client"

import { createContext, useState, useEffect } from "react"

const DataContext = createContext({})

const DataProvider = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false)
  const [currentTheme, setCurrentTheme] = useState("light") // Add this state
  const [themeStyle, setThemeStyle] = useState({
    backgroundColor: "#fff",
    color: "#000",
  })
  const [isLogin, setIsLogin] = useState(false)

  // Check login status on component mount
  useEffect(() => {
    const user = localStorage.getItem("user")
    if (user) {
      setIsLogin(true)
    }

    // Load saved theme preference
    const savedTheme = localStorage.getItem("theme")
    if (savedTheme) {
      setCurrentTheme(savedTheme)
      updateThemeStyle(savedTheme)
    }
  }, [])

  // Update theme styles based on theme name
  const updateThemeStyle = (themeName) => {
    if (themeName === "dark") {
      setThemeStyle({
        backgroundColor: "#333",
        color: "#fff",
      })
      document.body.classList.add("dark")
    } else {
      setThemeStyle({
        backgroundColor: "#fff",
        color: "#000",
      })
      document.body.classList.remove("dark")
    }
  }

  const toggleTheme = () => {
    const newTheme = currentTheme === "light" ? "dark" : "light"
    setCurrentTheme(newTheme)
    updateThemeStyle(newTheme)
    localStorage.setItem("theme", newTheme) // Save theme preference
  }

  // Handle logout
  const logout = () => {
    localStorage.removeItem("user")
    sessionStorage.removeItem("user")
    setIsLogin(false)
  }

  const value = {
    collapsed,
    setCollapsed,
    themeStyle,
    currentTheme,
    setCurrentTheme, // Export this function
    toggleTheme,
    isLogin,
    setIsLogin,
    logout,
  }

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export { DataContext, DataProvider }

