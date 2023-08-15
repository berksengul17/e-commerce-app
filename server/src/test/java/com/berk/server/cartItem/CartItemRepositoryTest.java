package com.berk.server.cartItem;

import com.berk.server.cart.Cart;
import com.berk.server.cart.CartRepository;
import com.berk.server.product.Product;
import com.berk.server.product.ProductRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.annotation.DirtiesContext;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
// It indicates the associated test or class modifies the ApplicationContext.
// It tells the testing framework to close and recreate the context for later tests.
@DirtiesContext(classMode = DirtiesContext.ClassMode.BEFORE_EACH_TEST_METHOD)
class CartItemRepositoryTest {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Test
    public void testFindCartItemByProduct_ExistingProduct() {
        Cart cart = new Cart();
        cartRepository.save(cart);

        Product product = new Product(1L, "Product 1", 10.0);
        CartItem cartItem = new CartItem(1L, 2, null, product);
        cartItemRepository.save(cartItem);

        Optional<CartItem> foundCartItem = cartItemRepository.findCartItemByProduct(product);

        assertTrue(foundCartItem.isPresent());
        assertEquals(cartItem, foundCartItem.get());
    }

    @Test
    public void testFindCartItemByProduct_NonExistingProduct() {
        Product product = new Product(1L, "Product 1", 10.0);

        Optional<CartItem> foundCartItem = cartItemRepository.findCartItemByProduct(product);

        assertFalse(foundCartItem.isPresent());
    }

    @Test
    public void testDeleteAllByCartId_ExistingId() {

        Cart cart = new Cart();
        cartRepository.save(cart);

        Product product1 = new Product(1L, "Product 1", 10.0);
        Product product2 = new Product(2L, "Product 2", 20.0);
        product1 = productRepository.save(product1);
        product2 = productRepository.save(product2);

        CartItem cartItem1 = new CartItem(2, cart, product1);
        CartItem cartItem2 = new CartItem(3, cart, product2);
        cartItemRepository.saveAll(List.of(cartItem1, cartItem2));

        cartItemRepository.deleteAllByCartId(cart.getId());

        List<CartItem> remainingCartItems = cartItemRepository.findAll();
        assertTrue(remainingCartItems.isEmpty());
    }

    @Test
    public void testDeleteAllByCartId_NonExistingId() {

        Long nonExistingId = 100L;

        Cart cart = new Cart();
        cartRepository.save(cart);

        Product product1 = new Product(1L, "Product 1", 10.0);
        Product product2 = new Product(2L, "Product 2", 20.0);
        product1 = productRepository.save(product1);
        product2 = productRepository.save(product2);

        CartItem cartItem1 = new CartItem(2, cart, product1);
        CartItem cartItem2 = new CartItem(3, cart, product2);
        cartItemRepository.saveAll(List.of(cartItem1, cartItem2));
        cartItemRepository.deleteAllByCartId(nonExistingId);

        List<CartItem> remainingCartItems = cartItemRepository.findAll();

        assertEquals(2, remainingCartItems.size());
    }

}