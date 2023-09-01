package com.berk.server.user;

import com.berk.server.cart.Cart;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException("User with the id " + id  + " is not found."));
    }

    public User signUpUser(User user) {
        boolean userExists = userRepository
                .findByEmail(user.getEmail()).isPresent();

        if(userExists) {
            throw new IllegalArgumentException("Email is already taken");
        }

        Cart cart = new Cart(user);
        user.setCart(cart);
        System.out.println(cart.getUser().getFirstName());
        return userRepository.save(user);
    }

    public User loginUser(User userCredentials) {
        Optional<User> optionalUser = userRepository.findByEmail(userCredentials.getEmail());

        if(optionalUser.isPresent()) {
            User user = optionalUser.get();
            if (user.getPassword().equals(userCredentials.getPassword())) {
                return new User(user.getId(), user.getFirstName(), user.getLastName(),
                                user.getEmail(), user.getCart());
            }
        }

        return null;
    }

}
