import { useState } from "react";
import { axiosInstance } from "../../axios";
import defaultImage from "../../assets/thenounproject.svg";
const CartProduct = ({
  products,
  setShoppingCart,
  setTotalPrice,
  setNotification,
  setIsNotificationVisible,
  getShoppingCart,
  setDiscount,
  totalPrice,
  discount,
  couponCode,
  togglePopup,
}) => {
  const [coupon, setCoupon] = useState("");
  const handleRemoveItem = async (id) => {
    const response = await axiosInstance.delete(`cart/${id}/remove/`);
    if (response.status === 200) {
      const filteredProducts = products.filter((product) => product.id !== id);
      setShoppingCart(filteredProducts);
      getNewPrice();
    }
  };
  // Get updated price.
  const getNewPrice = async () => {
    const response = await axiosInstance.get("cart/get_cart_data/");
    if (response.status === 200) {
      setTotalPrice(response.data.total_price);
    }
  };
  const handleCoupon = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post("coupons/coupon_apply/", {
        code: coupon,
      });

      if (response.status === 200) {
        setIsNotificationVisible(true);
        setNotification({
          type: "success",
          message: "Coupon code was applied!",
        });
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setIsNotificationVisible(true);
        setNotification({
          type: "warning",
          message: "Coupon code is invalid",
        });
        setDiscount("");
      }
    }

    getShoppingCart();
  };

  const updateProductQuantity = (id, quantity) => {
    const updatedProducts = products.map((product) => {
      if (product.id === id) {
        const productPrice = product.price * quantity;
        return {
          ...product,
          total_price: productPrice.toFixed(2),
          quantity: quantity,
        };
      }
      return product;
    });
    setShoppingCart(updatedProducts);
  };
  const handleAmountChange = async (id, mode) => {
    let selectedProduct = products.find((product) => product.id === id);
    const currentQuantity = selectedProduct.quantity;
    if (currentQuantity > 1 && mode === "decrease") {
      const response = await axiosInstance.post(`cart/${id}/add/`, {
        quantity: -1,
      });
      if (response.status === 200) {
        updateProductQuantity(id, currentQuantity - 1);
      }
    }
    if (mode === "increase") {
      const response = await axiosInstance.post(`cart/${id}/add/`, {
        quantity: 1,
      });
      if (response.status === 200) {
        updateProductQuantity(id, currentQuantity + 1);
      }
    }
    getNewPrice();
  };
  return (
    <>
      <div className="rounded-lg md:w-2/3">
        {products.map((product) => (
          <div
            key={product.id}
            className="justify-between mb-6 rounded-lg bg-white p-6 shadow-md sm:flex sm:justify-start"
          >
            <img
              src={product.image_url || defaultImage}
              alt={product.name}
              className="w-full rounded-lg sm:w-40 sm:h-20 h-40 object-cover"
            />
            <div className="sm:ml-4 sm:flex sm:w-full sm:justify-between">
              <div className="mt-5 sm:mt-0">
                <h2 className="text-lg font-bold text-gray-900">
                  {product.name}
                </h2>
                <p className="mt-1 text-xs text-gray-700">{product.brand}</p>
              </div>
              <div className="mt-4 flex justify-between sm:space-y-6 sm:mt-0 sm:block sm:space-x-6">
                <div className="flex items-center border-gray-100">
                  <span
                    onClick={() => handleAmountChange(product.id, "decrease")}
                    className="cursor-pointer rounded-l bg-gray-100 py-1 px-3.5 duration-100 hover:bg-blue-500 hover:text-blue-50"
                  >
                    {" "}
                    -{" "}
                  </span>
                  <input
                    className="h-8 w-8 border border-gray-100 text-center text-xs outline-none"
                    type="number"
                    value={product.quantity}
                    readOnly={true}
                    min="1"
                  />
                  <span
                    onClick={() => handleAmountChange(product.id, "increase")}
                    className="cursor-pointer rounded-r bg-gray-100 py-1 px-3 duration-100 hover:bg-blue-500 hover:text-blue-50"
                  >
                    {" "}
                    +{" "}
                  </span>
                </div>
                <div className="flex items-center space-x-4">
                  <p className="text-sm">{product.total_price}$</p>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="h-5 w-5 cursor-pointer duration-150 hover:text-red-500"
                    onClick={() => handleRemoveItem(product.id)}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

          <div className="mt-6 h-full rounded-lg border bg-white p-6 shadow-md md:mt-0 md:w-1/3">
            <div className="mb-2 flex justify-between">
              <p className="text-gray-700 ">Total</p>
              <p className="text-gray-700">{totalPrice}$</p>
            </div>
            {discount !== "" && (
              <div className="mb-2 flex justify-between">
                <p className="text-gray-700">Coupon: {couponCode}</p>
                <p className="text-gray-700">-{discount}$</p>
              </div>
            )}
            <div className="mb-2 flex justify-between">
              <p className="text-gray-700">Shipping</p>
              <p className="text-gray-700">10$</p>
            </div>
            <hr className="my-4" />
            <div className="flex justify-between">
              <p className="text-lg font-bold">Total including shipping</p>
              <div className="">
                <p className="mb-1 text-lg font-bold text-right">
                  {totalPrice + 10}zł
                </p>
              </div>
            </div>
            <div className="flex flex-col">
              <p className="text-lg font-bold">Coupon</p>
              <input
                type="text"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
              />
              <button
                onClick={handleCoupon}
                className="mt-1 shadow bg-pink-400 hover:bg-pink-500 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded w-full lg:w-auto"
              >
                Apply coupon
              </button>
            </div>
            <button
              onClick={togglePopup}
              className="mt-6 w-full rounded-md bg-blue-500 py-1.5 font-medium text-blue-50 hover:bg-blue-600"
            >
              Pay
            </button>
          </div>

    </>
  );
};

export default CartProduct;
