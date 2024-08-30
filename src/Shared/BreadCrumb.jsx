import React from "react";
import { Breadcrumb } from "antd";
import { NavLink, useLocation } from "react-router-dom";

const BreadCrumb = () => {
  const location = useLocation();

  let breadcrumb = "";
  let breadcrumb2 = "";

  if (location.pathname.includes("/edit")) {
    breadcrumb2 = "Chỉnh sửa";
  } else if (location.pathname.includes("/add")) {
    breadcrumb2 = "Thêm mới";
  }

  if (location.pathname.includes("/products")) {
    breadcrumb = "Sản phẩm";
  } else if (location.pathname.includes("/users")) {
    breadcrumb = "Tài khoản";
  }
  return (
    <Breadcrumb style={{ margin: "6px 0 0 16px" }}>
      <Breadcrumb.Item>
        <NavLink to="/">Home</NavLink>
      </Breadcrumb.Item>

      {breadcrumb !== "" ? (
        <Breadcrumb.Item>
          <NavLink to={breadcrumb === "Sản phẩm" ? "/products" : "/users"}>
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
