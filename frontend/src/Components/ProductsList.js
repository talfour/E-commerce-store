import React, { useState, useEffect } from "react";
import { axiosInstance } from "../axios";
import Product from "./Product";

const ProductsList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const response = await axiosInstance.get("product/");
      setProducts(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <main>
      <h1 className="text-center text-5xl pt-10 pb-10 font-roboto font-bold">
        Dostępne produkty:
      </h1>

      <div className="flex items-center p-4 gap-4 flex-wrap align-middle justify-center">
        {products.map((product) => (
          <Product key={product.id} product={product} />
        ))}
      </div>
    </main>
  );
};

export default ProductsList;
