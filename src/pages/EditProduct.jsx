import React from "react";
import { useParams } from "react-router-dom";
import { BASE_URL } from "../Config/config";
import useFetch from "../hooks/useFetch";
import { Spin } from "antd";
import ProductForm from "../Shared/ProductForm";
const EditProduct = () => {
  const { id } = useParams();
  const { data: product, isLoading } = useFetch(`${BASE_URL}/products/${id}`);
  console.log(product);

  return (
    <>{isLoading ? <Spin size="large" /> : <ProductForm product={product} />}</>
  );
};

export default EditProduct;
