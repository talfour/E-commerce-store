import { useEffect } from "react";
import { axiosInstance } from "../axios";
import { useNavigate } from "react-router-dom";

const useIsLoggedIn = () => {
  const navigate = useNavigate();
  useEffect(() => {
    //If user is authenticated re-direct to home page
    axiosInstance
      .get("user/me/")
      .then(function (res) {
        navigate("/");
      })
      .catch(function (error) {
        return
      });
  });
};
export default useIsLoggedIn;
