import React from "react";
import { useState } from "react";
import "./LoginPage.scss";
import { useNavigate } from "react-router-dom";

import backdrop from "./assets/image.png";

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
                  {showPassword ? (
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M3 4.27 4.28 3 21 19.72 19.73 21l-2.31-2.31A11.83 11.83 0 0 1 12 20C7 20 2.73 16.89 1 12c.92-2.6 2.69-4.8 5-6.34L3 4.27Zm5.2 5.2A4 4 0 0 0 12 16a3.9 3.9 0 0 0 1.53-.31l-1.66-1.66A2 2 0 0 1 10 12c0-.34.08-.67.23-.96L8.2 9.47ZM12 4c5 0 9.27 3.11 11 8a11.78 11.78 0 0 1-3.34 4.62l-2.87-2.87A4 4 0 0 0 10.25 7.2L7.39 4.34A11.5 11.5 0 0 1 12 4Zm0 3a4 4 0 0 1 4 4c0 .45-.08.88-.21 1.29l-5.08-5.08c.41-.13.84-.21 1.29-.21Z" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M12 5c5 0 9.27 3.11 11 8-1.73 4.89-6 8-11 8S2.73 17.89 1 13c1.73-4.89 6-8 11-8Zm0 2C8.13 7 4.77 9.19 3.13 13 4.77 16.81 8.13 19 12 19s7.23-2.19 8.87-6C19.23 9.19 15.87 7 12 7Zm0 2.5A3.5 3.5 0 1 1 8.5 13 3.5 3.5 0 0 1 12 9.5Zm0 2A1.5 1.5 0 1 0 13.5 13 1.5 1.5 0 0 0 12 11.5Z" />
                    </svg>
                  )}
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
