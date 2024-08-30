import React from "react";
import { Button, Flex, Form, Input, message, Select } from "antd";
import { Link } from "react-router-dom";
import { BASE_URL } from "../Config/config";
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
const UserForm = () => {
  const [form] = Form.useForm();
  const onFinish = async () => {
    try {
      // Validate form fields
      const values = await form.validateFields();
      values.status = 'active'
      values.id = Math.random().toString(36).substr(2, 9)
      delete values.confirm;
      console.log("Received values of form: ", values);   
      // Send request
      const response = await fetch(`${BASE_URL}/users`, {
        method: "POST", // Use string for method
        headers: {
          Accept: 'application/json',
                  'Content-Type': 'application/json',
      },
        body: JSON.stringify(values),
      });
      
      // Check response
      if (response.ok) {
        message.success("Tạo thành công").then(() => {
          // window.location.reload();
        });
      }
    } catch (error) {
      console.error("Tạo thất bại:", error);
      message.danger("Tạo thất bại")
    }
  };
  

  return (
    <Form
      {...formItemLayout}
      form={form}
      onFinish={onFinish}
      initialValues={{
        residence: ["zhejiang", "hangzhou", "xihu"],
        prefix: "86",
      }}
      style={{
        maxWidth: 600,
      }}
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
        rules={[
          {
            required: true,
            message: "Bạn chưa điền ảnh đại diện!",
            whitespace: true,
          },
        ]}
      >
        <Input />
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
          <Option value="other">khác</Option>
        </Select>
      </Form.Item>
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
        name="password"
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

      <Form.Item
        name="confirm"
        label="Nhập lại mật khẩu"
        dependencies={["password"]}
        hasFeedback
        rules={[
          {
            required: true,
            message: "Chưa nhập lại mật khẩu!",
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue("password") === value) {
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
      <Form.Item {...tailFormItemLayout}>
      <Flex justify="space-evenly">

        <Button type="primary" htmlType="submit">
         + Tạo mới
        </Button>
        <Button type="primary" danger>
          <Link to="/users">- Quay lại</Link>
        </Button>
        </Flex>
      </Form.Item>
    </Form>
  );
};
export default UserForm;
