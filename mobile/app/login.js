import React, { useContext, useState } from "react";
import { StyleSheet, Text, View, TextInput } from "react-native";
import { Link, router } from "expo-router";
import CustomButton from "../components/CustomButton";
import { login } from "../api/userService";
import { UserContext } from "../context/UserProvider";

function Login() {
  const { loginUser } = useContext(UserContext);
  const [error, setError] = useState(null);
  const [userCredentials, setUserCredentials] = useState({
    email: "",
    password: "",
  });

  // router.replace çalışmıyor
  const handleLogin = () => {
    console.log(userCredentials);
    login(userCredentials)
      .then((data) => {
        loginUser(data);
        console.log(data);
        router.push("/home");
      })
      .catch((error) => {
        setError(error);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}> Login</Text>
      <View style={styles.errorMessage}>
        <Text>{error ? error : ""}</Text>
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
      <CustomButton title="Login" onPress={handleLogin} />
      <Text style={{ marginTop: 10 }}>
        Don't have an account?{" "}
        <Link href="/signUp" style={{ fontWeight: "bold" }}>
          Sign up
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

export default Login;
