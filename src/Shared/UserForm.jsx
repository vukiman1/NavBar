import React from "react";
import { Button, Form, Input, Select } from "antd";
import { Link } from "react-router-dom";
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
  const onFinish = (values) => {
    console.log("Received values of form: ", values);
  };
  const prefixSelector = (
    <Form.Item name="prefix" noStyle>
      <Select
        style={{
          width: 70,
        }}
      >
        <Option value="84">+84</Option>
        <Option value="1">+1</Option>
      </Select>
    </Form.Item>
  );

  return (
    <Form
      {...formItemLayout}
      form={form}
      name="register"
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
            message: "Bạn chưa nhập số điện thoại!",
          },
        ]}
      >
        <Input
          addonBefore={prefixSelector}
          style={{
            width: "100%",
          }}
        />
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
        <Select placeholder="select your gender">
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
        <Button type="primary" htmlType="submit">
          Tạo mới
        </Button>
        <Button type="primary" danger>
          <Link to="/users">Quay lại</Link>
        </Button>
      </Form.Item>
    </Form>
  );
};
export default UserForm;
