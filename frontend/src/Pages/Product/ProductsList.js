import React, { useState, useEffect } from "react";
import { axiosInstance } from "../../axios";
import Product from "./Product";

const ProductsList = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [itemLimit, setItemLimit] = useState(10)
  const [nextPageUrl, setNextPageUrl] = useState(null);
  const [previousPageUrl, setPreviousPageUrl] = useState(null);

  const getData = async () => {
    try {
      const response = await axiosInstance.get(`products/?limit=${itemLimit}`);
      setProducts(response.data.results);
      setNextPageUrl(response.data.next);
      setPreviousPageUrl(response.data.previous);
    } catch (error) {
      console.log(error);
    }
  };

const handleSearch = async () => {
  if (searchQuery.length > 2) {
    try {
      const response = await axiosInstance.get(
        `products/?limit=${itemLimit}&search=${searchQuery}`
      );
      if (response.status === 200) {
        setProducts(response.data.results);
        setNextPageUrl(response.data.next);
        setPreviousPageUrl(response.data.previous);
      }
    } catch (error) {
      console.log(error);
    }
  }
};

const goToNextPage = async () => {
  try {
    const response = await axiosInstance.get(nextPageUrl);
    setProducts(response.data.results);
    setNextPageUrl(response.data.next);
    setPreviousPageUrl(response.data.previous)
  } catch (error) {
    console.log(error);
  }
};


  const goToPreviousPage = async () => {
    try{
    const response = await axiosInstance.get(previousPageUrl);
    setProducts(response.data.results);
    setNextPageUrl(response.data.next);
    setPreviousPageUrl(response.data.previous);

  } catch (error) {
    console.log(error);
  }
  };

useEffect(() => {
  if (!searchQuery) {
    getData();
  } else {
    handleSearch();
  }
}, [searchQuery, itemLimit]);

  return (
    <main>
      <h1 className="text-center lg:text-5xl text-3xl pt-10 pb-10 font-roboto font-bold">
        Available products:
      </h1>
      <div className="my-3 lg:w-6/12 w-11/12 mx-auto">
        <div className="relative mb-4 flex w-full flex-wrap items-stretch">
          <input
            type="search"
            className="relative text-center bg-white text-black m-0 -mr-0.5 block w-[1px] min-w-0 flex-auto rounded-l border border-solid border-neutral-300 bg-clip-padding px-3 py-[0.25rem]  font-normal leading-[1.6] outline-none transition duration-200 ease-in-out focus:z-[3] focus:border-primary focus:text-black focus:shadow-[inset_0_0_0_1px_rgb(59,113,202)] focus:outline-none"
            placeholder="Search for products..."
            aria-label="Search"
            aria-describedby="button-addon3"
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <button
            className="text-white bg-blue-700 hover:bg-blue-800 relative z-[2] rounded-r border-1 border-primary px-6 py-2 text-xs font-medium uppercase text-primary transition duration-150 ease-in-out focus:outline-none focus:ring-0"
            type="button"
            id="button-addon3"
            data-te-ripple-init
          >
            Search
          </button>
        </div>
      </div>
      <div className="flex justify-end pr-5 items-center">
        <div className="relative flex items-center self-center">
          <p className=" text-lg pr-5">Products per page:</p>
          <select
            onChange={(e) => setItemLimit(e.target.value)}
            className=" font-bold rounded border-2 border-blue-700 text-gray-600 h-10 pl-5 pr-10 bg-white hover:border-gray-400 focus:outline-none appearance-none"
          >
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={25}>25</option>
          </select>
        </div>
      </div>
      <div className="flex items-center p-4 gap-4 flex-wrap align-middle justify-center">
        {products &&
          products.map((product) => (
            <Product key={product.id} product={product} />
          ))}
      </div>
      <div className="flex justify-center my-5">
        <button
          className="px-4 py-2 mr-2 bg-blue-500 text-white rounded hover:bg-blue-700"
          onClick={goToPreviousPage}
          disabled={!previousPageUrl}
        >
          Previous Page
        </button>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
          onClick={goToNextPage}
          disabled={!nextPageUrl}
        >
          Next Page
        </button>
      </div>
    </main>
  );
};

export default ProductsList;
