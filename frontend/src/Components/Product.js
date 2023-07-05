import { Link } from "react-router-dom";
import defaultImage from "../images/thenounproject.svg";
import { axiosInstance } from "../axios";

const Product = ({ product }) => {
  const productImage = product.images[0]?.image
    ? product.images[0]?.image
    : defaultImage;

  const data = {
    quantity: 1,
  };
  const handleAddToCart = async (productID) => {
    try {
      await axiosInstance.post(`cart/${productID}/add/`, data);
    } catch (error) {
      console.log(error);
    }
  };
  return product.available ? (
    <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow">
      <Link to={`/product/${product.id}`}>
        <img
          className="p-8 rounded-t-lg object-cover h-48 w-96"
          src={productImage}
          alt={product.name}
        />
      </Link>
      <div className="px-5 pb-5">
        <Link to={`/product/${product.id}`}>
          <h5 className="text-xl font-semibold tracking-tight text-gray-900 ">
            {product.name}
          </h5>
        </Link>
        <div className="flex items-center mt-2.5 mb-5 italic overflow-hidden truncate w-50">
          {product.description}
        </div>
        <div className="flex items-center mt-2.5 mb-5">
          {product.brand.name}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-3xl font-bold text-gray-900">
            {product.price}zł
          </span>
          <button
            href="#"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            onClick={() => handleAddToCart(product.id)}
          >
            Dodaj do koszyka
          </button>
        </div>
      </div>
    </div>
  ) : (
    ""
  );
};

export default Product;
