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

export default function App() {
  return (
    <div className="App font-roboto bg-gray-100 h-screen">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/collection" element={<Collection />} />
        <Route path="/shopping-cart" element={<Cart />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/product/:productId" element={<ProductDetail />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </div>
  );
}
