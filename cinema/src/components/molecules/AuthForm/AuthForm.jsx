import React from "react";
import "./AuthForm.css";

const AuthForm = ({ isLogin, formData, onChange, onSubmit }) => {
  return (
    <form className="auth-form" onSubmit={onSubmit}>
      {!isLogin && (
        <>
          <input type="text" name="name" className="pasem-input"
            placeholder="Name" value={formData.name} onChange={onChange}
            required
          />
          <input
            type="tel" name="phone" className="pasem-input"
            placeholder="0671546684" value={formData.phone} onChange={onChange}
            required
          />
        </>
      )}
      <input
        type="email" name="email" className="pasem-input"
        placeholder="Email@gmail.com" value={formData.email} onChange={onChange}
        required
      />
      <input
        type="password" name="password" className="pasem-input"
        placeholder="*******" value={formData.password} onChange={onChange}
        required
      />
      <button type="submit" className="reglog-button">
        {isLogin ? "Login" : "Register"}
      </button>
    </form>
  );
};

export default AuthForm;
