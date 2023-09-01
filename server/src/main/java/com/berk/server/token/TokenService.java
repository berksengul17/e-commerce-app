package com.berk.server.token;

import com.berk.server.user.User;
import com.berk.server.user.UserService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TokenService {

    private final TokenRepository tokenRepository;
    private final UserService userService;

    public TokenService(TokenRepository tokenRepository, UserService userService) {
        this.tokenRepository = tokenRepository;
        this.userService = userService;
    }

    public Token getTokenByUserId(Long userId) {
        return tokenRepository.findByUserId(userId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "There is no token associated with the user id " + userId));
    }

    public List<Token> getTokensByUserId(Long userId) {
        return tokenRepository.findAllByUserId(userId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "There is no token associated with the user id " + userId));
    }

    public Token saveToken(Long userId, String token) {
        try {
            getTokenByUserId(userId);
        } catch (IllegalArgumentException e) {
            User user = userService.getUserById(userId);
            Token newToken = new Token(token, user);
            return tokenRepository.save(newToken);
        }

        return null;
    }
}
