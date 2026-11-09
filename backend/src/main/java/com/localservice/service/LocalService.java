package com.localservice.service;

import com.localservice.model.*;
import com.localservice.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
@Transactional
@SuppressWarnings("null")
public class LocalService {

    private final ServiceProviderRepository providerRepo;
    private final BookingRepository         bookingRepo;
    private final RatingRepository          ratingRepo;
    private final UserRepository            userRepo;
    private final AdminRepository           adminRepo;
    private final NotificationService       notificationService;

    // ── Search ────────────────────────────────────────────────────────────────
    @Transactional(readOnly = true)
    @NonNull
    public List<ServiceProvider> search(String category, String city) {
        List<ServiceProvider> result;
        if (category != null && !category.isBlank() && city != null && !city.isBlank())
            result = providerRepo.findByCategoryIgnoreCaseAndCityIgnoreCase(category, city);
        else if (category != null && !category.isBlank())
            result = providerRepo.findByCategoryIgnoreCase(category);
        else if (city != null && !city.isBlank())
            result = providerRepo.findByCityIgnoreCase(city);
        else
            result = providerRepo.findAll();
        return new ArrayList<>(Objects.requireNonNull(result, "Repository returned null"));
    }

    @NonNull
    public ServiceProvider addProvider(@NonNull ServiceProvider provider) {
        if (provider.getPhone() != null && providerRepo.findByPhone(provider.getPhone()).isPresent()) {
            throw new RuntimeException("Provider phone already registered");
        }
        if (provider.getPassword() == null || provider.getPassword().isBlank()) {
            provider.setPassword("Provider@123");
        }
        if (provider.getAvailable() == null) {
            provider.setAvailable(true);
        }
        return Objects.requireNonNull(providerRepo.save(provider), "Failed to save provider");
    }

    @NonNull
    public User addUser(@NonNull User user) {
        if (user.getEmail() == null || user.getEmail().isBlank()) {
            throw new RuntimeException("Email is required");
        }
        if (user.getPassword() == null || user.getPassword().isBlank()) {
            throw new RuntimeException("Password is required");
        }
        if (userRepo.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already registered");
        }
        if (user.getMobile() != null && userRepo.existsByMobile(user.getMobile())) {
            throw new RuntimeException("Mobile number already registered");
        }
        user.setRole("USER");
        return Objects.requireNonNull(userRepo.save(user), "Failed to register user");
    }

    @Transactional(readOnly = true)
    @NonNull
    public User loginUser(@NonNull String email, @NonNull String password) {
        return userRepo.findByEmailAndPassword(email, password)
                .or(() -> userRepo.findByMobileAndPassword(email, password))
                .orElseThrow(() -> new RuntimeException("Invalid user credentials"));
    }

    @Transactional(readOnly = true)
    @NonNull
    public Admin loginAdmin(@NonNull String email, @NonNull String password) {
        return adminRepo.findByEmailAndPassword(email, password)
                .orElseThrow(() -> new RuntimeException("Invalid admin credentials"));
    }

    @Transactional(readOnly = true)
    @NonNull
    public User getUserById(@NonNull Long id) {
        return userRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found: " + id));
    }

    @NonNull
    public User updateUser(@NonNull Long id, @NonNull User user) {
        User existing = getUserById(id);

        if (user.getName() != null) existing.setName(user.getName());
        if (user.getEmail() != null) existing.setEmail(user.getEmail());
        if (user.getMobile() != null) existing.setMobile(user.getMobile());
        if (user.getPassword() != null && !user.getPassword().isBlank()) existing.setPassword(user.getPassword());

        return Objects.requireNonNull(userRepo.save(existing), "Failed to update user");
    }

    public void deleteUser(@NonNull Long id) {
        if (!userRepo.existsById(id)) {
            throw new RuntimeException("User not found: " + id);
        }
        userRepo.deleteById(id);
    }

    @Transactional(readOnly = true)
    @NonNull
    public List<User> getAllUsers() {
        return new ArrayList<>(Objects.requireNonNull(userRepo.findAll(), "Repository returned null"));
    }

    @NonNull
    public Admin updateAdmin(@NonNull Long id, @NonNull Admin admin) {
        Admin existing = adminRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Admin not found: " + id));

        if (admin.getEmail() != null) existing.setEmail(admin.getEmail());
        if (admin.getPassword() != null && !admin.getPassword().isBlank()) existing.setPassword(admin.getPassword());

        return Objects.requireNonNull(adminRepo.save(existing), "Failed to update admin");
    }

    @Transactional(readOnly = true)
    @NonNull
    public ServiceProvider getProviderById(@NonNull Long id) {
        return providerRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Provider not found: " + id));
    }

    @Transactional(readOnly = true)
    @NonNull
    public ServiceProvider loginProvider(@NonNull String phone, @NonNull String password) {
        return providerRepo.findByPhoneAndPassword(phone, password)
                .orElseThrow(() -> new RuntimeException("Invalid provider credentials"));
    }

