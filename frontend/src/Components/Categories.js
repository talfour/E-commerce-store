import React, { useEffect, useState } from "react";
import { axiosInstance } from "../axios";
const Categories = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const response = await axiosInstance.get("category/");
      setCategories(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ul>
      {categories.map((category) => (
        <li key={category.id}>{category.name}</li>
      ))}
    </ul>
  );
};

export default Categories;
