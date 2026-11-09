package com.localservice.controller;

import com.localservice.model.User;
import com.localservice.service.LocalService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;
import java.util.Objects;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class AuthController {

    private final LocalService localService;

    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody @NonNull User user) {
        try {
            User saved = Objects.requireNonNull(localService.addUser(user), "User registration failed");
            return ResponseEntity.ok(saved);
        } catch (RuntimeException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, ex.getMessage(), ex);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<User> login(@RequestBody @NonNull Map<String, String> credentials) {
        try {
            String email    = Objects.requireNonNull(credentials.get("email"), "Email is required");
            String password = Objects.requireNonNull(credentials.get("password"), "Password is required");
            User user = Objects.requireNonNull(localService.loginUser(email, password), "Invalid credentials");
            return ResponseEntity.ok(user);
        } catch (RuntimeException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, ex.getMessage(), ex);
        }
    }
}
