import React, { useContext } from "react";
import { CartContext } from "../../context/CartProvider";
import CartItem from "../../components/CartItem";
import Button from "../../components/Button";
import { useNavigate } from "react-router-dom";
import styles from "./cart.module.css";

function Cart() {
  const { cartItems, totalCartPrice } = useContext(CartContext);
  const navigate = useNavigate();

  return (
    <div className={styles.cartContainer}>
      <h2>Cart ({cartItems.length} items)</h2>
      {cartItems.map((cartItem) => {
        return <CartItem key={cartItem.id} cartItem={cartItem} />;
      })}
      <p>Total price: ${(Math.round(totalCartPrice * 100) / 100).toFixed(2)}</p>
      <Button
        text="Checkout"
        onClick={() => navigate("/checkout", { state: { from: "cart" } })}
      />
    </div>
  );
}

export default Cart;
