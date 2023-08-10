import React, { useState } from "react";
import { useFormik } from "formik";
import { signUp } from "../../api/signUpService";
import * as yup from "yup";
import Button from "../../components/Button";
import styles from "./signUp.module.css";
import { Link } from "react-router-dom";

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
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const onSubmit = (values, { resetForm, setSubmitting }) => {
    const { confirmPassword, ...userCredentials } = values;
    signUp(userCredentials)
      .then((data) => {
        setSuccess(data);
        setError(null);
        resetForm();
      })
      .catch((error) => {
        setError(error);
        setSuccess(null);
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

  console.log(errors);

  return (
    <div className={styles.signUpContainer}>
      <h1>Sign Up</h1>
      <div>{success ? success : error}</div>
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
