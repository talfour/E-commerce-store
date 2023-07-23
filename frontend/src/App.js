import { useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Home from "./Pages/Home";
import Categories from "./Pages/Category/Categories";
import Cart from "./Components/Cart";
import Profile from "./Components/Profile";
import PageNotFound from "./Pages/PageNotFound";
import ProductDetail from "./Pages/Product/ProductDetail";
import CategoryDetail from "./Pages/Category/CategoryDetail";
import Login from "./Pages/Authentication/Login";
import Register from "./Pages/Authentication/Register";
import RegisterConfirm from "./Pages/Authentication/RegisterConfirm";
import ResetPassword from "./Pages/Authentication/ResetPassword";
import { axiosInstance } from "./axios";
import Orders from "./Components/Orders";
import TopNav from "./Components/TopNav";
export default function App() {

  const [isUserLogged, setIsUserLogged] = useState(false);
  const [userEmail, setUserEmail] = useState('')

  // Check if user is logged in
  const isLogged = async () => {
    try {
      const response = await axiosInstance.get("user/me/");
      if (response.status === 200) {
        setUserEmail(response.data.email)
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
    <div className="App font-roboto bg-gray-100 h-[100vh]">
      <TopNav />
      <Navbar isUserLogged={isUserLogged} setIsUserLogged={setIsUserLogged} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/categories/:categoryId" element={<CategoryDetail />} />
        <Route
          path="/shopping-cart"
          element={<Cart userEmail={userEmail} isUserLogged={isUserLogged} />}
        />
        <Route path="/profile" element={<Profile />} />
        <Route path="/products/:productId" element={<ProductDetail />} />
        <Route path="orders" element={<Orders />} />
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
        <Route path="/profile/reset-password/" element={<ResetPassword />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </div>
  );
}
