package com.berk.server.cart;

import com.berk.server.product.Product;
import com.berk.server.product.ProductRepository;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CartItemRequest {
    private Long productId;
    private int quantity;

    public Product getProduct(ProductRepository productRepository) {
        return productRepository.findById(productId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Product with the id " + productId + " is not found."));
    }
}
