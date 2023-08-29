import { View, Text, StyleSheet, FlatList } from "react-native";
import React, { useContext } from "react";
import { Link } from "expo-router";
import { CartContext } from "../../context/CartProvider";
import CartItem from "../../components/CartItem";
import CustomButton from "../../components/CustomButton";

function Cart() {
  const { cartItems, totalCartPrice } = useContext(CartContext);

  return (
    <View style={styles.cartContainer}>
      <Text style={styles.cartTitle}>Cart ({cartItems.length} items)</Text>
      <FlatList
        style={{ width: "100%" }}
        data={cartItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <CartItem cartItem={item} />}
      />
      <View style={styles.checkoutContainer}>
        <Text style={styles.totalPrice}>
          Total price: ${(Math.round(totalCartPrice * 100) / 100).toFixed(2)}
        </Text>
        <Link href="/checkout" disabled={cartItems.length == 0 ? true : false}>
          <CustomButton
            title="Checkout"
            disabled={cartItems.length == 0 ? true : false}
          />
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cartContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  cartTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  checkoutContainer: {
    flexDirection: "row",
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    gap: 50,
  },
  totalPrice: {
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default Cart;
