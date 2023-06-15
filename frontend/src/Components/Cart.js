import React, { useEffect, useState } from "react";
import { axiosInstance } from "../axios";
import defaultImage from "../images/thenounproject.svg";
import Popup from "./Popup";
const Cart = () => {
  const [shoppingCart, setShoppingCart] = useState([]);
  const [totalPrice, setTotalPrice] = useState();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [name, setName] = useState("");
  const [sureName, setSureName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [city, setCity] = useState("");

  const getShoppingCart = async () => {
    try {
      const response = await axiosInstance.get("cart/get_cart_data/");
      setShoppingCart(response.data.cart_items);
      setTotalPrice(response.data.total_price);
    } catch (error) {
      console.log(error);
    }
  };

  const getNewPrice = async () => {
    try {
      const response = await axiosInstance.get("cart/get_cart_data/");
      setTotalPrice(response.data.total_price);
    } catch (error) {
      console.log(error);
    }
  };

  const handleRemoveItem = async (id) => {
    try {
      const response = await axiosInstance.delete(`cart/${id}/remove/`);
      if (response.status === 200) {
        const filteredProducts = shoppingCart.filter(
          (product) => product.id !== id
        );
        setShoppingCart(filteredProducts);
        getNewPrice();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleAmountChange = async (id, mode) => {
    try {
      let selectedProduct = shoppingCart.find((product) => product.id === id);
      const currentQuantity = selectedProduct.quantity;
      if (currentQuantity > 1) {
        if (mode === "decrease") {
          const response = await axiosInstance.post(`cart/${id}/add/`, {
            quantity: -1,
          });
          if (response.status === 200) {
            updateProductQuantity(id, currentQuantity - 1);
          }
        }
      }
      if (currentQuantity >= 1) {
        if (mode === "increase") {
          const response = await axiosInstance.post(`cart/${id}/add/`, {
            quantity: 1,
          });
          if (response.status === 200) {
            updateProductQuantity(id, currentQuantity + 1);
          }
        }
      }
      getNewPrice();
    } catch (error) {
      console.log(error);
    }
  };

  const updateProductQuantity = (id, quantity) => {
    const updatedProducts = shoppingCart.map((product) => {
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

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  const handleOrderCreate = async () => {
    console.log(shoppingCart);
    const response = await axiosInstance.post(`order/`, {
      first_name: name,
      last_name: sureName,
      email: email,
      address: address,
      postal_code: postalCode,
      city: city
    });
  };

  useEffect(() => {
    getShoppingCart();
  }, []);
  return (
    <div>
      {isPopupOpen && (
        <Popup
          handleClose={() => togglePopup()}
          content={
            <div>
              <form className="w-full">
                <div className="flex flex-wrap -mx-3 mb-6 justify-center align-middle">
                  <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                    <label
                      className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                      htmlFor="grid-first-name"
                    >
                      Imię
                    </label>
                    <input
                      className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                      id="grid-first-name"
                      type="text"
                      placeholder="Imię"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="w-full md:w-1/2 px-3">
                    <label
                      className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                      htmlFor="grid-last-name"
                    >
                      Nazwisko
                    </label>
                    <input
                      className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                      id="grid-last-name"
                      type="text"
                      placeholder="Nazwisko"
                      value={sureName}
                      onChange={(e) => setSureName(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex flex-wrap -mx-3 mb-6">
                  <div className="w-full px-3">
                    <label
                      className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                      htmlFor="grid-email"
                    >
                      Email
                    </label>
                    <input
                      className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                      id="grid-email"
                      type="email"
                      placeholder="email@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex flex-wrap -mx-3 mb-2">
                  <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                    <label
                      className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                      htmlFor="grid-address"
                    >
                      Adres
                    </label>
                    <input
                      className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                      id="grid-address"
                      type="text"
                      placeholder="Adres 1/1"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>
                  <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                    <label
                      className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                      htmlFor="grid-city"
                    >
                      Miasto
                    </label>
                    <input
                      className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                      id="grid-city"
                      type="text"
                      placeholder="Miasto"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    />
                  </div>
                  <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                    <label
                      className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                      htmlFor="grid-zip"
                    >
                      Kod pocztowy
                    </label>
                    <input
                      className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                      id="grid-zip"
                      type="text"
                      placeholder="00-000"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                    />
                  </div>
                </div>
                <div className="md:flex items-center justify-center">
                  <div className="">
                    <button
                      className="shadow bg-pink-400 hover:bg-pink-500 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
                      type="button"
                      onClick={handleOrderCreate}
                    >
                      Zamów
                    </button>
                  </div>
                </div>
              </form>
            </div>
          }
        />
      )}
      <div className="h-fit bg-gray-100 pt-20">
        <h1 className="mb-10 text-center text-2xl font-bold">Twój koszyk</h1>
        {shoppingCart.length === 0 ? (
          <h1 className="mb-10 text-center text-2xl font-bold">
            Nic tu nie ma, dodaj produkty do koszyka!
          </h1>
        ) : (
          <div className="mx-auto max-w-5xl justify-center px-6 md:flex md:space-x-6 xl:px-0">
            <div className="rounded-lg md:w-2/3">
              {shoppingCart.map((item) => (
                <div
                  key={item.id}
                  className="justify-between mb-6 rounded-lg bg-white p-6 shadow-md sm:flex sm:justify-start"
                >
                  <img
                    src={item.image_url ? item.image_url : defaultImage}
                    alt={item.name}
                    className="w-full rounded-lg sm:w-40 sm:h-20 h-40 object-cover"
                  />
                  <div className="sm:ml-4 sm:flex sm:w-full sm:justify-between">
                    <div className="mt-5 sm:mt-0">
                      <h2 className="text-lg font-bold text-gray-900">
                        {item.name}
                      </h2>
                      <p className="mt-1 text-xs text-gray-700">{item.brand}</p>
                    </div>
                    <div className="mt-4 flex justify-between sm:space-y-6 sm:mt-0 sm:block sm:space-x-6">
                      <div className="flex items-center border-gray-100">
                        <span
                          onClick={() =>
                            handleAmountChange(item.id, "decrease")
                          }
                          className="cursor-pointer rounded-l bg-gray-100 py-1 px-3.5 duration-100 hover:bg-blue-500 hover:text-blue-50"
                        >
                          {" "}
                          -{" "}
                        </span>
                        <input
                          className="h-8 w-8 border bg-white text-center text-xs outline-none"
                          type="number"
                          value={item.quantity}
                          readOnly={true}
                          min="1"
                        />
                        <span
                          onClick={() =>
                            handleAmountChange(item.id, "increase")
                          }
                          className="cursor-pointer rounded-r bg-gray-100 py-1 px-3 duration-100 hover:bg-blue-500 hover:text-blue-50"
                        >
                          {" "}
                          +{" "}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <p className="text-sm">{item.total_price}zł</p>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="h-5 w-5 cursor-pointer duration-150 hover:text-red-500"
                          onClick={() => handleRemoveItem(item.id)}
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
                <p className="text-gray-700 ">Łącznie</p>
                <p className="text-gray-700">{totalPrice}zł</p>
              </div>
              <div className="flex justify-between">
                <p className="text-gray-700">Dostawa</p>
                <p className="text-gray-700">10zł</p>
              </div>
              <hr className="my-4" />
              <div className="flex justify-between">
                <p className="text-lg font-bold">Łącznie</p>
                <div className="">
                  <p className="mb-1 text-lg font-bold text-right">
                    {totalPrice + 10}zł
                  </p>
                  <p className="text-sm text-gray-700">including VAT</p>
                </div>
              </div>
              <button
                onClick={togglePopup}
                className="mt-6 w-full rounded-md bg-blue-500 py-1.5 font-medium text-blue-50 hover:bg-blue-600"
              >
                Przejdź do płatności
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
