package com.berk.server.user;

import com.berk.server.cart.Cart;
import com.berk.server.cart.CartRepository;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final CartRepository cartRepository;

    public UserService(UserRepository userRepository, CartRepository cartRepository) {
        this.userRepository = userRepository;
        this.cartRepository = cartRepository;
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException("User with the id " + id  + " is not found."));
    }

    public void signUpUser(User user) {
        boolean userExists = userRepository
                .findByEmail(user.getEmail()).isPresent();

        if(userExists) {
            throw new IllegalArgumentException("Email is already taken");
        }

        Cart cart = new Cart(user);
        user.setCart(cart);
        userRepository.save(user);
    }

    public User loginUser(User userCredentials) {
        User user = userRepository.findByEmail(userCredentials.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("User does not exist."));

        if (user.getPassword().equals(userCredentials.getPassword())) {
            return new User(user.getId(), user.getFirstName(), user.getLastName(),
                            user.getEmail(), user.getCart());
        }

        return null;
    }

}
