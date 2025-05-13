import React, { useState } from "react";
import { toast } from 'react-toastify';
import AuthBox from "../../organisms/AuthBox/AuthBox";
import "./Auth.css"; 

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ email: "", password: "" });

  const toggleAuthMode = () => setIsLogin((prev) => !prev);

  const onChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const url = isLogin ? "http://localhost:5000/api/login" : "http://localhost:5000/api/register";
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(formData),
    });

    const result = await response.json();
    if (!response.ok) {
      toast.error("Error");
    } else {
      toast.success("Success");
      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
    }
  };

  return (
    <div className="auth-page">
      <AuthBox {...{ isLogin, toggleAuthMode, formData, onChange, onSubmit }} />
    </div>
  );
};

export default AuthPage;
