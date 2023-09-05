import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../axios";

import Popup from "../../Components/Popup";
import Notification from "../../Components/Notification";
import CartShipping from "./CartShipping";
import CartProduct from "./CartProduct";

const Cart = ({ userEmail, isUserLogged }) => {
  const [shoppingCart, setShoppingCart] = useState([]);
  const [totalPrice, setTotalPrice] = useState();
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState("");
  const [isNotificationVisible, setIsNotificationVisible] = useState(false);
  const [notification, setNotification] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isConfirmationPopupOpen, setIsConfirmationPopupOpen] = useState(false);
  const [isAddressSaved, setIsAddressSaved] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const checkIfAddressIsSaved = async () => {
    const response = await axiosInstance.get("user/address/");
    if (response.data.length > 0) {
      setIsAddressSaved(true);
      setAddresses(response.data);
    }
  };
  useEffect(() => {
    getShoppingCart();
    isUserLogged && checkIfAddressIsSaved();
    console.log(userEmail);
  }, []);

  const getShoppingCart = async () => {
    const response = await axiosInstance.get("cart/get_cart_data/");
    if (response.status === 200) {
      setShoppingCart(response.data.cart_items);
      setTotalPrice(response.data.total_price);
      if (response.data.discount !== 0) {
        setDiscount(response.data.discount);
        setCouponCode(response.data.coupon);
      }
    }
  };
  const toggleConfirmationPopup = () => {
    setIsConfirmationPopupOpen(!isConfirmationPopupOpen);
    setShoppingCart([]);
  };

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  if (shoppingCart.length === 0) {
    return (
      <div className="h-fit bg-gray-100 pt-20">
        <h1 className="mb-10 text-center text-2xl font-bold">Your cart</h1>
        <h1 className="mb-10 text-center text-2xl font-bold">
          Nothing there! Add products to cart.
        </h1>
      </div>
    );
  }
  return (
    <>
      {isConfirmationPopupOpen && (
        <Popup
          handleClose={toggleConfirmationPopup}
          content={
            <div>
              <h1 className="text-center text-lg">Your order was placed</h1>
            </div>
          }
        />
      )}
      <div className="mx-auto max-w-5xl justify-center px-6 md:flex md:space-x-6 xl:px-0 items-center pt-20">
        <CartProduct
          couponCode={couponCode}
          totalPrice={totalPrice}
          togglePopup={togglePopup}
          discount={discount}
          setDiscount={setDiscount}
          getShoppingCart={getShoppingCart}
          products={shoppingCart}
          setNotification={setNotification}
          setIsNotificationVisible={setIsNotificationVisible}
          setShoppingCart={setShoppingCart}
          setTotalPrice={setTotalPrice}
        />
      </div>
      {isPopupOpen && (
        <Popup
          handleClose={() => togglePopup()}
          content={
            <CartShipping
              setDiscount={setDiscount}
              userEmail={userEmail}
              isAddressSaved={isAddressSaved}
              addresses={addresses}
              togglePopup={togglePopup}
              toggleConfirmationPopup={toggleConfirmationPopup}
              getShoppingCart={getShoppingCart}
              isUserLogged={isUserLogged}
            />
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
    </>
  );
};

export default Cart;
