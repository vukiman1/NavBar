import React, { useContext } from "react";
import { Table } from "antd";
import { DataContext } from "../../Context/DataContext";

const columns = [
  {
    title: "Name",
    dataIndex: "name",
  },
  {
    title: "Email",
    dataIndex: "email",
    sorter: {
      compare: (a, b) => a.chinese - b.chinese,
      multiple: 3,
    },
  },
  {
    title: "Math Score",
    dataIndex: "math",
    sorter: {
      compare: (a, b) => a.math - b.math,
      multiple: 2,
    },
  },
  {
    title: "English Score",
    dataIndex: "english",
    sorter: {
      compare: (a, b) => a.english - b.english,
      multiple: 1,
    },
  },
];
const data = [
  {
    key: "1",
    name: "John Brown",
    email: "a@gmail.com",
    math: 60,
    english: 70,
  },
  {
    key: "1",
    name: "John Brown",
    email: "b@gmail.com",
    math: 60,
    english: 70,
  },
];

const onChange = (pagination, filters, sorter, extra) => {
  console.log("params", pagination, filters, sorter, extra);
};

const Users = () => {
  const { setBreadcrumb } = useContext(DataContext);
  setBreadcrumb("Người dùng");
  return (
    <div>
      <Table
        style={{
          margin: "20px 0px",
        }}
        theme="dark"
        columns={columns}
        dataSource={data}
        onChange={onChange}
      />
    </div>
  );
};

export default Users;
