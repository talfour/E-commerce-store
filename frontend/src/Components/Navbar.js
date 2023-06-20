import React, { useState } from "react";
import { Link } from "react-router-dom";
import myLogo from "../images/logo.svg";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <div className="flex flex-wrap">
        <section className="relative mx-auto">
          <nav className="flex justify-between bg-gray-900 text-white w-screen">
            <div className="px-5 xl:px-12 py-6 flex w-full items-center text-xl">
              <Link to="/" className="text-3xl font-bold font-heading">
                <img className="h-20" src={myLogo} alt="logo" />
              </Link>
              <ul className="hidden xl:flex px-4 mx-auto font-semibold font-heading space-x-12">
                <li>
                  <Link to="/" className="hover:text-gray-200">
                    Strona główna
                  </Link>
                </li>
                <li>
                  <Link to="/category" className="hover:text-gray-200">
                    Kategorie
                  </Link>
                </li>
                <li>
                  <Link to="/collection" className="hover:text-gray-200">
                    Kolekcje
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-gray-200">
                    Kontakt
                  </Link>
                </li>
              </ul>
              <div className="hidden xl:flex items-center space-x-5">
                <Link
                  to="/shopping-cart"
                  className="flex items-center hover:text-gray-200"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  <span className="flex absolute -mt-5 ml-4">
                    <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-pink-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-pink-500"></span>
                  </span>
                </Link>
                <Link
                  to="/profile"
                  className="flex items-center hover:text-gray-200"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 hover:text-gray-200"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </Link>
              </div>
            </div>
            <Link
              to="/shopping-cart"
              className="xl:hidden flex mr-6 items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 hover:text-gray-200"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <span className="flex absolute -mt-5 ml-4">
                <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-pink-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-pink-500"></span>
              </span>
            </Link>
            <div
              to="/profile"
              className="navbar-burger self-center mr-12 xl:hidden cursor-pointer"
              onClick={toggleSidebar}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 hover:text-gray-200"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </div>
          </nav>
        </section>
      </div>
      <div className={`sidebar ${isOpen ? "active" : ""}`}>
        <div className="wrapper flex flex-col align-middle items-center justify-center text-3xl text-center h-full">
          <Link
            to="/"
            onClick={toggleSidebar}
            className="border-b-2 border-b-[#111827] w-full p-2 mb-2 font-heading"
          >
            Strona główna
          </Link>
          <Link
            to="/category"
            onClick={toggleSidebar}
            className="border-b-2 border-b-[#111827] w-full p-2 mb-2"
          >
            Kategorie
          </Link>
          <Link
            onClick={toggleSidebar}
            to="/collection"
            className="border-b-2 border-b-[#111827] w-full p-2 mb-2"
          >
            Kolekcje
          </Link>
          <Link
            onClick={toggleSidebar}
            to="/profile"
            className="border-b-2 border-b-[#111827] w-full p-2 mb-2"
          >
            Profil
          </Link>
          <Link
            onClick={toggleSidebar}
            to="/contact"
            className="border-b-2 border-b-[#111827] w-full p-2 mb-2"
          >
            Kontakt
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
