import React, { useState, useEffect } from "react";
import {
  Button,
  Form,
  Input,
  Upload,
  Image,
  Row,
  Col,
  Card,
  DatePicker,
  Select,
  message,
} from "antd";
import { ToTopOutlined } from "@ant-design/icons";
import { storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";
import dayjs from "dayjs";
import "./UserForm.css";

const { Option } = Select;

const UserForm = ({ user }) => {
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState(user?.avatarUrl || "https://via.placeholder.com/120");

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        fullName: user.fullName,
        email: user.email,
        phone: user?.jobSeekerProfile?.phone || user?.company?.companyPhone,
        birthday: user?.jobSeekerProfile?.birthday ? dayjs(user.jobSeekerProfile.birthday) : null,
        gender: user?.jobSeekerProfile?.gender,
        maritalStatus: user?.jobSeekerProfile?.maritalStatus,
        companyName: user?.company?.companyName,
        companyLocation: user?.company?.location?.address,
      });
    }
  }, [user]);

  const handleUpload = async (info) => {
    const file = info.file.originFileObj;
    const imageRef = ref(storage, `Avatar/${user.id || v4()}`);

    try {
      const snapshot = await uploadBytes(imageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      setImageUrl(downloadURL);
      form.setFieldsValue({ avatarUrl: downloadURL });
    } catch (error) {
      console.error("Upload ảnh thất bại", error);
    }
  };

  const handleSave = (values) => {
    console.log("Saved Data:", values);
    message.success("Profile updated successfully!");
  };

  return (
    <Card className="profile-container">
      <Row gutter={[20, 20]}>
        {/* Avatar + User Info */}
        <Col xs={24} md={6} className="avatar-section">
          <Image className="avatar" width={120} src={imageUrl} />
          <h3>{user?.fullName || "User Name"}</h3>
          <p>{user?.email || "user@example.com"}</p>
          <Upload onChange={handleUpload} maxCount={1} showUploadList={false}>
            <Button icon={<ToTopOutlined />} className="change-photo-btn">
              Change Photo
            </Button>
          </Upload>
        </Col>

        {/* Profile Form */}
        <Col xs={24} md={12}>
          <h2 className="form-title">Profile Settings</h2>
          <Form form={form} layout="vertical" onFinish={handleSave}>
            <Form.Item name="fullName" label="Full Name">
              <Input />
            </Form.Item>

            <Form.Item name="email" label="Email">
              <Input disabled />
            </Form.Item>

            {user.roleName === "JOB_SEEKER" ? (
              <>
                <Form.Item name="phone" label="Phone Number">
                  <Input />
                </Form.Item>

                <Form.Item name="birthday" label="Birthday">
                  <DatePicker style={{ width: "100%" }} />
                </Form.Item>

                <Form.Item name="gender" label="Gender">
                  <Select>
                    <Option value="M">Male</Option>
                    <Option value="F">Female</Option>
                  </Select>
                </Form.Item>

                <Form.Item name="maritalStatus" label="Marital Status">
                  <Select>
                    <Option value="S">Single</Option>
                    <Option value="M">Married</Option>
                    <Option value="D">Divorced</Option>
                  </Select>
                </Form.Item>
              </>
            ) : (
              <>
                <Form.Item name="companyName" label="Company Name">
                  <Input disabled />
                </Form.Item>

                <Form.Item name="phone" label="Company Phone">
                  <Input />
                </Form.Item>

                <Form.Item name="companyLocation" label="Company Location">
                  <Input />
                </Form.Item>
              </>
            )}

            <Form.Item>
              <Button type="primary" htmlType="submit" className="save-btn">
                Save Profile
              </Button>
            </Form.Item>
          </Form>
        </Col>

        {/* Experience Section */}
        <Col xs={24} md={6} className="experience-section">
          <h3>Edit Experience</h3>
          <Form layout="vertical">
            <Form.Item name="experience" label="Experience in Work">
              <Input placeholder="Experience" />
            </Form.Item>
            <Form.Item name="details" label="Additional Details">
              <Input.TextArea placeholder="Additional details" />
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </Card>
  );
};

export default UserForm;
