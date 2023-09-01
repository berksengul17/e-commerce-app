import { router } from "expo-router";
import { Formik } from "formik";
import React, { useContext } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import * as yup from "yup";
import CustomButton from "../components/CustomButton";
import { CartContext } from "../context/CartProvider";
import { UserContext } from "../context/UserProvider";

const validationSchema = yup.object({
  creditCardNumber: yup.string().required("Credit card number is required"),
  expirationMonth: yup.string().required("Expiration month is required"),
  expirationYear: yup.string().required("Expiration year is required"),
  cvv: yup.string().required("CVV is required"),
  address: yup.string().required("Address is required"),
});

function Checkout() {
  const { user, token } = useContext(UserContext);
  const { cartItems, totalCartPrice, clearCart, createOrderFromCart } =
    useContext(CartContext);

  const handleCheckout = () => {
    clearCart(user.id);
    createOrderFromCart(token);
    router.push("/home");
  };

  return (
    <View style={styles.checkout}>
      <View style={styles.container}>
        <Text style={styles.title}>Order Summary</Text>
        <View>
          {cartItems.map((cartItem) => (
            <View key={cartItem.id} style={styles.order}>
              <Text style={styles.orderText}>
                {cartItem.quantity} x {cartItem.product.name}
              </Text>
              <Text style={styles.orderText}>
                ${(cartItem.quantity * cartItem.product.price).toFixed(2)}
              </Text>
            </View>
          ))}
        </View>
        <Text style={styles.totalPrice}>
          Total: ${(Math.round(totalCartPrice * 100) / 100).toFixed(2)}
        </Text>
      </View>
      <View style={styles.container}>
        <Text style={styles.title}>Shipping and Payment Information</Text>
        <Formik
          validationSchema={validationSchema}
          validateOnBlur={true}
          initialValues={{
            creditCardNumber: "",
            expirationMonth: "",
            expirationYear: "",
            cvv: "",
            address: "",
          }}
          onSubmit={handleCheckout}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
            isValid,
          }) => (
            <>
              <TextInput
                style={styles.input}
                placeholder="Credit Card Number"
                maxLength={16}
                value={values.creditCardNumber}
                onChangeText={handleChange("creditCardNumber")}
                onBlur={handleBlur("creditCardNumber")}
              />
              {errors.creditCardNumber && touched.creditCardNumber && (
                <Text style={styles.errorText}>{errors.creditCardNumber}</Text>
              )}
              <View style={styles.expirationDate}>
                <TextInput
                  style={styles.input}
                  placeholder="MM"
                  maxLength={2}
                  value={values.expirationMonth}
                  onChangeText={handleChange("expirationMonth")}
                  onBlur={handleBlur("expirationMonth")}
                />
                <Text style={styles.seperator}>/</Text>
                <TextInput
                  style={styles.input}
                  placeholder="YY"
                  maxLength={2}
                  value={values.expirationYear}
                  onChangeText={handleChange("expirationYear")}
                  onBlur={handleBlur("expirationYear")}
                />
              </View>
              {errors.expirationMonth && touched.expirationMonth && (
                <Text style={styles.errorText}>{errors.expirationMonth}</Text>
              )}
              {errors.expirationYear && touched.expirationYear && (
                <Text style={styles.errorText}>{errors.expirationYear}</Text>
              )}
              <TextInput
                style={styles.input}
                placeholder="CVV"
                maxLength={3}
                value={values.cvv}
                onChangeText={handleChange("cvv")}
                onBlur={handleBlur("cvv")}
              />
              {errors.cvv && touched.cvv && (
                <Text style={styles.errorText}>{errors.cvv}</Text>
              )}
              <TextInput
                style={styles.input}
                placeholder="Address"
                value={values.address}
                onChangeText={handleChange("address")}
                onBlur={handleBlur("address")}
              />
              {errors.address && touched.address && (
                <Text style={styles.errorText}>{errors.address}</Text>
              )}
              <CustomButton
                title="Confirm Order"
                style={styles.button}
                textStyle={styles.buttonText}
                onPress={handleSubmit}
                disabled={!isValid}
              />
            </>
          )}
        </Formik>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  checkout: {
    flex: 1,
    justifyContent: "center",
    gap: 50,
  },
  container: {
    justifyContent: "center",
    alignItems: "center",
    rowGap: 10,
  },
  title: {
    fontWeight: "bold",
    fontSize: 24,
    textAlign: "center",
    marginBottom: 10,
  },
  order: {
    flexDirection: "row",
    columnGap: 20,
  },
  orderText: {
    fontSize: 16,
  },
  totalPrice: {
    fontSize: 18,
  },
  expirationDate: {
    flexDirection: "row",
    gap: 5,
  },
  input: {
    backgroundColor: "white",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  seperator: {
    alignSelf: "center",
  },
  button: {
    alignSelf: "flex-end",
    marginTop: 20,
  },
  buttonText: {
    fontSize: 16,
  },
  errorText: {
    fontSize: 10,
    color: "red",
  },
});

export default Checkout;
