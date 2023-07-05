import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { axiosInstance } from "../axios";
import Product from "./Product";

const CategoryDetail = () => {
  const [categoryName, setCategoryName] = useState();
  const [categoryProducts, setCategoryProducts] = useState();
  const [children, setChildren] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isNotFound, setIsNotFound] = useState(false);
  const location = useLocation();
  const url = location.pathname;

  useEffect(() => {
    const getCategory = async () => {
      try {
        const response = await axiosInstance.get(`${url}/`);
        console.log(response.data);
        if (response.status === 200) {
          setCategoryName(response.data.name);
          setCategoryProducts(response.data.products)
          setChildren(response.data.children);
          setIsLoaded(true);
        }
      } catch (error) {
        console.log(error.response.data);
        setIsNotFound(true);
        setIsLoaded(true);
      }
    };
    getCategory();
  }, [url]);

  return (
    <div>
      {isLoaded && (
        <>
          <h1 className="pt-5 text-center text-2xl">{categoryName}</h1>
          {categoryProducts.length > 0
            ? categoryProducts.map((product) => (
                <div key={product.id}>
                  <div className="flex items-center p-4 gap-4 flex-wrap align-middle justify-center">
                    <Product key={product.id} product={product} />
                  </div>
                </div>
              ))
            : ""}
          {children.length > 0 ? (
            children.map((child) => (
              <div key={child.id}>
                <h2 className="pt-5 text-center text-2xl">{child.name}</h2>
                <div className="flex items-center p-4 gap-4 flex-wrap align-middle justify-center">
                  {child.products.map((product) => (
                    <Product key={product.id} product={product} />
                  ))}
                </div>
              </div>
            ))
          ) : ""}
        </>
      )}
      {isNotFound && <p>Category not found.</p>}
    </div>
  );
};

export default CategoryDetail;
