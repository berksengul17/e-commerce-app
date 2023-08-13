package com.berk.server.cart;

import com.berk.server.cartItem.CartItem;
import com.berk.server.user.User;
import com.berk.server.user.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/carts")
public class CartController {

    private final CartService cartService;
    private final UserService userService;

    public CartController(CartService cartService, UserService userService) {
        this.cartService = cartService;
        this.userService = userService;
    }

    @GetMapping("/{userId}")
    public ResponseEntity<?> getCartByUserId(@PathVariable Long userId) {
        try {
            Cart cart = cartService.getCartByUserId(userId);
            return ResponseEntity.ok(cart);
        } catch(IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(e.getMessage());
        }
    }

    @GetMapping("/{userId}/total-price")
    public ResponseEntity<?> getTotalPrice(@PathVariable Long userId) {
        try {
            double totalPrice = cartService.calculateTotalCartPrice(userId);
            return ResponseEntity.ok(totalPrice);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(e.getMessage());
        }
    }

    @PostMapping("/{userId}/create-cart")
    public ResponseEntity<?> createCart(@PathVariable Long userId) {
        try {
            User user = userService.getUserById(userId);
            Cart cart = cartService.createCart(user);
            if(cart != null) {
                return ResponseEntity.ok(cart);
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("User with id " + userId + " already has a cart");
            }
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(e.getMessage());
        }
    }

    @PostMapping("/{userId}/add/{productId}")
    public ResponseEntity<?> addItemToCart(@PathVariable Long userId,
                                           @PathVariable Long productId) {
        try {
            CartItem cartItem = cartService.addItemToCart(userId, productId);
            return ResponseEntity.ok(cartItem);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(e.getMessage());
        }
    }

    @DeleteMapping("/{userId}/remove/{itemId}")
    public ResponseEntity<?> removeItemFromCart(@PathVariable Long userId, @PathVariable Long itemId) {
        try {
            Cart updatedCart = cartService.removeItemFromCart(userId, itemId);
            return ResponseEntity.ok(updatedCart);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(e.getMessage());
        }
    }

    @DeleteMapping("/{userId}/delete/{itemId}")
    public ResponseEntity<?> deleteItemFromCart(@PathVariable Long userId, @PathVariable Long itemId) {
        try {
            Cart updatedCart = cartService.deleteItemFromCart(userId, itemId);
            return ResponseEntity.ok(updatedCart);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(e.getMessage());
        }
    }

    @DeleteMapping("/{userId}/clear-cart")
    public ResponseEntity<?> clearCart(@PathVariable Long userId) {
        try {
            cartService.clearCart(userId);
            return ResponseEntity.ok("Cart has been cleared.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(e.getMessage());
        }
    }
}