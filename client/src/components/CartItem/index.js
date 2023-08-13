import React, { useContext } from "react";
import QuantityPicker from "../QuantityPicker";
import styles from "./cartItem.module.css";
import Button from "../Button";
import { CartContext } from "../../context/CartProvider";

function CartItem({ cartItem }) {
  const { deleteCartItem } = useContext(CartContext);
  const product = cartItem.product;
  const quantity = cartItem.quantity;

  return (
    <>
      {product && (
        <div className={styles.cartItemContainer}>
          <img src={product.image} alt="product" />
          <p>{product.name}</p>
          <p>
            ${(Math.round(quantity * product.price * 100) / 100).toFixed(2)}
          </p>
          <QuantityPicker id={product.id} quantity={quantity} />
          <Button text="Remove" onClick={() => deleteCartItem(product.id)} />
        </div>
      )}
    </>
  );
}

export default CartItem;
