import React from "react";
import defaultImage from "../assets/thenounproject.svg"
import x_mark from "../assets/x_mark.svg"
import check_mark from "../assets/check_mark.svg";
import { Link } from "react-router-dom";

const Order = ({ orders }) => {
    const formatDate = (dateString) => {
        const options = {
          year: "numeric",
          month: "long",
          day: "numeric",
        };
        return new Date(dateString).toLocaleDateString(undefined, options)
    }
  return (
    <div className="flex flex-col p-5 justify-center align-middle ">
      {orders.map((order) => (
        <div
          key={order.id}
          className="m-auto mb-5 p-5 min-w-[100%] lg:w-[50vw] lg:min-w-fit bg-white border border-gray-200 rounded-lg shadow "
        >
          <div className="flex justify-between">
            <span className="italic">Zamówienie #{order.id}</span>
            <span className="italic"> {formatDate(order.created)}</span>
          </div>
          <div className="flex">
            <p>Opłacone:</p>{" "}
            {order.paid ? (
              <img className="w-5" alt="tak" src={check_mark} />
            ) : (
              <img className="w-5" alt="nie" src={x_mark} />
            )}
          </div>
          <div className="flex justify-between my-5 items-center">
            <p>
              Imię i Nazwisko: {order.first_name} {order.last_name}
            </p>
            <div>
              <p className="text-right">Adres dostawy:</p>
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
            <div key={item.id} className="flex items-center mb-5">
              <img
                alt={item.product.name}
                className="w-20"
                src={
                  item.product?.images[0]?.image
                    ? item.product?.images[0]?.image
                    : defaultImage
                }
              />
              <div className="pl-5">
                <Link
                  className="text-blue-500 hover:text-blue-700"
                  to={`/product/${item.product.id}`}
                >
                  {item.product.name}
                </Link>
                <p>Cena: {item.price}zł</p>
                <p>Ilość: {item.quantity}</p>
                <p>Łącznie: {(item.price * item.quantity).toFixed(2)}zł</p>{" "}
              </div>
            </div>
          ))}
          <p>Całkowity koszt: {order.total_cost}zł</p>
        </div>
      ))}
    </div>
  );
};

export default Order;
