import React, { useState } from "react";
import {
  Button,
  Form,
  Input,
  message,
  Select,
  Row,
  Col,
  Upload,
  Image,
} from "antd";
import { storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../Config/config";
import { v4 } from "uuid";
import { ToTopOutlined } from "@ant-design/icons";
const { Option } = Select;
const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 8,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 16,
    },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

const UserForm = (props) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  let imgLink = "";
  let isChangAvt = false;
  const [imageUpload, setImageUpload] = useState(
    "https://img.freepik.com/free-psd/3d-illustration-human-avatar-profile_23-2150671142.jpg?size=338&ext=jpg&ga=GA1.1.1413502914.1720105200&semt=sph"
  );
  const { user = { id: v4(), status: "active", role: "user" } } = props;
  console.log(user);
  console.log(Object.keys(user).length);
  const onFinish = async () => {
    try {
      // Validate form fields
      const values = await form.validateFields();
      if (isChangAvt) {
        values.avatar = imgLink;
      }
      console.log(values);
      let response;
      let url = "";
      let method = "";
      if (Object.keys(user).length === 3) {
        url = `${BASE_URL}/users`;
        method = "POST";
        delete values.confirm;
      } else {
        url = `${BASE_URL}/users/${user.id}`;
        method = "PUT";
        values.avatar = user.avatar;
      }

      response = await fetch(url, {
        method,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        message.success(
          Object.keys(user).length === 3 ? "Tạo thành công" : "Sửa thành công"
        );
        setTimeout(() => {
          navigate("/users");
        }, 1000);
      } else {
        throw new Error("Đã xảy ra lỗi khi gửi yêu cầu");
      }
    } catch (error) {
      console.error("Xử lý thất bại:", error);
      message.error("Xử lý thất bại");
    }
  };

  const handleChange = (info) => {
    console.log(info);
    // info.file.status = "uploading";
    isChangAvt = true;
    setImageUpload(info.file.originFileObj);
    const imageRef = ref(storage, `Avatar/${user.id}`);
    uploadBytes(imageRef, imageUpload).then(() => {
      getDownloadURL(imageRef)
        .then((url) => {
          imgLink = url;
          user.avatar = url;
          console.log(url);
        })
        .then(() => {
          message.success("Upload ảnh thành công");
        });
    });
    info.file.status = "done";
  };

  return (
    <Form
      {...formItemLayout}
      form={form}
      onFinish={onFinish}
      style={{
        maxWidth: 600,
      }}
      initialValues={user}
      scrollToFirstError
    >
      <Form.Item
        name="name"
        label="Tên"
        tooltip="Tên hiển thị của bạn?"
        rules={[
          {
            required: true,
            message: "Bạn chưa nhập tên!",
            whitespace: true,
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="avatar"
        label="Ảnh đại diện"
        tooltip="Điền link ảnh vào đây!"
      >
        <Image width={100} src={user.avatar} />
        <Upload onChange={handleChange} maxCount={1} listType="picture">
          <Button icon={<ToTopOutlined />} style={{ marginLeft: "10px" }}>
            Tải lên ảnh đại diện
          </Button>
        </Upload>
      </Form.Item>
      <Form.Item
        name="email"
        label="E-mail"
        rules={[
          {
            type: "email",
            message: "Không đúng định dạng email!",
          },
          {
            required: true,
            message: "Bạn chưa nhập E-mail!",
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="phone"
        label="Số điện thoại"
        rules={[
          {
            required: true,
            message: "Bạn chưa điền số điện thoại!",
            whitespace: true,
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="gender"
        label="Giới tính"
        rules={[
          {
            required: true,
            message: "Bạn chưa nhập giới tính!",
          },
        ]}
      >
        <Select placeholder="Chọn giới tính">
          <Option value="male">Nam</Option>
          <Option value="female">Nữ</Option>
          <Option value="other">Khác</Option>
        </Select>
      </Form.Item>

      {Object.keys(user).length === 3 ? null : (
        <>
          <Form.Item name="status" label="Trạng thái">
            <Select placeholder="Chọn trạng thái">
              <Option value="active" style={{ color: "green" }}>
                Hoạt động
              </Option>
              <Option value="inactive" style={{ color: "red" }}>
                Khoá
              </Option>
            </Select>
          </Form.Item>
          <Form.Item name="rule" label="Quyền quản trị">
            <Select placeholder="Chọn quyền quản trị">
              <Option value="admin">Người quản trị</Option>
              <Option value="user">Người dùng</Option>
            </Select>
          </Form.Item>
        </>
      )}

      <Form.Item
        name="address"
        label="Địa chỉ"
        rules={[
          {
            required: true,
            message: "Bạn chưa điền địa chỉ!",
            whitespace: true,
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="passWord"
        label="Mật khẩu"
        rules={[
          {
            required: true,
            message: "Bạn chưa nhập mật khẩu!",
          },
        ]}
        hasFeedback
      >
        <Input.Password />
      </Form.Item>
      {Object.keys(user).length === 3 ? (
        <Form.Item
          name="confirm"
          label="Nhập lại mật khẩu"
          dependencies={["passWord"]}
          hasFeedback
          rules={[
            {
              required: true,
              message: "Chưa nhập lại mật khẩu!",
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("passWord") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("Mật khẩu không trùng khớp, vui lòng thử lại!")
                );
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>
      ) : null}

      <Form.Item {...tailFormItemLayout}>
        <Row justify="space-evenly">
          <Col>
            <Button type="primary" htmlType="submit">
              {Object.keys(user).length === 3 ? "Tạo mới" : "Chỉnh sửa"}
            </Button>
          </Col>
          <Col>
            <Button type="primary" danger>
              <Link to="/users">Quay lại</Link>
            </Button>
          </Col>
        </Row>
      </Form.Item>
    </Form>
  );
};

export default UserForm;
