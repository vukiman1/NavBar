import { createContext, useState } from "react";

export const DataContext = createContext({});

export const DataContextProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState("light");
  const [collapsed, setCollapsed] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

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
