import { useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Home from "./Components/Home";
import Contact from "./Components/Contact";
import Categories from "./Components/Categories";
import Collection from "./Components/Collection";
import Cart from "./Components/Cart";
import Profile from "./Components/Profile";
import PageNotFound from "./Components/PageNotFound";
import ProductDetail from "./Components/ProductDetail";
import CategoryDetail from "./Components/CategoryDetail";
import Login from "./Components/Login";
import Register from "./Components/Register";
import RegisterConfirm from "./Components/RegisterConfirm";
import ResetPassword from "./Components/ResetPassword";
import { axiosInstance } from "./axios";
export default function App() {
  const [isUserLogged, setIsUserLogged] = useState(false);

  // Check if user is logged in
  const isLogged = async () => {
    try {
      const response = await axiosInstance.get("user/me/");
      if (response.status === 200) {
        setIsUserLogged(true);
      }
    } catch (error) {
      return;
    }
  };

  useEffect(() => {
    isLogged();
  }, []);
  return (
    <div className="App font-roboto bg-gray-100 h-screen">
      <Navbar isUserLogged={isUserLogged} setIsUserLogged={setIsUserLogged} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/category" element={<Categories />} />
        <Route path="/category/:categoryId" element={<CategoryDetail />} />
        <Route path="/collection" element={<Collection />} />
        <Route path="/shopping-cart" element={<Cart />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/product/:productId" element={<ProductDetail />} />
        <Route
          path="/login"
          element={
            <Login
              setIsUserLogged={setIsUserLogged}
              isUserLogged={isUserLogged}
            />
          }
        />
        <Route
          path="/register"
          element={<Register isUserLogged={isUserLogged} />}
        />
        <Route
          path="/register-confirm"
          element={<RegisterConfirm isUserLogged={isUserLogged} />}
        />
        <Route
          path="/profile/reset-password/" element={<ResetPassword />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </div>
  );
}
