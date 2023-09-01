import { createContext, useState, useEffect, useContext } from "react";
import { UserContext } from "./UserProvider";
import {
  getCartByUserId,
  getTotalPrice,
  addItemToCart,
  removeItemFromCart,
  deleleItemFromCart,
  clearCartItems,
} from "../api/cartService";
import { createOrder } from "../api/orderService";

export const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { user } = useContext(UserContext);
  const [cartItems, setCartItems] = useState([]);
  const [totalCartPrice, setTotalCartPrice] = useState(0);

  useEffect(() => {
    if (user != null) {
      getCartByUserId(user.id)
        .then((cart) => {
          const cartItems = cart.cartItems;
          setCartItems([...cartItems]);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [user]);

  useEffect(() => {
    if (user != null) {
      getTotalPrice(user.id)
        .then((totalPrice) => {
          setTotalCartPrice(totalPrice);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [cartItems]);

  const addCartItem = (productId) => {
    console.log("add item ", productId);
    addItemToCart(user.id, productId)
      .then((cartItem) => {
        console.log("cart item ", cartItem);
        const existingCartItemIndex = cartItems.findIndex(
          (item) => item.id === cartItem.id
        );

        if (existingCartItemIndex !== -1) {
          const updatedCartItems = [...cartItems];
          updatedCartItems[existingCartItemIndex].quantity += 1;
          setCartItems(updatedCartItems);
        } else {
          setCartItems((prevCartItems) => [...prevCartItems, cartItem]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const removeCartItem = (productId) => {
    const cartItem = getCartItemByProductId(productId);
    removeItemFromCart(user.id, cartItem.id)
      .then((updatedCart) => {
        const updatedCartItems = updatedCart.cartItems;
        setCartItems([...updatedCartItems]);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const deleteCartItem = (productId) => {
    const cartItem = getCartItemByProductId(productId);
    deleleItemFromCart(user.id, cartItem.id)
      .then((updatedCart) => {
        const updatedCartItems = updatedCart.cartItems;
        setCartItems([...updatedCartItems]);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const clearCart = (userId) => {
    clearCartItems(userId)
      .then((data) => {
        setCartItems([]);
        console.log(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const createOrderFromCart = (token) => {
    createOrder(user.id, cartItems, token)
      .then((order) => {
        console.log("order", order);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getCartItemByProductId = (productId) => {
    if (cartItems) {
      return cartItems.find((cartItem) => cartItem.product.id === productId);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addCartItem,
        removeCartItem,
        deleteCartItem,
        clearCart,
        createOrderFromCart,
        totalCartPrice,
        getCartItemByProductId,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
