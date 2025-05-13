import React from "react";
import AuthForm from "../../molecules/AuthForm/AuthForm";
import AuthToggleButton from "../../atoms/AuthToggleButton/AuthToggleButton";
import "./AuthBox.css";

const AuthBox = ({ isLogin, toggleAuthMode, formData, onChange, onSubmit }) => {
  return (
    <div className="auth-box">
      <AuthForm isLogin={isLogin} formData={formData} onChange={onChange} onSubmit={onSubmit} />
      <AuthToggleButton isLogin={isLogin} toggleAuthMode={toggleAuthMode} />
    </div>
  );
};

export default AuthBox;