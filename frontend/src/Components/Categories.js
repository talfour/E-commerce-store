import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
      setCategories(["Wystąpił błąd, spróbuj ponownie."]);
    }
  };

  return (
    <ul className="flex flex-col h-10 pt-5 items-center text-lg">
      {categories.map((category) => (
        <li className="pt-2" key={category.id}>
          <Link to={`${category.id}`} className="hover:text-blue-400">
            {category.name}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default Categories;
