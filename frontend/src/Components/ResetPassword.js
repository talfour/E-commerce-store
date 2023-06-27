import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { axiosInstance } from "../axios";
import myLogo from "../images/logo_black.svg";
import { Link } from "react-router-dom";

const ResetPassword = () => {
  const location = useLocation();
  const url = location.search;
  const token = url.replace("?token=", "");
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [password, setPassword] = useState("");
  const [isError, setIsError] = useState(false);
  const [isPasswordResetSuccessful, setIsPasswordResetSuccessful] =
    useState(false);

  const checkToken = async (token) => {
    const response = await axiosInstance.post(
      "user/password_reset/validate_token/",
      {
        token: token,
      }
    );
    if (response.status === 200) {
      setIsTokenValid(true);
    }
    if (response.status === 404) {
      setIsTokenValid(false);
      return;
    }
  };

  const submitPasswordReset = async (e) => {
    e.preventDefault();
    const response = await axiosInstance.post("user/password_reset/confirm/", {
      token: token,
      password: password,
    });
    if (response.status === 200) {
      setIsPasswordResetSuccessful(true);
    } else {
      setIsError(true);
    }
  };

  useEffect(() => {
    checkToken(token);
  }, [token]);

  return (
    <div>
      {isTokenValid && !isPasswordResetSuccessful && (
        <div className="w-[95%] lg:w-1/3 mx-auto mt-10 bg-white border border-gray-200 rounded-lg shadow flex flex-col justify-center px-6 py-12 lg:px-8 h-4/5">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <img
              className="mx-auto h-28 w-auto"
              src={myLogo}
              alt="Your Company"
            />
            <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
              Zresetuj swoje hasło
            </h2>
          </div>

          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form
              className="space-y-6"
              method="POST"
              onSubmit={submitPasswordReset}
            >
              <div>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Nowe hasło
                  </label>
                </div>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${
                      isError && "border-red-500"
                    }`}
                  />
                  {isError && (
                    <p className="text-red-500 text-center text-s mt-4">
                      Hasło jest zbyt krótkie lub nastąpił nieoczekiwany błąd.
                    </p>
                  )}
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Zresetuj hasło
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {!isTokenValid && (
        <div className="w-[95%] lg:w-1/3 mx-auto mt-10 bg-white border border-gray-200 rounded-lg shadow flex flex-col justify-center px-6 py-12 lg:px-8 h-4/5">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <img
              className="mx-auto h-28 w-auto"
              src={myLogo}
              alt="Your Company"
            />
            <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
              Token wygasł lub jest niepoprawny. Spróbuj ponownie zresetować
              hasło.
            </h2>
          </div>
        </div>
      )}
      {isPasswordResetSuccessful && (
        <div className="w-[95%] lg:w-1/3 mx-auto mt-10 bg-white border border-gray-200 rounded-lg shadow flex flex-col justify-center px-6 py-12 lg:px-8 h-4/5">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <img
              className="mx-auto h-28 w-auto"
              src={myLogo}
              alt="Your Company"
            />
            <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
              Hasło zostało zmienione.
            </h2>
            <p className="mt-10 text-center text-sm text-gray-500">
              Możesz się teraz
              <Link
                to="/login"
                className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
              >
                {" "}
                zalogować
              </Link>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResetPassword;
