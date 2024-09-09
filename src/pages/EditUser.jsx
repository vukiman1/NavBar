import React from "react";
import { useParams } from "react-router-dom";
import { BASE_URL } from "../Config/config";
import useFetch from "../hooks/useFetch";
import { Spin } from "antd";
import UserForm from "./../Shared/UserForm";
const EditUser = () => {
  const { id } = useParams();
  const { data: user, isLoading } = useFetch(`${BASE_URL}/users/${id}`);
  // console.log(user);

  return <>{isLoading ? <Spin size="large" /> : <UserForm user={user} />}</>;
};

export default EditUser;