    @NonNull
    public ServiceProvider updateProvider(@NonNull Long id, @NonNull ServiceProvider provider) {
        ServiceProvider existing = providerRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Provider not found: " + id));

        if (provider.getName() != null) existing.setName(provider.getName());
        if (provider.getCategory() != null) existing.setCategory(provider.getCategory());
        if (provider.getCity() != null) existing.setCity(provider.getCity());
        if (provider.getPhone() != null) existing.setPhone(provider.getPhone());
        if (provider.getPassword() != null && !provider.getPassword().isBlank()) existing.setPassword(provider.getPassword());
        if (provider.getExperience() != null) existing.setExperience(provider.getExperience());
        if (provider.getPrice() != 0) existing.setPrice(provider.getPrice());
        if (provider.getAvgRating() != 0) existing.setAvgRating(provider.getAvgRating());
        if (provider.getTotalRatings() != 0) existing.setTotalRatings(provider.getTotalRatings());
        if (provider.getAvailable() != null) existing.setAvailable(provider.getAvailable());

        return Objects.requireNonNull(providerRepo.save(existing), "Failed to update provider");
    }

    public void deleteProvider(@NonNull Long id) {
        if (!providerRepo.existsById(id)) {
            throw new RuntimeException("Provider not found: " + id);
        }
        providerRepo.deleteById(id);
    }

    // ── Booking ───────────────────────────────────────────────────────────────
    @NonNull
    public Booking book(@NonNull Booking booking) {
        booking.setStatus("PENDING");

        // Validate provider exists
        if (booking.getProvider() == null || booking.getProvider().getId() == null) {
            throw new RuntimeException("Provider is required for booking");
        }

        // Verify provider exists in database
        ServiceProvider provider = providerRepo.findById(booking.getProvider().getId())
                .orElseThrow(() -> new RuntimeException("Provider not found: " + booking.getProvider().getId()));

        if (booking.getPaymentTransactionId() == null || booking.getPaymentTransactionId().isBlank()) {
            throw new RuntimeException("Payment transaction ID is required");
        }
        if (booking.getAmount() == null) {
            booking.setAmount(provider.getPrice() + 49.0);
        }

        Booking saved = Objects.requireNonNull(bookingRepo.save(booking), "Failed to save booking");

        try {
            String serviceDesc = booking.getDescription() != null ?
                    booking.getDescription() : provider.getCategory();

            String message = String.format(
                    "🔔 New Service Booking!\n" +
                            "Customer: %s\n" +
                            "Phone: %s\n" +
                            "Service: %s\n" +
                            "Address: %s\n" +
                            "Status: %s\n" +
                            "Please log in to confirm or decline.",
                    saved.getCustomerName(),
                    saved.getCustomerPhone(),
                    serviceDesc,
                    saved.getAddress(),
                    saved.getStatus()
            );

            notificationService.sendSMS(provider.getPhone(), message);
        } catch (Exception e) {
            // Log error but don't fail the booking due to notification issues
            System.err.println("Notification failed but booking succeeded: " + e.getMessage());
        }

        return saved;
    }

    @Transactional(readOnly = true)
    @NonNull
    public List<Booking> getBookingsByPhone(@NonNull String phone) {
        return new ArrayList<>(Objects.requireNonNull(
                bookingRepo.findByCustomerPhone(phone), "Repository returned null"));
    }

    @Transactional(readOnly = true)
    @NonNull
    public List<Booking> getBookingsByProviderId(@NonNull Long providerId) {
        return new ArrayList<>(Objects.requireNonNull(
                bookingRepo.findByProviderId(providerId), "Repository returned null"));
    }

    @Transactional(readOnly = true)
    @NonNull
    public List<Booking> getAllBookings() {
        return new ArrayList<>(Objects.requireNonNull(
                bookingRepo.findAll(), "Repository returned null"));
    }

    @NonNull
    public Booking updateStatus(@NonNull Long id, @NonNull String status) {
        Booking b = bookingRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found: " + id));
        b.setStatus(status);
        return Objects.requireNonNull(bookingRepo.save(b), "Failed to update booking");
    }

    // ── Rating ────────────────────────────────────────────────────────────────
    @NonNull
    public Rating addRating(@NonNull Rating rating) {
        ServiceProvider provider = rating.getProvider();
        if (provider == null)
            throw new RuntimeException("Provider is required for rating");

        Long providerId = Objects.requireNonNull(provider.getId(), "Provider ID must not be null");
        Rating saved    = Objects.requireNonNull(ratingRepo.save(rating), "Failed to save rating");

        List<Rating> all = new ArrayList<>(Objects.requireNonNull(
                ratingRepo.findByProviderId(providerId), "Repository returned null"));

        double avg = all.stream().mapToInt(Rating::getStars).average().orElse(0.0);

        ServiceProvider p = providerRepo.findById(providerId)
                .orElseThrow(() -> new RuntimeException("Provider not found: " + providerId));
        p.setAvgRating(Math.round(avg * 10.0) / 10.0);
        p.setTotalRatings(all.size());
        providerRepo.save(p);

        return saved;
    }

    @Transactional(readOnly = true)
    @NonNull
    public List<Rating> getRatings(@NonNull Long providerId) {
        return new ArrayList<>(Objects.requireNonNull(
                ratingRepo.findByProviderId(providerId), "Repository returned null"));
    }
}
