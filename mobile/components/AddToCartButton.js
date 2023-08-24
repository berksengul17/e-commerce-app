import { View, Text } from "react-native";
import React, { useContext } from "react";
import { router } from "expo-router";
import { UserContext } from "../context/UserProvider";
import { CartContext } from "../context/CartProvider";
import CustomButton from "./CustomButton";

function AddToCartButton({ style, productId }) {
  const { user } = useContext(UserContext);
  const { addCartItem, getCartItemByProductId } = useContext(CartContext);

  const cartItem = getCartItemByProductId(productId);
  const cartItemCount = cartItem ? cartItem.quantity : 0;

  const addToCart = () => {
    if (user !== null) {
      addCartItem(productId);
    } else {
      router.push("/login");
    }
  };

  return (
    <>
      <CustomButton
        style={style}
        title={
          cartItemCount > 0 && user
            ? `Add to Cart (${cartItemCount})`
            : "Add to Cart"
        }
        onPress={addToCart}
      />
    </>
  );
}

export default AddToCartButton;
