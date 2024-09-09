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
  InputNumber,
} from "antd";
import { storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../Config/config";
import { v4 } from "uuid";

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

const ProductForm = (props) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  console.log(props);

  const { product = { id: v4(), status: "active" } } = props;
  const [imageUpload, setImageUpload] = useState(
    product.imageUrl ||
      "https://img.freepik.com/free-psd/3d-illustration-human-avatar-profile_23-2150671142.jpg?size=338&ext=jpg&ga=GA1.1.1413502914.1720105200&semt=sph"
  );
  console.log(Object.keys(product).length);
  const onFinish = async () => {
    try {
      // Validate form fields
      const values = await form.validateFields();

      values.id = product.id;
      values.imageUrl = imageUpload;
      console.log(values);
      let response;
      let url = "";
      let method = "";
      if (Object.keys(product).length === 2) {
        url = `${BASE_URL}/products`;
        method = "POST";
        delete values.confirm;
      } else {
        url = `${BASE_URL}/products/${product.id}`;
        method = "PUT";
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
          Object.keys(product).length === 2
            ? "Tạo thành công"
            : "Sửa thành công"
        );
        setTimeout(() => {
          navigate("/products");
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
    info.file.status = "uploading";
    console.log(product.id);

    const file = info.file.originFileObj;

    // Sử dụng FileReader để đọc ảnh
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => {
      const img = new Image();
      img.src = reader.result;

      img.onload = () => {
        // Tính toán tỷ lệ giữ nguyên khung hình
        const maxWidth = 200; // Chiều rộng tối đa
        const maxHeight = 200; // Chiều cao tối đa
        let width = img.naturalWidth;
        let height = img.naturalHeight;

        if (width > height) {
          if (width > maxWidth) {
            height = height * (maxWidth / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = width * (maxHeight / height);
            height = maxHeight;
          }
        }

        // Tạo canvas với kích thước 100x100px
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height); // Vẽ ảnh vào canvas với kích thước mới, giữ nguyên tỷ lệ

        // Chuyển canvas thành Blob để upload
        canvas.toBlob((blob) => {
          const imageRef = ref(storage, `Products/${product.id}`);
          uploadBytes(imageRef, blob).then(() => {
            // Upload thành công, lấy URL của ảnh
            getDownloadURL(imageRef).then((url) => {
              setImageUpload(url);
              console.log(url);
            });
          });
          info.file.status = "done";
        }, file.type); // Blob sẽ có cùng loại với file gốc (jpeg, png, ...)
      };
    };
  };

  return (
    <Form
      {...formItemLayout}
      form={form}
      onFinish={onFinish}
      style={{
        maxWidth: 600,
      }}
      initialValues={product}
      scrollToFirstError
    >
      <Form.Item
        name="name"
        label="Tên Sản Phẩm"
        tooltip="Tên sản phẩm?"
        rules={[
          {
            required: true,
            message: "Bạn chưa nhập tên sản phẩm!",
            whitespace: true,
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="imageUrl"
        label="Ảnh sản phẩm"
        tooltip="Điền link ảnh vào đây!"
      >
        <Upload onChange={handleChange} maxCount={1} listType="picture">
          <Button>Chọn ảnh sản phẩm</Button>
        </Upload>
      </Form.Item>
      <Form.Item
        name="price"
        label="Giá sản phẩm"
        rules={[
          {
            required: true,
            message: "Bạn chưa nhập giá sản phẩm!",
          },
        ]}
      >
        <InputNumber />
      </Form.Item>

      <Form.Item
        name="quantity"
        label="Tồn kho"
        rules={[
          {
            required: true,
            message: "Bạn chưa điền số lượng tồn kho!",
          },
        ]}
      >
        <InputNumber />
      </Form.Item>

      {Object.keys(product).length === 2 ? null : (
        <>
          <Form.Item name="status" label="Trạng thái">
            <Select placeholder="Chọn trạng thái">
              <Option value="active" style={{ color: "green" }}>
                Đang bán
              </Option>
              <Option value="inactive" style={{ color: "red" }}>
                Ẩn
              </Option>
            </Select>
          </Form.Item>
        </>
      )}

      <Form.Item
        name="category"
        label="Loại hàng"
        rules={[
          {
            required: true,
            message: "Bạn chưa chọn loại hàngh!",
          },
        ]}
      >
        <Select placeholder="Chọn loại hàng">
          <Option value="shoes">Giày dép</Option>
          <Option value="technology">Điện tử</Option>
          <Option value="other">Khác</Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="description"
        label="Mô tả sản phẩm"
        rules={[
          {
            required: true,
            message: "Bạn chưa điền mô tả!",
            whitespace: true,
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item {...tailFormItemLayout}>
        <Row justify="space-evenly">
          <Col>
            <Button type="primary" htmlType="submit">
              {Object.keys(product).length === 2 ? "Tạo mới" : "Chỉnh sửa"}
            </Button>
          </Col>
          <Col>
            <Button type="primary" danger>
              <Link to="/products">Quay lại</Link>
            </Button>
          </Col>
        </Row>
      </Form.Item>
    </Form>
  );
};

export default ProductForm;
