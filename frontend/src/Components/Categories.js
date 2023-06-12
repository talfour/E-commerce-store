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
    <section className="text-gray-700 body-font overflow-hidden bg-white h-fit mt-20">
      <div className="px-5 py-24 my-auto">
        <ul className="text-center">
          {categories.map((category) => (
            <li className="pt-2" key={category.id}>
              <Link to={`${category.id}`} className="hover:text-blue-400">
                {category.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Categories;
