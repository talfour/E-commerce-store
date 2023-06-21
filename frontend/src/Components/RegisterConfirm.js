import React from "react";
import useIsLoggedIn from "../auth/isLoggedIn";

const RegisterConfirm = () => {
  useIsLoggedIn();
  return <div>Rejestracja przebiegła pomyślnie. Możesz się zalogować.</div>;
};

export default RegisterConfirm;
