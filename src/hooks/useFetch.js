import { useState, useEffect } from "react";

const useFetch = (url) => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(url);
        if (!res.ok) {
          setError("Lỗi kết nối đến csdl!");
        }
        const result = await res.json();

        setData(result);

        setIsLoading(false);
      } catch (error) {
        setError(error.message);
        setIsLoading(true);
      }
    };
    fetchData();
  }, [url]);
  return {
    data,
    error,
    isLoading,
  };
};

export default useFetch;
