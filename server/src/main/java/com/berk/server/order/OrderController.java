package com.berk.server.order;

import com.berk.server.cartItem.CartItem;
import com.berk.server.notification.FirebaseMessagingService;
import com.berk.server.notification.NotificationInfo;
import com.berk.server.token.Token;
import com.berk.server.token.TokenService;
import com.berk.server.user.User;
import com.berk.server.user.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;
    private final TokenService tokenService;
    private final UserService userService;
    private final FirebaseMessagingService firebaseMessagingService;


    public OrderController(OrderService orderService, TokenService tokenService, UserService userService, FirebaseMessagingService firebaseMessagingService) {
        this.orderService = orderService;
        this.tokenService = tokenService;
        this.userService = userService;
        this.firebaseMessagingService = firebaseMessagingService;
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<?> getOrderById(@PathVariable Long orderId) {
        try {
            Order order = orderService.getOrderById(orderId);
            return ResponseEntity.ok(order);
        } catch(IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(e.getMessage());
        }
    }

    @PostMapping("/{userId}/create-order")
    public ResponseEntity<?> createOrder(@PathVariable Long userId,
                                         @RequestBody List<CartItem> cartItems,
                                         @RequestParam String tokenVal) {
        try {
            Order order = orderService.createOrder(userId, cartItems);
            User user = userService.getUserById(userId);
            Token token = new Token(tokenVal, user);
            NotificationInfo notificationInfo = new NotificationInfo("Success", "Your order has been created");
            firebaseMessagingService.sendNotification(token, notificationInfo);
            return ResponseEntity.ok(order);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(e.getMessage());
        }
    }

    @DeleteMapping("/{orderId}")
    public ResponseEntity<?> deleteOrder(@PathVariable Long orderId) {
        try {
            orderService.deleteOrder(orderId);
            return ResponseEntity.ok("Order with id " + orderId + " has been deleted");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(e.getMessage());
        }
    }
}
