import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
function Login() {
  const [user, setUser] = useState({ email: "", password: "" });
  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };
  const loginSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("/user/login", { ...user });
      window.location.href = "/";
    } catch (error) {
      alert(error.response.data.msg);
    }
  };
  return (
    <div className="login-page">
      <form onSubmit={loginSubmit}>
        <h1>Login</h1>
        <input
          type="email"
          name="email"
          required
          placeholder="Email"
          value={user.email}
          onChange={onChangeHandler}
        />
        <input
          type="password"
          name="password"
          required
          placeholder="Password"
          value={user.password}
          onChange={onChangeHandler}
          autoComplete="on"
        />
        <div className="row">
          <button type="submit">Login</button>
          <Link to="/register">Register</Link>
        </div>
      </form>
    </div>
  );
}

export default Login;
