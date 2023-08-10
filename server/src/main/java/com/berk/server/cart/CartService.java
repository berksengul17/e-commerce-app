package com.berk.server.cart;

import com.berk.server.cartItem.CartItem;
import com.berk.server.cartItem.CartItemRepository;
import com.berk.server.product.Product;
import com.berk.server.product.ProductRepository;
import com.berk.server.user.User;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;

    public CartService(CartRepository cartRepository, CartItemRepository cartItemRepository, ProductRepository productRepository) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
    }

    public Cart getCartById(Long cartId) {
        return cartRepository.findById(cartId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Cart with the id " + cartId + " is not found."));
    }

    public Cart getCartByUserId(Long userId) {
        return cartRepository.findByUserId(userId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Cart associated with the user id " + userId + " is not found."));
    }

    public Cart createCart(User user) {
        if(user.getCart() == null){
            Cart cart = new Cart(user);
            user.setCart(cart);
            return cartRepository.save(cart);
        }

        return null;
    }

    public List<CartItem> getCartItems(User user) {
        Cart cart = user.getCart();
        if (cart != null) {
            return cart.getCartItems();
        }
        return null;
    }

    public Cart addItemToCart(Long userId, CartItemRequest request) {
        Cart cart = getCartByUserId(userId);

        Product product = request.getProduct(productRepository);
        int quantity = request.getQuantity();
        CartItem cartItem = new CartItem(quantity, cart, product);
        cartItemRepository.save(cartItem);
        cart.getCartItems().add(cartItem);

        return cart;
    }

    public double calculateTotalCartPrice(User user) {
        List<CartItem> cartItems = getCartItems(user);
        double total = 0;

        if (cartItems != null) {
            for (CartItem cartItem : cartItems) {
                Product product = cartItem.getProduct();
                total += cartItem.getQuantity() * product.getPrice();
            }
        }

        return total;
    }

    public void removeItemFromCart(User user, Product product) {
        Cart cart = user.getCart();
        if (cart != null) {
            List<CartItem> cartItems = cart.getCartItems();
            CartItem cartItemToRemove = cartItems.stream()
                    .filter(item -> item.getProduct().equals(product))
                    .findFirst()
                    .orElse(null);

            if (cartItemToRemove != null) {
                cartItems.remove(cartItemToRemove);
                cartItemRepository.delete(cartItemToRemove);
                cartRepository.save(cart);
            }
        }
    }
}
