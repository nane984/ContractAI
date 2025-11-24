import React from "react";
import RegisterForm from "../components/RegisterForm";

const RegisterPage = () => {
  return (
    <div className="flex-1 flex overflow-hidden pt-16">
      {/* wrapper koji ograničava formu */}
      <div className="flex justify-center w-full">
        <div className="mt-10"> {/* razmak od vrha */}
          <RegisterForm />
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;