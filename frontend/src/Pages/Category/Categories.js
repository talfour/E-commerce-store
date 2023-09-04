import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { axiosInstance } from "../../axios";
const Categories = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const response = await axiosInstance.get("category-children/");
      console.log(response);
      setCategories(response.data);
    } catch (error) {
      setCategories(["An error occured."]);
    }
  };

  return (
    <section className="text-gray-700 body-font overflow-hidden h-[80vh] mt-20">
      <div className="px-5 py-24 my-auto ">
        <ul className="text-center flex flex-row justify-center align-middle flex-wrap">
          {categories.map((category) => (
            <li
              className="p-5 mx-5 mb-5 w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow self-center"
              key={category.id}
            >
              <Link
                to={`${category.id}`}
                className="hover:text-blue-400 font-bold"
              >
                {category.name}
              </Link>
              {category.children.length > 0 && (
                <ul className="tree-list">
                  {category.children.map((childCategory) => (
                    <li key={childCategory.id}>
                      <Link
                        to={`${childCategory.id}`}
                        className="hover:text-blue-400"
                      >
                        {childCategory.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Categories;
