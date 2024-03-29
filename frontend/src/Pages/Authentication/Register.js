import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import myLogo from "../../assets/logo_black.svg";
import { axiosInstance } from "../../axios";
import { useNavigate } from "react-router-dom";


const Login = ({isUserLogged}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [matchError, setMatchError] = useState("");
  const [registerError, setRegisterError] = useState("");
  const navigate = useNavigate();

  const submitRegistration = async (e) => {
    e.preventDefault();
    // Password validation
    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters long.");
      return; // Do not proceed with form submission
    }

    if (password !== passwordConfirm) {
      setMatchError("Password is not the same");
      return; // Do not proceed with form submission
    }
    setPasswordError("");
    setMatchError("");
    setRegisterError("");
    try {
      const response = await axiosInstance.post("user/register/", {
        email: email,
        password: password,
      });
      if (response.status === 201) {
        navigate("/register-confirm");
      }
    } catch (error) {
      console.log(error);
      setRegisterError("User with this e-mail already exist.");
      return;
    }
  };

  useEffect(() => {
    if (isUserLogged) {
      navigate("/");
    }
  });

  return (
    <div className="w-[95%] lg:w-1/3 mx-auto mt-10 bg-white border border-gray-200 rounded-lg shadow flex flex-col justify-center px-6 py-12 lg:px-8 h-4/5">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          className="mx-auto h-28 w-auto"
          src={myLogo}
          alt="Your Company"
        />
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Register
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
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Password
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
                Password Confirm
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
              Register
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm text-gray-500">
          Already have an account?
          <Link
            to="/login"
            className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
          >
            {" "}
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
