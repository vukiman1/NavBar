import { createContext, useState, useEffect } from "react";

export const DataContext = createContext({});

export const DataContextProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState("light");
  const [collapsed, setCollapsed] = useState(false);
  const [isLogin, setIsLogin] = useState(null);

  // Check localStorage for "auth" and set "isLogin" accordingly
  useEffect(() => {
    const storedAuth = localStorage.getItem("auth");
    if (storedAuth === null) {
      localStorage.setItem("auth", "false");
      setIsLogin(false);
    } else {
      setIsLogin(storedAuth === "true");
    }
  }, []);

  useEffect(() => {
    if (isLogin !== null) {
      localStorage.setItem("auth", isLogin.toString());
    }
  }, [isLogin]);

  const themeStyle = {
    night: {
      backgroundColor: "#001529",
      color: "#fff",
    },
    day: {
      backgroundColor: "#fff",
      color: "#001529",
    },
  };

  return (
    <DataContext.Provider
      value={{
        currentTheme,
        setCurrentTheme,
        themeStyle: themeStyle[currentTheme === "light" ? "day" : "night"],
        collapsed,
        setCollapsed,
        isLogin,
        setIsLogin,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
