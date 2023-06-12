import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { axiosInstance } from "../axios";
import Product from "./Product";

const CategoryDetail = () => {
  const [category, setCategory] = useState();
  const [products, setProducts] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isNotFound, setIsNotFound] = useState(false);
  const location = useLocation();
  const url = location.pathname;

  useEffect(() => {
    const getCategory = async () => {
      try {
        const response = await axiosInstance.get(`${url}/`);
        if (response.status === 200) {
            setCategory(response.data.name);
            setProducts(response.data.products)
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
        <h1 className="pt-5 text-center text-2xl">{category}</h1>
        <div className="flex items-center p-4 gap-4 flex-wrap align-middle justify-center">
          {products.map((product) => (
            <Product key={product.id} product={product} />
          ))}
        </div>
      </div>
    );
};

export default CategoryDetail;
