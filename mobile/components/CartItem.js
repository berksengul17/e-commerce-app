import { View, Image, Text, StyleSheet, Pressable } from "react-native";
import { useContext } from "react";
import { CartContext } from "../context/CartProvider";
import QuantityPicker from "./QuantityPicker";
import { FontAwesome } from "@expo/vector-icons";

function CartItem({ cartItem }) {
  const { deleteCartItem } = useContext(CartContext);
  const product = cartItem.product;
  const quantity = cartItem.quantity;

  return (
    <>
      {product && (
        <View style={styles.itemContainer}>
          <Image source={{ uri: product.image }} style={styles.itemImage} />
          <View style={styles.textContainer}>
            <Text>{product.name}</Text>
            <Pressable
              style={({ pressed }) => [
                styles.deleteBtn,
                pressed ? { opacity: 0.6 } : {},
              ]}
              onPress={() => deleteCartItem(product.id)}
            >
              <FontAwesome name="trash-o" size={24} />
            </Pressable>
            <QuantityPicker id={product.id} quantity={quantity} />
            <Text style={styles.priceText}>
              ${(Math.round(quantity * product.price * 100) / 100).toFixed(2)}
            </Text>
          </View>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  itemImage: {
    width: 100,
    height: 150,
    resizeMode: "contain",
    marginRight: 10,
    borderRadius: 5,
  },
  deleteBtn: {
    alignSelf: "flex-end",
  },
  textContainer: {
    width: "100%",
    flexShrink: 1,
  },
  priceText: {
    alignSelf: "flex-end",
  },
});

export default CartItem;
