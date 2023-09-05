import { useState } from "react";
import { axiosInstance } from "../../axios";
import { Link } from "react-router-dom";
const CartShipping = ({
  isUserLogged,
  userEmail,
  togglePopup,
  toggleConfirmationPopup,
  setDiscount,
  isAddressSaved,
  addresses,


}) => {
  const [isSaveAddr, setIsSaveAddr] = useState(false);

  const [showAddresses, setShowAddresses] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: isUserLogged ? userEmail : "",
    address: "",
    address2: "",
    post_code: "",
    city: "",
  });

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
      setDiscount("");
      togglePopup();
      toggleConfirmationPopup();

      console.log("remove discount");
    }
  };
  return (
    <>
      <form className="w-full h-auto" onSubmit={handleOrderCreate}>
        <div className="flex flex-wrap -mx-3 justify-center align-middle md:mb-6">
          <div className="w-full md:w-1/2 px-3 mb-2 md:mb-0">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="grid-first-name"
            >
              First Name
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
              id="grid-first-name"
              type="text"
              placeholder="First Name"
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
              Last Name
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="grid-last-name"
              type="text"
              placeholder="Last Name"
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
              Address
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="grid-address"
              type="text"
              placeholder="Address 1/1"
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
              Address 2
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
              Town/City
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="grid-city"
              type="text"
              name="city"
              placeholder="Town/City"
              value={formData.city}
              onChange={(e) => handleAddressChange(e)}
            />
          </div>
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="grid-zip"
            >
              Post Code
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
                Save Address?
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
            Users not logged in are unable to track their orders.{" "}
            <Link className="text-blue-500" to="/login">
              Log in
            </Link>
          </h3>
        )}
        <div className="md:flex items-center justify-center mb-5">
          <div className="">
            <button
              className="shadow bg-pink-400 hover:bg-pink-500 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded w-full lg:w-auto"
              type="submit"
            >
              Order
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
            {showAddresses ? "Hide addresses" : "Show saved addresses"}
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
  );
};

export default CartShipping;
