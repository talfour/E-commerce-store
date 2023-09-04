import React, { useEffect } from "react";
import myLogo from "../../assets/logo_black.svg";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const RegisterConfirm = ({ isUserLogged }) => {
  const navigate = useNavigate();
  useEffect(() => {
    if (isUserLogged) {
      navigate("/");
    }
  });
  return (
    <div className="w-[95%] lg:w-1/3 mx-auto mt-10 bg-white border border-gray-200 rounded-lg shadow flex flex-col justify-center px-6 py-12 lg:px-8 h-4/5">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img className="mx-auto h-28 w-auto" src={myLogo} alt="Your Company" />
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Your account was created you can now{" "}
          <Link
            to="/login"
            className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
          >
            {" "}
            log in
          </Link>
          .
        </h2>
      </div>
    </div>
  );
};

export default RegisterConfirm;
