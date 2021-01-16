import { Link } from "react-router-dom";
import React, { useState } from "react";
import { connect } from "react-redux";
import { setAlert } from "../../redux/actions/alert";
import { login } from "../../redux/actions/auth";

const Login = (props) => {
  const [loginInput, setLoginInput] = useState({
    email: "",
    password: "",
  });

  const { email, password } = loginInput;

  const handleChange = (event) => {
    setLoginInput({ ...loginInput, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    props.login(loginInput);
  };

  
  return (
    <section className="container">
      <h1 className="large text-primary">Sign In</h1>
      <p className="lead">
        <i className="fas fa-user"></i> Sign into Your Account
      </p>
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="email"
            placeholder="Email Address"
            name="email"
            value={email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={password}
            onChange={handleChange}
            required
          />
        </div>
        <input type="submit" className="btn btn-primary" value="Login" />
      </form>
      <p className="my-1">
        Don't have an account? <Link to="/register">Sign Up</Link>
      </p>
    </section>
  );
};

export default connect(null, { setAlert, login })(Login);
