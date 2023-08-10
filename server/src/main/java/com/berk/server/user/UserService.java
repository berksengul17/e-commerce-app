package com.berk.server.user;

import org.springframework.stereotype.Service;

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

    public void registerUser(User user) {
        boolean userExists = userRepository
                .findByEmail(user.getEmail()).isPresent();

        if(userExists) {
            throw new IllegalArgumentException("Email is already taken");
        }

        userRepository.save(user);
    }

    public String loginUser(User userCredentials) {
        User user = userRepository.findByEmail(userCredentials.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("User does not exist."));

        if (user.getPassword().equals(userCredentials.getPassword())) {
            return user.getFirstName() + " " + user.getLastName();
        }

        return "";
    }

}
