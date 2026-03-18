import React from "react";
import { useState } from "react";
import "./LoginPage.scss";
import { useNavigate } from "react-router-dom";

import backdrop from "./assets/image.png";
import showPasswordIcon from "./assets/eye-svgrepo-com.svg";
import hidePasswordIcon from "./assets/eye-slash-svgrepo-com.svg";

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  //   const [isSubmitting, setIsSubmitting] = useState(false);

  const url = "https://apionboarding.uds.in/ticketapp/clientlogin/";

  async function handleLogin() {
    try {
      //   setIsSubmitting(true);

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.status?.message || "Login Failed");
      }

      //success

      if (data.status.code === 200) {
        localStorage.setItem("Token", data.session.token);

        navigate("/dashboard");
      }
    } catch (error) {
      console.log("error:", error);
    }
  }

  const validateField = (name, value) => {
    const trimmedValue = value.trim();

    if (name === "email") {
      if (!trimmedValue) {
        return "*Email is required";
      }

      if (!/\S+@\S+\.\S+/.test(trimmedValue)) {
        return "*Enter a valid email";
      }
    }

    if (name === "password") {
      if (!value) {
        return "*Password is required";
      }

      if (value.length < 8) {
        return "*Password must be at least 8 characters";
      }
    }

    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError((prev) => ({
      ...prev,
      [name]: validateField(name, value),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {
      email: validateField("email", form.email),
      password: validateField("password", form.password),
    };

    setError(newErrors);

    if (newErrors.email || newErrors.password) {
      return;
    }

    handleLogin();
  };

  return (
    <div className="loginPage">
      <div className="left-panel">
        <img src={backdrop} className="backdrop" alt="Login backdrop" />
      </div>

      <div className="right-panel">
        <div className="login-card">
          <h2 className="title">Hey, Hello</h2>
          <p className="subtitle">Enter your Login Credentials.</p>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                aria-invalid={Boolean(error.email)}
              />
              {error.email && <p className="field-error">{error.email}</p>}
            </div>

            <div className="form-group">
              <label>Password</label>
              <div className="password-input">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  aria-invalid={Boolean(error.password)}
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <img
                    src={showPassword ? hidePasswordIcon : showPasswordIcon}
                    alt=""
                    aria-hidden="true"
                  />
                </button>
              </div>
              {error.password && (
                <p className="field-error">{error.password}</p>
              )}
            </div>

            <div className="forgot">
              <button type="button">Forgot Password?</button>
            </div>

            <button type="submit" className="login-btn" onClick={handleSubmit}>
              LOGIN
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
