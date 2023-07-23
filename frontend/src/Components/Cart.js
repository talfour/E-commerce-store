import React, { useEffect, useState } from "react";
import { axiosInstance } from "../axios";
import defaultImage from "../assets/thenounproject.svg";
import { Link } from "react-router-dom";
import Popup from "./Popup";
import Notification from "./Notification";

const Cart = ({userEmail, isUserLogged}) => {
  const [shoppingCart, setShoppingCart] = useState([]);
  const [totalPrice, setTotalPrice] = useState();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isConfirmationPopupOpen, setIsConfirmationPopupOpen] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: isUserLogged ? userEmail : "",
    address: "",
    address2: "",
    post_code: "",
    city: "",
  });
  const [isSaveAddr, setIsSaveAddr] = useState(false);
  const [isAddressSaved, setIsAddressSaved] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [showAddresses, setShowAddresses] = useState(false);
  const [coupon, setCoupon] = useState('');
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState('');
  const [isNotificationVisible, setIsNotificationVisible] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    getShoppingCart();
    isUserLogged && checkIfAddressIsSaved();
  }, []);

  //Check if User saved addresses in the database.
  const checkIfAddressIsSaved = async () => {
    const response = await axiosInstance.get("user/address/");
    if (response.data.length > 0) {
      setIsAddressSaved(true);
      setAddresses(response.data);
    }
  };

  // Retrieve shopping cart.
  const getShoppingCart = async () => {
    const response = await axiosInstance.get("cart/get_cart_data/");
    if (response.status === 200) {
      setShoppingCart(response.data.cart_items);
      setTotalPrice(response.data.total_price);
      if (response.data.discount !== 0) {
        setDiscount(response.data.discount)
        setCouponCode(response.data.coupon)
      }
    }
  };

  // Get updated price.
  const getNewPrice = async () => {
    const response = await axiosInstance.get("cart/get_cart_data/");
    if (response.status === 200) {
      setTotalPrice(response.data.total_price);
    }
  };

  const handleRemoveItem = async (id) => {
    const response = await axiosInstance.delete(`cart/${id}/remove/`);
    if (response.status === 200) {
      const filteredProducts = shoppingCart.filter(
        (product) => product.id !== id
      );
      setShoppingCart(filteredProducts);
      getNewPrice();
    }
  };

  const handleAmountChange = async (id, mode) => {
    let selectedProduct = shoppingCart.find((product) => product.id === id);
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

  const toggleConfirmationPopup = () => {
    setIsConfirmationPopupOpen(!isConfirmationPopupOpen);
    setShoppingCart([]);
  };

  const handleOrderCreate = async (e) => {
    e.preventDefault();
    const response = await axiosInstance.post("orders/", {
      ...formData,
    });
    if (isSaveAddr === true) {
      await axiosInstance.post("user/address/", {
        ...formData,
      });
    }
    if (response.status === 201) {
      setDiscount('');
      togglePopup();
      toggleConfirmationPopup();

      console.log('remove discount');
    }
  };

  const handleAddressChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleAddressSelection = (address) => {
    setFormData((prevData) => ({
      ...prevData,
      first_name: address.first_name,
      last_name: address.last_name,
      address: address.address,
      address2: address.address2 || "",
      post_code: address.post_code,
      city: address.city,
    }));
    setShowAddresses(false);
  };

const handleCoupon = async (e) => {
  e.preventDefault();
  try {
    const response = await axiosInstance.post("coupons/coupon_apply/", {
      code: coupon,
    });

    if (response.status === 200) {
      setIsNotificationVisible(true);
      setNotification({type: 'success', message: 'Kod rabatowy został zastosowany!'})
    }
  } catch (error) {
    if (error.response && error.response.status === 400) {
      setIsNotificationVisible(true);
      setNotification({
        type: "warning",
        message: "Nieprawidłowy kod rabatowy.",
      });
      setDiscount('');
    }
  }

  getShoppingCart();
};

  return (
    <div>
      {isConfirmationPopupOpen && (
        <Popup
          handleClose={toggleConfirmationPopup}
          content={
            <div>
              <h1 className="text-center text-lg">
                Twoje zamówienie zostało złożone.
              </h1>
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
              {shoppingCart.map((product) => (
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
                      <p className="mt-1 text-xs text-gray-700">
                        {product.brand}
                      </p>
                    </div>
                    <div className="mt-4 flex justify-between sm:space-y-6 sm:mt-0 sm:block sm:space-x-6">
                      <div className="flex items-center border-gray-100">
                        <span
                          onClick={() =>
                            handleAmountChange(product.id, "decrease")
                          }
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
                          onClick={() =>
                            handleAmountChange(product.id, "increase")
                          }
                          className="cursor-pointer rounded-r bg-gray-100 py-1 px-3 duration-100 hover:bg-blue-500 hover:text-blue-50"
                        >
                          {" "}
                          +{" "}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <p className="text-sm">{product.total_price}zł</p>
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
                <p className="text-gray-700 ">Łącznie</p>
                <p className="text-gray-700">{totalPrice}zł</p>
              </div>
              {discount !== "" && (
                <div className="mb-2 flex justify-between">
                  <p className="text-gray-700">Kod rabatowy: {couponCode}</p>
                  <p className="text-gray-700">-{discount}zł</p>
                </div>
              )}
              <div className="mb-2 flex justify-between">
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
                  <p className="text-sm text-gray-700">łącznie z VAT</p>
                </div>
              </div>
              <div className="flex flex-col">
                <p className="text-lg font-bold">Kod rabatowy</p>
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
                  Zatwierdź kod
                </button>
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
      {isPopupOpen && (
        <Popup
          handleClose={() => togglePopup()}
          content={
            <>
              <form className="w-full h-auto" onSubmit={handleOrderCreate}>
                <div className="flex flex-wrap -mx-3 justify-center align-middle md:mb-6">
                  <div className="w-full md:w-1/2 px-3 mb-2 md:mb-0">
                    <label
                      className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                      htmlFor="grid-first-name"
                    >
                      Imię
                    </label>
                    <input
                      className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
                      id="grid-first-name"
                      type="text"
                      placeholder="Imię"
                      value={formData.first_name}
                      required
                      name="first_name"
                      onChange={(e) => handleAddressChange(e)}
                    />
                  </div>
                  <div className="w-full md:w-1/2 px-3 mb-2 md:mb-0">
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
                      value={formData.last_name}
                      name="last_name"
                      required
                      onChange={(e) => handleAddressChange(e)}
                    />
                  </div>
                </div>
                {!isUserLogged && (
                  <div className="flex flex-wrap -mx-3 md:mb-6">
                    <div className="w-full px-3 mb-2 ">
                      <label
                        className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                        htmlFor="grid-email"
                      >
                        Email
                      </label>
                      <input
                        className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                        id="grid-email"
                        type="email"
                        placeholder="email@email.com"
                        value={formData.email}
                        required
                        name="email"
                        onChange={(e) => handleAddressChange(e)}
                      />
                    </div>
                  </div>
                )}
                <div className="flex flex-wrap -mx-3 md:mb-6">
                  <div className="w-full md:w-1/2 px-3 mb-2">
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
                      value={formData.address}
                      required
                      name="address"
                      onChange={(e) => handleAddressChange(e)}
                    />
                  </div>
                  <div className="w-full md:w-1/2 px-3 mb-2">
                    <label
                      className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                      htmlFor="grid-address"
                    >
                      Adres 2
                    </label>
                    <input
                      className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                      id="grid-address"
                      type="text"
                      placeholder=""
                      name="address2"
                      value={formData.address2}
                      onChange={(e) => handleAddressChange(e)}
                    />
                  </div>
                  <div className="w-full md:w-1/2 px-3 mb-2 md:mb-0">
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
                      name="city"
                      placeholder="Miasto"
                      value={formData.city}
                      onChange={(e) => handleAddressChange(e)}
                    />
                  </div>
                  <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
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
                      name="post_code"
                      value={formData.post_code}
                      onChange={(e) => handleAddressChange(e)}
                    />
                  </div>
                </div>
                {isUserLogged ? (
                  <div className="flex flex-wrap -mx-3 mb-3">
                    <div className="w-full px-3 mb-6">
                      <label
                        className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                        htmlFor="grid-zip"
                      >
                        Zapisać adres?
                      </label>
                      <input
                        className="appearance-none block bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                        id="grid-zip"
                        type="checkbox"
                        value={isSaveAddr}
                        onChange={() => setIsSaveAddr(!isSaveAddr)}
                      />
                    </div>
                  </div>
                ) : (
                  <h3 className="text-center italic mb-5">
                    Niezalogowani użytkownicy nie są w stanie śledzić swoich
                    zamówień na platformie.{" "}
                    <Link className="text-blue-500" to="/login">
                      Zaloguj się
                    </Link>
                  </h3>
                )}
                <div className="md:flex items-center justify-center mb-5">
                  <div className="">
                    <button
                      className="shadow bg-pink-400 hover:bg-pink-500 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded w-full lg:w-auto"
                      type="submit"
                    >
                      Zamów
                    </button>
                  </div>
                </div>
              </form>
              {/* If address is found */}
              {isAddressSaved && (
                <div className="flex uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                  <p
                    onClick={() => setShowAddresses(!showAddresses)}
                    className="pr-3 cursor-pointer mb-5"
                  >
                    {showAddresses ? "Ukryj adresy" : "Pokaż zapisane adresy"}
                  </p>
                  {showAddresses ? (
                    <svg
                      onClick={() => setShowAddresses(!showAddresses)}
                      className="cursor-pointer"
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                    >
                      <g transform="translate(0 20) scale(1 -1)">
                        <path
                          fill="currentColor"
                          fillRule="evenodd"
                          d="M16.707 10.293a1 1 0 0 1 0 1.414l-6 6a1 1 0 0 1-1.414 0l-6-6a1 1 0 1 1 1.414-1.414L9 14.586V3a1 1 0 0 1 2 0v11.586l4.293-4.293a1 1 0 0 1 1.414 0Z"
                          clipRule="evenodd"
                        />
                      </g>
                    </svg>
                  ) : (
                    <svg
                      onClick={() => setShowAddresses(!showAddresses)}
                      className="cursor-pointer fill-blue-500"
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill="currentColor"
                        fillRule="evenodd"
                        d="M16.707 10.293a1 1 0 0 1 0 1.414l-6 6a1 1 0 0 1-1.414 0l-6-6a1 1 0 1 1 1.414-1.414L9 14.586V3a1 1 0 0 1 2 0v11.586l4.293-4.293a1 1 0 0 1 1.414 0Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
              )}
              {isAddressSaved &&
                showAddresses &&
                addresses.map((address) => (
                  <div
                    key={address.id}
                    onClick={() => handleAddressSelection(address)}
                    className="border-slate-300 border cursor-pointer rounded text-gray-700 text-xs font-bold mb-5 p-3"
                  >
                    <div>
                      {address.first_name} {address.last_name}
                    </div>
                    <div>
                      {address.address} {address.address2} {address.city}{" "}
                      {address.post_code}
                    </div>
                  </div>
                ))}
            </>
          }
        />
      )}
      {isNotificationVisible && (
        <Notification
          type={notification.type}
          message={notification.message}
          duration={5000}
          onClose={() => setIsNotificationVisible(false)}
        />
      )}
    </div>
  );
};

export default Cart;
