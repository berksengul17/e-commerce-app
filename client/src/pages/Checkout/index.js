import React, { useContext } from "react";
import { CartContext } from "../../context/CartProvider";
import { useFormik } from "formik";
import valid from "card-validator";
import * as yup from "yup";
import Button from "../../components/Button";
import styles from "./checkout.module.css";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserProvider";

const validationSchema = yup.object({
  creditCardNumber: yup
    .string()
    .test(
      "test-number",
      "Credit card number is invalid",
      (value) => valid.number(value).isValid
    )
    .required("Credit card number is required"),
  expirationMonth: yup
    .string()
    .test(
      "test-number",
      "Expiration month is invalid",
      (value) => valid.expirationMonth(value).isValid
    )
    .required("Expiration month is required"),
  expirationYear: yup
    .string()
    .test(
      "test-number",
      "Expiration year is invalid",
      (value) => valid.expirationYear(value).isValid
    )
    .required("Expiration year is required"),
  cvv: yup
    .string()
    .test("test-number", "CVV is invalid", (value) => valid.cvv(value).isValid)
    .required("CVV is required"),
  address: yup.string().required("Address is required"),
});

function Checkout() {
  const { user } = useContext(UserContext);
  const { cartItems, totalCartPrice, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  const onSubmit = () => {
    navigate("/success", { state: { from: "checkout" } });
    clearCart(user.id);
  };

  const {
    handleSubmit,
    handleChange,
    handleBlur,
    isSubmitting,
    touched,
    errors,
    values,
  } = useFormik({
    initialValues: {
      creditCardNumber: "",
      expirationMonth: "",
      expirationYear: "",
      cvv: "",
      address: "",
    },
    onSubmit,
    validationOnBlur: true,
    validationSchema,
  });

  return (
    <div>
      <div className={styles.orderSummary}>
        <h3>Order Summary</h3>
        <div className={styles.orders}>
          {cartItems.map((cartItem) => (
            <div key={cartItem.id} className={styles.order}>
              <p>
                {cartItem.quantity} x {cartItem.product.name}
              </p>
              <p>${cartItem.quantity * cartItem.product.price}</p>
            </div>
          ))}
        </div>
        <p className={styles.totalPrice}>
          Total: ${(Math.round(totalCartPrice * 100) / 100).toFixed(2)}
        </p>
      </div>
      <div className={styles.checkoutFormContainer}>
        <h3>Shipping and Payment Information</h3>
        <form className={styles.checkoutForm} onSubmit={handleSubmit}>
          <input
            id="creditCardNumber"
            type="text"
            placeholder="Credit Card Number"
            maxLength="16"
            onBlur={handleBlur}
            onChange={handleChange}
            value={values.creditCardNumber}
          />
          {touched.creditCardNumber && errors.creditCardNumber && (
            <div className={styles.errorMessage}>{errors.creditCardNumber}</div>
          )}
          <div className={styles.expirationDate}>
            <input
              id="expirationMonth"
              type="text"
              placeholder="MM"
              maxLength="2"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.expirationMonth}
            />
            <span>/</span>
            <input
              id="expirationYear"
              type="text"
              placeholder="YY"
              maxLength="2"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.expirationYear}
            />
            {touched.expirationMonth && errors.expirationMonth && (
              <div className={styles.errorMessage}>
                {errors.expirationMonth}
              </div>
            )}
            {touched.expirationYear && errors.expirationYear && (
              <div className={styles.errorMessage}>{errors.expirationYear}</div>
            )}
          </div>
          <input
            id="cvv"
            type="text"
            placeholder="CVV"
            maxLength="3"
            onBlur={handleBlur}
            onChange={handleChange}
            value={values.cvv}
          />
          {touched.cvv && errors.cvv && (
            <div className={styles.errorMessage}>{errors.cvv}</div>
          )}

          <input
            id="address"
            type="text"
            placeholder="Adress"
            onBlur={handleBlur}
            onChange={handleChange}
            value={values.address}
          />
          {touched.address && errors.address && (
            <div className={styles.errorMessage}>{errors.address}</div>
          )}

          <Button
            type="submit"
            disabled={isSubmitting}
            text={isSubmitting ? "Submitting..." : "Submit"}
          />
        </form>
      </div>
    </div>
  );
}

export default Checkout;
