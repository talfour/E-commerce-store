import React, { useState } from "react";
import defaultImage from "../../assets/thenounproject.svg";
import x_mark from "../../assets/x_mark.svg";
import check_mark from "../../assets/check_mark.svg";
import { Link } from "react-router-dom";
import Popup from "../../Components/Popup";
import ReviewForm from "../../Components/ReviewForm";

const Order = ({ orders }) => {
  const [selectedProduct, setSelectedProduct] = useState(null);

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const openReviewForm = (productId) => {
    setSelectedProduct(productId);
  };

  const closeReviewForm = () => {
    setSelectedProduct(null);
  };

  return (
    <div className="flex flex-col p-5 justify-center align-middle text-sm lg:text-base">
      {orders.map((order) => (
        <div
          key={order.id}
          className="m-auto mb-5 p-5 min-w-[100%] lg:w-[50vw] lg:min-w-fit bg-white border border-gray-200 rounded-lg shadow "
        >
          <div className="flex justify-between">
            <span className="italic">Order #{order.id}</span>
            <span className="italic"> {formatDate(order.created)}</span>
          </div>
          <div className="flex">
            <p>Paid:</p>{" "}
            {order.paid ? (
              <img className="w-5" alt="tak" src={check_mark} />
            ) : (
              <img className="w-5" alt="nie" src={x_mark} />
            )}
          </div>
          <div className="flex justify-between my-5 items-center">
            <p>
              Name: {order.first_name} {order.last_name}
            </p>
            <div>
              <p className="text-right">Shipping address:</p>
              <div className="text-right">
                <p>
                  {order.address} {order.address2}
                </p>
                <p>
                  {order.post_code} {order.city}
                </p>
              </div>
            </div>
          </div>
          {order.items.map((item) => (
            <div
              key={item.id}
              className="flex flex-wrap mb-5 justify-between text-sm lg:text-base items-end"
            >
              <Link
                className="text-blue-500 hover:text-blue-700 flex-[0_0_100%] text-lg mb-2"
                to={`/products/${item.product.id}`}
              >
                {item.product.name}
              </Link>
              <div className="flex">
                <img
                  alt={item.product.name}
                  className="w-16 h-16 object-cover"
                  src={
                    item.product?.images[0]?.image
                      ? item.product?.images[0]?.image
                      : defaultImage
                  }
                />
                <div className="pl-1 lg:pl-5 max-w-[115px] lg:max-w-none">
                  <p>Amount: {item.quantity}</p>
                  <p>Total: {(item.price * item.quantity).toFixed(2)}$</p>
                </div>
              </div>
              {order.paid && (
                <div>
                  {selectedProduct === item.id ? (
                    ""
                  ) : (
                    <button
                      onClick={() => openReviewForm(item.id)}
                      className="shadow bg-pink-400 hover:bg-pink-500 focus:shadow-outline focus:outline-none text-white text-sm font-bold py-2 px-2 rounded w-full lg:w-auto"
                    >
                      Review product
                    </button>
                  )}
                </div>
              )}
              {selectedProduct === item.id && (
                <Popup
                  handleClose={closeReviewForm}
                  content={
                    <ReviewForm
                      product_id={item.product.id}
                      product_name={item.product.name}
                    />
                  }
                />
              )}
            </div>
          ))}
          <p>Total cost: {order.total_cost}$</p>
        </div>
      ))}
    </div>
  );
};

export default Order;
