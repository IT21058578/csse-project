import React from "react";
import { LoginForm } from '../components/Form';
import back from "../assets/img/home.png";

const LoginPage = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center", 
        height: "100vh",
      }}
    >
      <div
        style={{
          flex: 0.6,
          backgroundImage: back, 
          height:"100%"
        }}
      >
        <img
          src={back}
          alt="Background"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </div>
        <LoginForm />
    </div>
  );
};

export default LoginPage;
