package com.berk.server.cart;

import com.berk.server.cartItem.CartItem;
import com.berk.server.cartItem.CartItemService;
import com.berk.server.product.Product;
import com.berk.server.product.ProductService;
import com.berk.server.user.User;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemService cartItemService;
    private final ProductService productService;

    public CartService(CartRepository cartRepository,
                       CartItemService cartItemService, ProductService productService) {
        this.cartRepository = cartRepository;
        this.cartItemService = cartItemService;
        this.productService = productService;
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

    public CartItem addItemToCart(Long userId, Long productId) {
        Cart cart = getCartByUserId(userId);
        List<CartItem> cartItems = cart.getCartItems();
        CartItem cartItem = cartItems.stream()
                .filter(item -> item.getProduct().getId().equals(productId))
                .findFirst()
                .orElse(null);

        Product product = productService.getProductById(productId);

        if (cartItem == null) {
            CartItem newCartItem = new CartItem(1, cart, product);
            cartItems.add(newCartItem);
            return cartItemService.createCartItem(newCartItem);
        }
        Long id = cartItem.getId();
        int quantity = cartItem.getQuantity();
        return cartItemService.updateCartItem(id, quantity + 1);
    }

    // TODO make the remove item from cart method only about decreasing
    // do the deletion operation with delete item from cart method
    // this can be handled in the frontend

    public Cart removeItemFromCart(Long userId, Long itemId) {
        Cart cart = getCartByUserId(userId);
        List<CartItem> cartItems = cart.getCartItems();
        CartItem cartItem = cartItemService.getCartItemById(itemId);

        int quantity = cartItem.getQuantity();
        if (quantity > 1) {
            Long id = cartItem.getId();
            // TODO is this really necessary?
            cartItem.setQuantity(quantity - 1);
            cartItemService.updateCartItem(id, quantity - 1);
        } else {
            cartItems.remove(cartItem);
            cartItemService.deleteCartItem(cartItem);
        }

        cartRepository.save(cart);
        return cart;
    }

    public Cart deleteItemFromCart(Long userId, Long itemId) {
        Cart cart = getCartByUserId(userId);
        List<CartItem> cartItems = cart.getCartItems();
        CartItem cartItem = cartItemService.getCartItemById(itemId);

        cartItems.remove(cartItem);
        cartItemService.deleteCartItem(cartItem);

        cartRepository.save(cart);
        return cart;
    }

    public void clearCart(Long userId) {
        Cart cart = getCartByUserId(userId);
        List<CartItem> cartItems = cart.getCartItems();

        cartItems.clear();
        cartItemService.deleteAllByCartId(cart.getId());
        cartRepository.save(cart);
    }

    public double calculateTotalCartPrice(Long userId) {
        Cart cart = getCartByUserId(userId);
        List<CartItem> cartItems = cart.getCartItems();
        double total = 0;

        if (cartItems != null) {
            for (CartItem cartItem : cartItems) {
                Product product = cartItem.getProduct();
                total += cartItem.getQuantity() * product.getPrice();
            }
        }

        return total;
    }
}
