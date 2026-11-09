package com.localservice.controller;

import com.localservice.model.Rating;
import com.localservice.service.LocalService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("/api/ratings")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class RatingController {

    private final LocalService localService;

    @PostMapping
    public ResponseEntity<Rating> addRating(@RequestBody @NonNull Rating rating) {
        Rating saved = Objects.requireNonNull(localService.addRating(rating), "Rating save failed");
        return ResponseEntity.ok(saved);
    }

    @GetMapping
    public ResponseEntity<List<Rating>> getRatings(@RequestParam @NonNull Long providerId) {
        List<Rating> ratings = Objects.requireNonNull(
                localService.getRatings(providerId), "Ratings list is null");
        return ResponseEntity.ok(ratings);
    }
}
