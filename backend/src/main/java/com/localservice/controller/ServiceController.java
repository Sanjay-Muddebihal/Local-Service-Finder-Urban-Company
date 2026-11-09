package com.localservice.controller;

import com.localservice.model.ServiceProvider;
import com.localservice.service.LocalService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("/api/services")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class ServiceController {

    private final LocalService localService;

    @GetMapping
    public ResponseEntity<List<ServiceProvider>> search(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String city) {
        List<ServiceProvider> result = Objects.requireNonNull(
                localService.search(category, city), "Search returned null");
        return ResponseEntity.ok(result);
    }

    @GetMapping("/login")
    public ResponseEntity<ServiceProvider> login(
            @RequestParam @NonNull String phone,
            @RequestParam @NonNull String password) {
        ServiceProvider provider = Objects.requireNonNull(
                localService.loginProvider(phone, password), "Invalid provider credentials");
        return ResponseEntity.ok(provider);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ServiceProvider> getProvider(@PathVariable @NonNull Long id) {
        return ResponseEntity.ok(Objects.requireNonNull(localService.getProviderById(id), "Provider not found"));
    }

    @PostMapping
    public ResponseEntity<ServiceProvider> addProvider(
            @RequestBody @NonNull ServiceProvider provider) {
        ServiceProvider saved = Objects.requireNonNull(
                localService.addProvider(provider), "Provider save failed");
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ServiceProvider> updateProvider(
            @PathVariable @NonNull Long id,
            @RequestBody @NonNull ServiceProvider provider) {
        ServiceProvider updated = Objects.requireNonNull(
                localService.updateProvider(id, provider), "Provider update failed");
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProvider(@PathVariable @NonNull Long id) {
        localService.deleteProvider(id);
        return ResponseEntity.noContent().build();
    }
}
