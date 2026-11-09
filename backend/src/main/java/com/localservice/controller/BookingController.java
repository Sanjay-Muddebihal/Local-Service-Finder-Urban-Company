package com.localservice.controller;

import com.localservice.model.Booking;
import com.localservice.service.LocalService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class BookingController {

    private final LocalService localService;

    @PostMapping
    public ResponseEntity<Booking> book(@RequestBody @NonNull Booking booking) {
        Booking saved = Objects.requireNonNull(localService.book(booking), "Booking save failed");
        return ResponseEntity.ok(saved);
    }

    @GetMapping
    public ResponseEntity<List<Booking>> getBookings(
            @RequestParam(required = false) String phone,
            @RequestParam(required = false) Long providerId) {
        List<Booking> result;
        if (providerId != null) {
            result = localService.getBookingsByProviderId(providerId);
        } else if (phone != null && !phone.isBlank()) {
            result = localService.getBookingsByPhone(phone);
        } else {
            result = localService.getAllBookings();
        }
        return ResponseEntity.ok(Objects.requireNonNull(result, "Bookings list is null"));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Booking> updateStatus(
            @PathVariable @NonNull Long id,
            @RequestParam @NonNull String status) {
        Booking updated = Objects.requireNonNull(
                localService.updateStatus(id, status), "Update failed");
        return ResponseEntity.ok(updated);
    }
}
