package com.localservice.controller;

import com.localservice.model.Admin;
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
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class AdminController {

    private final LocalService localService;

    @PostMapping("/login")
    public ResponseEntity<Admin> login(@RequestBody @NonNull Map<String, String> credentials) {
        try {
            String email    = Objects.requireNonNull(credentials.get("email"), "Email is required");
            String password = Objects.requireNonNull(credentials.get("password"), "Password is required");
            Admin admin = Objects.requireNonNull(localService.loginAdmin(email, password), "Invalid admin credentials");
            return ResponseEntity.ok(admin);
        } catch (RuntimeException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, ex.getMessage(), ex);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Admin> updateAdmin(@PathVariable @NonNull Long id, @RequestBody @NonNull Admin admin) {
        try {
            return ResponseEntity.ok(localService.updateAdmin(id, admin));
        } catch (RuntimeException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, ex.getMessage(), ex);
        }
    }
}
