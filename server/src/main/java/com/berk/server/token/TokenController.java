package com.berk.server.token;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;

@RestController
@RequestMapping("api/tokens")
public class TokenController {

    private final TokenService tokenService;

    public TokenController(TokenService tokenService) {
        this.tokenService = tokenService;
    }

    @GetMapping("/{userId}")
    public ResponseEntity<?> getTokensByUserId(@PathVariable Long userId) {
        try {
            return ResponseEntity.ok(tokenService.getTokensByUserId(userId));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(e.getMessage());
        }
    }

    @PostMapping("/{userId}/save-token")
    public ResponseEntity<?> saveToken(@PathVariable Long userId, @RequestBody String token) {
        try {
            String decodedToken = URLDecoder.decode(token, StandardCharsets.UTF_8);
            return ResponseEntity.ok(tokenService.saveToken(userId, decodedToken));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(e.getMessage());
        }
    }
}
