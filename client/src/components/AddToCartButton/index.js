import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../Button";
import { UserContext } from "../../context/UserProvider";
import { CartContext } from "../../context/CartProvider";

function AddToCartButton({ additionalClasses, productId }) {
  const { user } = useContext(UserContext);
  const { addCartItem, getCartItemByProductId } = useContext(CartContext);
  const navigate = useNavigate();

  const cartItem = getCartItemByProductId(productId);
  const cartItemCount = cartItem ? cartItem.quantity : 0;

  const addToCart = () => {
    if (user !== null) {
      addCartItem(productId);
    } else {
      navigate("/login");
    }
  };

  return (
    <>
      <Button
        additionalClasses={additionalClasses}
        text={
          cartItemCount > 0 && user
            ? `Add to Cart (${cartItemCount})`
            : "Add to Cart"
        }
        onClick={addToCart}
      />
    </>
  );
}

export default AddToCartButton;
