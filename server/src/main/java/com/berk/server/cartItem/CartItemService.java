package com.berk.server.cartItem;

import com.berk.server.cart.Cart;
import com.berk.server.product.Product;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CartItemService {

    private final CartItemRepository cartItemRepository;

    public CartItemService(CartItemRepository cartItemRepository) {
        this.cartItemRepository = cartItemRepository;
    }

    public CartItem getCartItemById(Long id) {
        return cartItemRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException("Cart item with the id " + id + " is not found."));
    }

    public CartItem createCartItem(CartItem cartItem) {
//        Product product = cartItem.getProduct();
//        Optional<CartItem> optionalCartItem =
//                cartItemRepository.findCartItemByProduct(product);
//
//        // if the card item with the given product exists
//        if (optionalCartItem.isPresent()) {
//            Cart cart = optionalCartItem.get().getCart();
//            // and if the id of the cart item's cart is equal to the
//            // id of the found cart item's cart then throw an error
//            if (cart.getId().equals(cartItem.getCart().getId())) {
//                throw new IllegalArgumentException(
//                    "Cart item with product id " + product.getId() + " already exists.");
//            }
//        }

        return cartItemRepository.save(cartItem);
    }

    public CartItem updateCartItem(Long id, int newQuantity) {
        CartItem cartItem = getCartItemById(id);
        cartItem.setQuantity(newQuantity);

        return cartItemRepository.save(cartItem);
    }

    public void deleteCartItem(CartItem item) {
        cartItemRepository.delete(item);
    }

    public void deleteAllByCartId(Long cartId) {
        cartItemRepository.deleteAllByCartId(cartId);
    }
}
