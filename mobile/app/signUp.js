import { View, Text, StyleSheet, TextInput } from "react-native";
import React, { useState } from "react";
import { Link, router } from "expo-router";
import CustomButton from "../components/CustomButton";
import { signUp } from "../api/userService";

function SignUp() {
  const [error, setError] = useState(null);
  const [userCredentials, setUserCredentials] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // TODO login sayfasına başarılı mesajıyla git
  const handleSignUp = () => {
    if (userCredentials.password !== userCredentials.confirmPassword) {
      setError("Passwords does not match");
    } else {
      signUp(userCredentials)
        .then((data) => {
          setError(null);
          console.log(data);
          router.push("/login");
        })
        .catch((error) => {
          setError(error);
        });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}> Sign Up</Text>
      <View style={styles.errorMessage}>
        <Text>{error ? error : ""}</Text>
      </View>
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="First Name"
          placeholderTextColor="#003f5c"
          onChangeText={(text) =>
            setUserCredentials({ ...userCredentials, firstName: text })
          }
        />
      </View>
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="Last Name"
          placeholderTextColor="#003f5c"
          onChangeText={(text) =>
            setUserCredentials({ ...userCredentials, lastName: text })
          }
        />
      </View>
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="Email"
          placeholderTextColor="#003f5c"
          onChangeText={(text) =>
            setUserCredentials({ ...userCredentials, email: text })
          }
        />
      </View>
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          secureTextEntry
          placeholder="Password"
          placeholderTextColor="#003f5c"
          onChangeText={(text) =>
            setUserCredentials({ ...userCredentials, password: text })
          }
        />
      </View>
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          secureTextEntry
          placeholder="Confirm Password"
          placeholderTextColor="#003f5c"
          onChangeText={(text) =>
            setUserCredentials({ ...userCredentials, confirmPassword: text })
          }
        />
      </View>
      <CustomButton title="Sign up" onPress={handleSignUp} />
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
  errorMessage: {
    color: "rgb(214, 42, 42)",
  },
  title: {
    fontWeight: "bold",
    fontSize: 50,
    marginBottom: 40,
  },
  inputView: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 25,
    height: 50,
    marginBottom: 20,
    justifyContent: "center",
    padding: 20,
  },
  inputText: {
    height: 50,
    color: "#003f5c",
  },
});

export default SignUp;
