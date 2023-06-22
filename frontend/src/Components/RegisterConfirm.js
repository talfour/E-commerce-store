import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
const RegisterConfirm = ({ isUserLogged }) => {
  const navigate = useNavigate();
  useEffect(() => {
    if (isUserLogged) {
      navigate("/");
    }
  });
  return <div>Rejestracja przebiegła pomyślnie. Możesz się zalogować.</div>;
};

export default RegisterConfirm;
