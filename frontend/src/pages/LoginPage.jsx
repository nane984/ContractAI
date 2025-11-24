import React from "react";
import LoginForm from "../components/LoginForm";

const LoginPage = () => {
  return (
    <div className="flex-1 flex overflow-hidden pt-16">
      {/* wrapper koji ograničava formu */}
      <div className="flex justify-center w-full">
        <div className="mt-10"> {/* razmak od vrha */}
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;