package com.berk.server.order;

import com.berk.server.cartItem.CartItem;
import com.berk.server.orderItem.OrderItem;
import com.berk.server.orderItem.OrderItemService;
import com.berk.server.product.Product;
import com.berk.server.product.ProductService;
import com.berk.server.user.User;
import com.berk.server.user.UserService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemService orderItemService;
    private final UserService userService;
    private final ProductService productService;

    public OrderService(OrderRepository orderRepository, OrderItemService orderItemService, UserService userService, ProductService productService) {
        this.orderRepository = orderRepository;
        this.orderItemService = orderItemService;
        this.userService = userService;
        this.productService = productService;
    }

    public Order getOrderById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException("Order with the id " + id + " is not found"));
    }

    public Order getOrderByUserId(Long userId) {
        return orderRepository.findByUserId(userId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Order associated with the user id " + userId + " is not found."));
    }


    public Order createOrder(Long userId, List<CartItem> cartItems) {
        Order order = new Order();
        User user = userService.getUserById(userId);
        List<OrderItem> orderItems = new ArrayList<>();
        for (CartItem cartItem : cartItems) {
            OrderItem orderItem = new OrderItem(cartItem.getQuantity(), order, cartItem.getProduct());
            orderItems.add(orderItem);
        }

        order.setUser(user);
        order.setOrderDate(LocalDateTime.now());
        order.setOrderItems(orderItems);

        user.addOrder(order);

        return orderRepository.save(order);
    }

    public OrderItem addItemToOrder(Long userId, Long productId) {
        Order order = getOrderByUserId(userId);
        List<OrderItem> orderItems = order.getOrderItems();
        OrderItem orderItem = orderItems.stream()
                .filter(item -> item.getProduct().getId().equals(productId))
                .findFirst()
                .orElse(null);

        Product product = productService.getProductById(productId);

        if (orderItem == null) {
            OrderItem newOrderItem = new OrderItem(1, order, product);
            orderItems.add(newOrderItem);
            return orderItemService.createOrderItem(newOrderItem);
        }
        Long id = orderItem.getId();
        int quantity = orderItem.getQuantity();
        return orderItemService.updateOrderItem(id, quantity + 1);
    }

    public void deleteOrder(Long id) {
        orderRepository.deleteById(id);
    }
}
