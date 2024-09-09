import React from "react";
import { Breadcrumb } from "antd";
import { NavLink, useLocation } from "react-router-dom";

const BreadCrumb = () => {
  const location = useLocation();

  let breadcrumb2 = location.pathname.includes("/edit")
    ? "Chỉnh sửa"
    : location.pathname.includes("/add")
    ? "Thêm mới"
    : "";

  let breadcrumb = location.pathname.includes("/products")
    ? "Sản phẩm"
    : location.pathname.includes("/users")
    ? "Tài khoản"
    : location.pathname.includes("/info")
    ? "Thông tin"
    : "";

  return (
    <Breadcrumb style={{ margin: "6px 0 0 16px" }}>
      <Breadcrumb.Item>
        <NavLink to="/">Home</NavLink>
      </Breadcrumb.Item>

      {breadcrumb !== "" ? (
        <Breadcrumb.Item>
          <NavLink
            to={
              breadcrumb === "Sản phẩm"
                ? "/products"
                : breadcrumb === "Người dùng"
                ? "/users"
                : breadcrumb === "Thông tin"
                ? "/info"
                : "/users"
            }
          >
            {breadcrumb}
          </NavLink>
        </Breadcrumb.Item>
      ) : null}

      {breadcrumb2 !== "" ? (
        <Breadcrumb.Item>{breadcrumb2}</Breadcrumb.Item>
      ) : null}
    </Breadcrumb>
  );
};

export default BreadCrumb;
