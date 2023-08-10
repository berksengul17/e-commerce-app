import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../Button";
import styles from "./product.module.css";
import { UserContext } from "../../context/UserProvider";
import { CartContext } from "../../context/CartProvider";

function Product({ product }) {
  const { user } = useContext(UserContext);
  const { cartItems, addCartItem } = useContext(CartContext);
  const navigate = useNavigate();

  const addToCart = () => {
    if (user !== null) {
      console.log("Product with id has been added to the cart: ", product.id);
      addCartItem(product.id);
      console.log(cartItems);
    } else {
      navigate("/login");
    }
  };

  return (
    <li className={styles.product}>
      <Link to={`/products/${product.id}`}>
        <img src={product.image} alt="product-img" />
        <div className={styles.productInfo}>
          <p>{product.name}</p>
          <p>${product.price}</p>
        </div>
      </Link>
      <Button
        text={
          "Add to Cart" +
          (cartItems[product.id] ? ` (${cartItems[product.id]})` : "")
        }
        onClick={addToCart}
      />
    </li>
  );
}

export default Product;
