import React, { useState } from "react";
import { useFormik } from "formik";
import { signUp } from "../../api/userService";
import * as yup from "yup";
import Button from "../../components/Button";
import styles from "./signUp.module.css";
import { Link, useNavigate } from "react-router-dom";

const validationSchema = yup.object({
  firstName: yup.string().required("First name is required!"),
  lastName: yup.string().required("Last name is required!"),
  email: yup
    .string()
    .email("Please enter a valid email")
    .required("Email is required!"),
  password: yup.string().required("Password is required!"),
  confirmPassword: yup
    .string()
    .required("Please confirm your password")
    .when("password", {
      is: (val) => (val && val.length > 0 ? true : false),
      then: () =>
        yup.string().oneOf([yup.ref("password")], "Password does not match"),
    }),
});

function SignUp() {
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const onSubmit = (values, { resetForm, setSubmitting }) => {
    const { confirmPassword, ...userCredentials } = values;
    signUp(userCredentials)
      .then((data) => {
        setError(null);
        resetForm();
        navigate("/login", {
          state: "You signed up successfully! Please login.",
        });
        console.log(data);
      })
      .catch((error) => {
        setError(error);
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  const {
    handleSubmit,
    handleChange,
    handleBlur,
    values,
    touched,
    errors,
    isSubmitting,
  } = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validateOnBlur: true,
    onSubmit,
    validationSchema,
  });

  return (
    <div className={styles.signUpContainer}>
      <h1>Sign Up</h1>
      <div>{error ? error : ""}</div>
      <form onSubmit={handleSubmit} className={styles.signUpForm}>
        <input
          id="firstName"
          name="firstName"
          type="text"
          placeholder="First Name"
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.firstName}
        />
        {touched.firstName && errors.firstName && (
          <div className={styles.errorMessage}>{errors.firstName}</div>
        )}

        <input
          id="lastName"
          name="lastName"
          type="text"
          placeholder="Last Name"
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.lastName}
        />
        {touched.lastName && errors.lastName && (
          <div className={styles.errorMessage}>{errors.lastName}</div>
        )}

        <input
          id="email"
          name="email"
          type="text"
          placeholder="Email"
          onChange={handleChange}
          onBlur={handleBlur}
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
          onBlur={handleBlur}
          value={values.password}
        />
        {touched.password && errors.password && (
          <div className={styles.errorMessage}>{errors.password}</div>
        )}

        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          placeholder="Confirm Password"
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.confirmPassword}
        />
        {touched.confirmPassword && errors.confirmPassword && (
          <div className={styles.errorMessage}>{errors.confirmPassword}</div>
        )}

        <Button
          type="submit"
          disabled={isSubmitting}
          text={isSubmitting ? "Submitting..." : "Submit"}
        />

        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}

export default SignUp;
