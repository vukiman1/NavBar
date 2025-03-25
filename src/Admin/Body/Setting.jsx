import { Card, Input, Button, Form, Select, Switch, Upload, message, Row, Col, Divider } from "antd";
import { UploadOutlined, LockOutlined, SettingOutlined, BellOutlined, DatabaseOutlined, PictureOutlined, MailOutlined } from "@ant-design/icons";
import { useState } from "react";

const { Option } = Select;

const Setting = () => {
  const [loading, setLoading] = useState(false);

  const handleSave = (values) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      message.success("Cài đặt đã được lưu thành công!");
    }, 1000);
  };

  return (
    <Card title={<><SettingOutlined /> Cài Đặt Hệ Thống</>} style={{ maxWidth: 900, margin: "auto" }}>
      <Form layout="vertical" onFinish={handleSave}>
        
        {/* Cấu hình chung */}
        <Card title={<><DatabaseOutlined /> Cấu hình chung</>} bordered={false} style={{ marginBottom: 20 }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Tên hệ thống" name="systemName" initialValue="Hệ thống tuyển dụng">
                <Input placeholder="Nhập tên hệ thống" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Ngôn ngữ mặc định" name="language" initialValue="vi">
                <Select>
                  <Option value="vi">Tiếng Việt</Option>
                  <Option value="en">English</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* Logo & Giao diện */}
        <Card title={<><PictureOutlined /> Giao diện</>} bordered={false} style={{ marginBottom: 20 }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Logo">
                <Upload>
                  <Button icon={<UploadOutlined />}>Tải lên Logo</Button>
                </Upload>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Favicon">
                <Upload>
                  <Button icon={<UploadOutlined />}>Tải lên Favicon</Button>
                </Upload>
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* Bảo mật */}
        <Card title={<><LockOutlined /> Bảo mật</>} bordered={false} style={{ marginBottom: 20 }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Thay đổi mật khẩu" name="password">
                <Input.Password placeholder="Nhập mật khẩu mới" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Bảo mật 2 lớp (2FA)" name="twoFA" valuePropName="checked">
                <Switch />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* Thông báo */}
        <Card title={<><BellOutlined /> Thông báo</>} bordered={false} style={{ marginBottom: 20 }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Email nhận thông báo" name="notificationEmail" initialValue="admin@example.com">
                <Input prefix={<MailOutlined />} type="email" placeholder="Nhập email" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Gửi thông báo qua SMS" name="smsNotification" valuePropName="checked">
                <Switch />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* Lưu cài đặt */}
        <Divider />
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Lưu cài đặt
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default Setting;
