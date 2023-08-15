package com.berk.server.cart;

import com.berk.server.user.User;
import com.berk.server.user.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

@DataJpaTest
class CartRepositoryTest {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CartRepository cartRepository;

    @Test
    public void testFindByUserId_ExistingId() {
        User user = new User(1L, "John", "Doe", "john@example.com");
        userRepository.save(user);

        Cart cart = new Cart(user);
        cartRepository.save(cart);

        Optional<Cart> foundCart = cartRepository.findByUserId(user.getId());

        assertTrue(foundCart.isPresent());

    }

    @Test
    public void testFindByUserId_NonExistingId() {
        Optional<Cart> foundCart = cartRepository.findByUserId(1L);

        assertFalse(foundCart.isPresent());
    }
}