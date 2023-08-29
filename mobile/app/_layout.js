import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import { UserProvider } from "../context/UserProvider";
import { CartProvider } from "../context/CartProvider";

const StackLayout = () => {
  return (
    <SafeAreaView style={styles.container}>
      <UserProvider>
        <CartProvider>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="login" options={{ headerShown: false }} />
            <Stack.Screen name="signUp" options={{ headerShown: false }} />
            <Stack.Screen name="checkout" options={{ headerShown: false }} />
          </Stack>
        </CartProvider>
      </UserProvider>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
});

export default StackLayout;
