import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Spin, message } from "antd";
import { BASE_URL } from "../Config/config";
import UserForm from "./../Shared/UserForm";

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`${BASE_URL}/users/${id}`);
        const data = await response.json();
        setUser(data);
      } catch (error) {
        message.error("Lỗi khi tải dữ liệu người dùng!");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  // Handle form submission
  const handleUpdateUser = async (values) => {
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("Cập nhật thất bại!");
      }

      message.success("Cập nhật thành công!");
      navigate("/users"); // Chuyển hướng về danh sách người dùng
    } catch (error) {
      message.error("Cập nhật thất bại, vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Spin size="large" />;
  }

  return (
    <div>
      <h2>Chỉnh sửa người dùng</h2>
      <UserForm user={user} onSubmit={handleUpdateUser} />
    </div>
  );
};

export default EditUser;
