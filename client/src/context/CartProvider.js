import { createContext, useState, useEffect } from "react";

export const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState({});
  const [totalCartPrice, setTotalCartPrice] = useState(0);

  const addCartItem = (productId) => {
    setCartItems((prev) => ({
      ...prev,
      [productId]: prev[productId] ? prev[productId] + 1 : 1,
    }));
  };

  const removeCartItem = (productId) => {
    setCartItems((prev) => ({ ...prev, [productId]: prev[productId] - 1 }));
  };

  const updateCartItemCount = (newAmount, productId) => {
    setCartItems((prev) => ({ ...prev, [productId]: newAmount }));
  };

  // const getTotalCartPrice = async () => {
  //   let totalPrice = 0;
  //   const promises = [];

  //   for (const item in cartItems) {
  //     // if bloğu kaldırılabilir
  //     // eğer 0 dan büyük olacağı garanti olursa ki öyle gibi
  //     if (cartItems[item] > 0) {
  //       const promise = getProductById(item)
  //         .then((product) => {
  //           console.log("product", product);
  //           console.log("item", cartItems[item]);
  //           totalPrice += cartItems[item] * product.price;
  //         })
  //         .catch((error) => {
  //           console.log(
  //             "Error while calculating the total cart price: ",
  //             error
  //           );
  //         });

  //       promises.push(promise);
  //     }
  //   }

  //   await Promise.all(promises);

  //   return totalPrice;
  // };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addCartItem,
        removeCartItem,
        updateCartItemCount,
        totalCartPrice,
        setTotalCartPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
