import React, { useContext } from "react";
import {
  View,
  Button,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
  Pressable,
} from "react-native";
import { CartContext } from "../context/CartProvider";

function QuantityPicker({ id, quantity }) {
  const { addCartItem, removeCartItem } = useContext(CartContext);

  const decrement = () => {
    removeCartItem(id);
  };
  const increment = () => {
    addCartItem(id);
  };

  return (
    <View style={styles.quantityPicker}>
      {quantity > 0 && (
        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed ? { opacity: 0.6 } : {},
          ]}
          onPress={decrement}
        >
          <Text style={styles.text}>−</Text>
        </Pressable>
      )}
      <TextInput
        value={quantity.toString()}
        readOnly={true}
        style={styles.quantityText}
      />
      <Pressable
        style={({ pressed }) => [
          styles.button,
          pressed ? { opacity: 0.6 } : {},
        ]}
        onPress={increment}
      >
        <Text style={styles.text}>+</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  quantityPicker: {
    alignSelf: "flex-start",
    flexDirection: "row",
    marginVertical: 10,
    marginHorizontal: 10,
  },
  button: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "black",
    textAlign: "center",
    height: 35,
  },
  quantityText: {
    height: 35,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderStyle: "solid",
    borderColor: "black",
    textAlign: "center",
    color: "black",
  },
});

export default QuantityPicker;
