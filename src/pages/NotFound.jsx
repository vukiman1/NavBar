import React from "react";
import { Button, Result } from "antd";
import { NavLink } from "react-router-dom";

const NotFound = () => (
  <Result
    status="404"
    title="404"
    subTitle="Xin lỗi! Trang này hiện không tồn tại.."
    extra={
      <NavLink to="/users">
        <Button type="primary">Quay lại trang chủ</Button>
      </NavLink>
    }
  />
);
export default NotFound;
