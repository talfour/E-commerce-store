import React, { useState, useEffect } from "react";
import { axiosInstance } from "../axios";
import Product from "./Product";

const ProductsList = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

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

  useEffect(() => {
    const handleSearch = async () => {
      if (searchQuery === "") {
        getData();
      } else if (searchQuery.length > 2) {
        try {
          const response = await axiosInstance.get(
            `product/?search=${searchQuery}`
          );
          if (response.status === 200) {
            setProducts(response.data);
          }
        } catch (error) {
          console.log(error);
        }
      }
    };
    handleSearch();
  }, [searchQuery]);

  return (
    <main>
      <h1 className="text-center lg:text-5xl text-3xl pt-10 pb-10 font-roboto font-bold">
        Dostępne produkty:
      </h1>
      <div class="my-3 lg:w-6/12 w-11/12 mx-auto">
        <div class="relative mb-4 flex w-full flex-wrap items-stretch">
          <input
            type="search"
            class="relative text-center bg-white text-black m-0 -mr-0.5 block w-[1px] min-w-0 flex-auto rounded-l border border-solid border-neutral-300 bg-clip-padding px-3 py-[0.25rem]  font-normal leading-[1.6] outline-none transition duration-200 ease-in-out focus:z-[3] focus:border-primary focus:text-black focus:shadow-[inset_0_0_0_1px_rgb(59,113,202)] focus:outline-none dark:border-neutral-600"
            placeholder="Szukaj produktów..."
            aria-label="Search"
            aria-describedby="button-addon3"
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <button
            class="text-white bg-blue-700 hover:bg-blue-800 relative z-[2] rounded-r border-1 border-primary px-6 py-2 text-xs font-medium uppercase text-primary transition duration-150 ease-in-out focus:outline-none focus:ring-0"
            type="button"
            id="button-addon3"
            data-te-ripple-init
          >
            Szukaj
          </button>
        </div>
      </div>
      <div className="flex items-center p-4 gap-4 flex-wrap align-middle justify-center">
        {products.map((product) => (
          <Product key={product.id} product={product} />
        ))}
      </div>
    </main>
  );
};

export default ProductsList;
