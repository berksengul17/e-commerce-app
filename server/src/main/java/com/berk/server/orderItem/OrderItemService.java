package com.berk.server.orderItem;

import org.springframework.stereotype.Service;

@Service
public class OrderItemService {

    private final OrderItemRepository orderItemRepository;

    public OrderItemService(OrderItemRepository orderItemRepository) {
        this.orderItemRepository = orderItemRepository;
    }

    public OrderItem getOrderItemById(Long id) {
        return orderItemRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException("Order item with the id " + id + " is not found"));
    }
    public OrderItem createOrderItem(OrderItem orderItem) {
        return orderItemRepository.save(orderItem);
    }

    public OrderItem updateOrderItem(Long id, int newQuantity) {
        OrderItem orderItem = getOrderItemById(id);
        orderItem.setQuantity(newQuantity);

        return orderItemRepository.save(orderItem);
    }

}
