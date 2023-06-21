import React, { useState } from "react";
import { Link } from "react-router-dom";
import myLogo from "../images/logo.svg";
import { axiosInstance } from "../axios";
import { useNavigate } from "react-router-dom";
import useIsLoggedIn from "../auth/isLoggedIn";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [name, setName] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [matchError, setMatchError] = useState("");
  const [registerError, setRegisterError] = useState("");
  const navigate = useNavigate();

  const submitRegistration = async (e) => {
    e.preventDefault();
    // Password validation
    if (password.length < 8) {
      setPasswordError("Hasło musi zawierać przynajmniej 8 znaków.");
      return; // Do not proceed with form submission
    }

    if (password !== passwordConfirm) {
      setMatchError("Hasło nie jest takie same.");
      return; // Do not proceed with form submission
    }
    setPasswordError("");
    setMatchError("");
    setRegisterError("");
    try {
      const response = await axiosInstance.post("user/register/", {
        email: email,
        password: password,
        name: name,
      });
      if (response.status === 201) {
        navigate("/register-confirm");
      }
    } catch (error) {
      console.log(error);
      setRegisterError("Użytkownik z tym adresem email już istnieje.");
      return;
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
          Zarejestruj się
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={submitRegistration} method="POST">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Email
            </label>
            <div className="mt-2">
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${
                  registerError && "border-red-500"
                }`}
              />
              {registerError && (
                <p className="text-red-500 text-xs mt-1">{registerError}</p>
              )}
            </div>
          </div>
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Imię
            </label>
            <div className="mt-2">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                id="name"
                name="name"
                type="text"
                required
                className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6
                `}
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
            </div>
            <div className="mt-2">
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${
                  passwordError && "border-red-500"
                }`}
              />
              {passwordError && (
                <p className="text-red-500 text-xs mt-1">{passwordError}</p>
              )}
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password2"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Powtórz hasło
              </label>
            </div>
            <div className="mt-2">
              <input
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                id="password2"
                name="password2"
                type="password"
                required
                className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${
                  matchError && "border-red-500"
                }`}
              />
              {matchError && (
                <p className="text-red-500 text-xs mt-1">{matchError}</p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Zarejestruj
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm text-gray-500">
          Masz już konto?
          <Link
            to="/login"
            className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
          >
            {" "}
            Zaloguj się
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
