package com.berk.server.user;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
class UserRepositoryTest {

    @Autowired
    private UserRepository userRepository;

    @Test
    public void testFindByEmail_ExistingEmail() {
        String email = "user@gmail.com";
        User user = new User(1L, "User", "User", email);

        userRepository.save(user);
        Optional<User> result = userRepository.findByEmail(email);

        assertTrue(result.isPresent());
    }

    @Test
    public void testFindByEmail_NonExistingEmail() {
        String email = "user@gmail.com";

        Optional<User> result = userRepository.findByEmail(email);

        assertFalse(result.isPresent());
    }
}