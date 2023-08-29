import { View, Text, StyleSheet, TextInput } from "react-native";
import React, { useState } from "react";
import { Link, router } from "expo-router";
import CustomButton from "../components/CustomButton";
import { signUp } from "../api/userService";
import { useFormik } from "formik";
import * as yup from "yup";

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

  const {
    handleSubmit,
    handleChange,
    handleBlur,
    values,
    touched,
    errors,
    isValid,
  } = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validateOnBlur: true,
    onSubmit: handleSignUp,
    validationSchema,
  });

  // login sayfasına başarılı mesajıyla git
  const handleSignUp = (values, { resetForm }) => {
    const { confirmPassword, ...userCredentials } = values;
    signUp(userCredentials)
      .then((data) => {
        setError(null);
        resetForm();
        router.push("/login");
        console.log(data);
      })
      .catch((error) => {
        setError(error);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}> Sign Up</Text>
      <View>
        <Text style={styles.errorText}>{error ? error : ""}</Text>
      </View>
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="First Name"
          placeholderTextColor="#003f5c"
          value={values.firstName}
          onChangeText={handleChange("firstName")}
          onBlur={handleBlur("firstName")}
        />
      </View>
      {errors.firstName && touched.firstName && (
        <Text style={styles.errorText}>{errors.firstName}</Text>
      )}
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="Last Name"
          placeholderTextColor="#003f5c"
          value={values.lastName}
          onChangeText={handleChange("lastName")}
          onBlur={handleBlur("lastName")}
        />
      </View>
      {errors.lastName && touched.lastName && (
        <Text style={styles.errorText}>{errors.lastName}</Text>
      )}
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="Email"
          placeholderTextColor="#003f5c"
          value={values.email}
          onChangeText={handleChange("email")}
          onBlur={handleBlur("email")}
        />
      </View>
      {errors.email && touched.email && (
        <Text style={styles.errorText}>{errors.email}</Text>
      )}
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          secureTextEntry
          placeholder="Password"
          placeholderTextColor="#003f5c"
          value={values.password}
          onChangeText={handleChange("password")}
          onBlur={handleBlur("password")}
        />
      </View>
      {errors.password && touched.password && (
        <Text style={styles.errorText}>{errors.password}</Text>
      )}
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          secureTextEntry
          placeholder="Confirm Password"
          placeholderTextColor="#003f5c"
          value={values.confirmPassword}
          onChangeText={handleChange("confirmPassword")}
          onBlur={handleBlur("confirmPassword")}
        />
      </View>
      {errors.confirmPassword && touched.confirmPassword && (
        <Text style={styles.errorText}>{errors.confirmPassword}</Text>
      )}
      <CustomButton
        title="Sign up"
        style={{ marginTop: 20 }}
        onPress={handleSubmit}
        disabled={!isValid}
      />
      <Text style={{ marginTop: 10 }}>
        Already have an account?
        <Link href="/login" style={{ fontWeight: "bold" }}>
          Login
        </Link>
      </Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontWeight: "bold",
    fontSize: 50,
    marginBottom: 20,
  },
  inputView: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 25,
    height: 50,
    marginTop: 10,
    justifyContent: "center",
    padding: 20,
  },
  inputText: {
    height: 50,
    color: "#003f5c",
  },
  errorText: {
    fontSize: 10,
    color: "red",
  },
});

export default SignUp;
