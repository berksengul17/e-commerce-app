import React, { useContext, useState } from "react";
import { useFormik } from "formik";
import { login } from "../../api/userService";
import { UserContext } from "../../context/UserProvider";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import styles from "./login.module.css";

function Login() {
  const { loginUser } = useContext(UserContext);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const onSubmit = (userCredentials, { setSubmitting }) => {
    login(userCredentials)
      .then((data) => {
        console.log(data);
        loginUser(data);
        navigate("/", { replace: true });
      })
      .catch((error) => {
        setError(error);
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  const { handleSubmit, handleChange, values, touched, errors, isSubmitting } =
    useFormik({
      initialValues: {
        email: "",
        password: "",
      },
      onSubmit,
    });

  return (
    <div className={styles.loginContainer}>
      <h1>Login</h1>
      <div>{error ? error : ""}</div>
      <div>{location.state ? location.state : ""}</div>
      <form onSubmit={handleSubmit} className={styles.loginForm}>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="Email"
          onChange={handleChange}
          value={values.email}
        />
        {touched.email && errors.email && (
          <div className={styles.errorMessage}>{errors.email}</div>
        )}

        <input
          id="password"
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          value={values.password}
        />
        {touched.password && errors.password && (
          <div className={styles.errorMessage}>{errors.password}</div>
        )}

        <Button
          type="submit"
          disabled={isSubmitting}
          text={isSubmitting ? "Submitting..." : "Submit"}
        />

        <p>
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
