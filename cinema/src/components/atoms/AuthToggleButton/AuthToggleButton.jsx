import React from "react";
import "./AuthToggleButton.css";

const AuthToggleButton = ({ isLogin, toggleAuthMode }) => {
  return (
    <button className="auth-toggle-button" onClick={toggleAuthMode}>
      {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
    </button>
  );
};

export default AuthToggleButton;