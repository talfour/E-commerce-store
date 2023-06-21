import React, { useState } from "react";
import myLogo from "../images/logo.svg";
import { axiosInstance } from "../axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import useIsLoggedIn from "../auth/isLoggedIn";

const Login = ({ setIsUserLogged }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isError, setIsError] = useState(false)
  const navigate = useNavigate();

  const submitLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post("user/login/", {
        email: email,
        password: password,
      });
      if (response.status === 200) {
        setIsUserLogged(true);
        navigate("/");
      }
    } catch (error) {
      setIsError(true)
    }
  };
  useIsLoggedIn();

  return (
    <div className="flex flex-col justify-center px-6 py-12 lg:px-8 h-4/5">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          className="mx-auto h-10 w-auto"
          style={{ backgroundColor: "black" }}
          src={myLogo}
          alt="Your Company"
        />
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Zaloguj się do swojego konta
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={submitLogin} method="POST">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Email
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Hasło
              </label>
              <div className="text-sm">
                <a
                  href="#"
                  className="font-semibold text-indigo-600 hover:text-indigo-500"
                >
                  Nie pamiętasz hasła?
                </a>
              </div>
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
                  Niepoprawne dane logowania lub użytkownik o takim adresie e-mail nie istnieje.
                </p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Zaloguj
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm text-gray-500">
          Nie jesteś członkiem?
          <Link
            to="/register"
            className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
          >
            {" "}
            Zarejestruj się teraz
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
