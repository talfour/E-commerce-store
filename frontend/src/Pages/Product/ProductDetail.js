import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { axiosInstance } from "../../axios";
import Stars from "../../Components/Stars";

import defaultImage from "../../assets/thenounproject.svg";

const ProductDetail = () => {
  const [product, setProduct] = useState();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isNotFound, setIsNotFound] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [images, setImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const location = useLocation();
  const url = location.pathname;

  const handleAddToCart = async (productID) => {
    try {
      await axiosInstance.post(`cart/${productID}/add/`, {
        quantity: quantity,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const prevSlide = () => {
    const isFirstSlide = currentImageIndex === 0;
    const newIndex = isFirstSlide ? images.length - 1 : currentImageIndex - 1;
    setCurrentImageIndex(newIndex);
  };

  const nextSlide = () => {
    const isLastSlide = currentImageIndex === images.length - 1;
    const newIndex = isLastSlide ? 0 : currentImageIndex + 1;
    setCurrentImageIndex(newIndex);
  };

  useEffect(() => {
    const getProduct = async () => {
      try {
        const response = await axiosInstance.get(`${url}/`);
        if (response.status === 200) {
          setProduct(response.data);
          if (response.data.images.length !== 0) {
            setImages(response.data.images);
          } else {
            setImages([{ id: 0, image: defaultImage }]);
          }
          setIsLoaded(true);
        }
      } catch (error) {
        console.log(error.response.data);
        setIsNotFound(true);
        setIsLoaded(true);
      }
    };
    getProduct();
    // eslint-disable-next-line
  }, []);

  return isNotFound ? (
    <h1 className="align-middle text-center text-5xl pt-10 pb-10 font-roboto font-bold">
      Nie znalezliśmy takiego produktu.
    </h1>
  ) : (
    isLoaded && !isNotFound && (
      <section className="text-gray-700 body-font overflow-hidden bg-white h-fit mt-20">
        <div className="container px-5 py-24 mx-auto">
          <div className="lg:w-4/5 mx-auto flex flex-wrap">
            <div className="max-w-[500px] h-[500px] w-full m-auto relative group">
              <div
                alt={product.name}
                style={{
                  backgroundImage: `url(${images[currentImageIndex]?.image})`,
                }}
                className="w-full h-full rounded-2xl bg-center bg-cover duration-500"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="lg:hidden group-hover:block w-8 h-8 absolute top-[50%] -translate-x-0 translate-y-[-50%] left-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer"
                onClick={prevSlide}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                />
              </svg>

              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="lg:hidden group-hover:block w-8 h-8 absolute top-[50%] -translate-x-0 translate-y-[-50%] right-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer"
                onClick={nextSlide}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                />
              </svg>
            </div>
            <div className="lg:w-1/2 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0">
              <h2 className="text-sm title-font text-gray-500 tracking-widest">
                {product.brand.name}
              </h2>
              <h1 className="text-gray-900 text-3xl title-font font-medium mb-1">
                {product.name}
              </h1>
              <Stars
                rating={product.rating}
                num_reviews={product.num_reviews}
                showNumReviews={true}
              />
              <div className="leading-relaxed whitespace-pre-line w-100 overflow-x-auto">
                {product.description}
              </div>

              <div className="flex justify-between align-middle mt-5">
                <span className="title-font font-medium text-2xl text-gray-900">
                  {product.price} zł
                </span>
              </div>
              <div className="mt-4 flex justify-between sm:space-y-6 sm:mt-0 sm:block sm:space-x-6">
                <div className="flex items-center mt-5 border-gray-100 w-full">
                  <span
                    onClick={() => {
                      if (quantity > 1) setQuantity((prev) => prev - 1);
                    }}
                    className="cursor-pointer rounded-l bg-gray-100 py-1 px-3.5 duration-100 hover:bg-blue-500 hover:text-blue-50"
                  >
                    {" "}
                    -{" "}
                  </span>
                  <input
                    className="h-8 w-8 border-[#f3f4f6] bg-white text-center text-xs outline-none"
                    type="number"
                    value={quantity}
                    readOnly={true}
                    min="1"
                  />
                  <span
                    onClick={() => setQuantity((prev) => prev + 1)}
                    className="cursor-pointer rounded-r bg-gray-100 py-1 px-3 duration-100 hover:bg-blue-500 hover:text-blue-50"
                  >
                    {" "}
                    +{" "}
                  </span>
                  {product.available ? (
                    <button
                      onClick={() => handleAddToCart(product.id)}
                      className="flex ml-auto text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                      Dodaj do koszyka
                    </button>
                  ) : (
                    <button
                      className="flex ml-auto text-white bg-red-500 border-0 py-2 px-6 focus:outline-none hover:bg-red-600 rounded"
                      disabled
                    >
                      Produkt tymczasowo niedostępny
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        {product.reviews.length > 0 && (
          <>
            <h1 className="text-center text-3xl mb-5">Reviews</h1>
            <div className="flex justify-center px-5">
              {product.reviews.map((review) => (
                <div key={review.comment} className="flex flex-col items-start">
                  <Stars rating={review.rating} />
                  <p className=" max-w-3xl mb-5">{review.comment}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </section>
    )
  );
};

export default ProductDetail;
