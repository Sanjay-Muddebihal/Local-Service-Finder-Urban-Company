package com.localservice.config;

import com.localservice.model.Admin;
import com.localservice.model.User;
import com.localservice.repository.BookingRepository;
import com.localservice.repository.RatingRepository;
import com.localservice.repository.ServiceProviderRepository;
import com.localservice.repository.AdminRepository;
import com.localservice.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;


@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final ServiceProviderRepository repo;
    private final AdminRepository adminRepo;
    private final UserRepository userRepo;
    private final BookingRepository bookingRepo;
    private final RatingRepository ratingRepo;

    @Value("${app.admin.email:sanjay456@urbancompany.com}")
    private String adminEmail;

    @Value("${app.admin.password:Sanjay@8792}")
    private String adminPassword;

    @Override
    public void run(String... args) {
        // Seed admin even if providers already exist
        if (adminRepo.count() == 0) {
            Admin admin = new Admin();
            admin.setEmail(adminEmail);
            admin.setPassword(adminPassword);
            adminRepo.save(admin);
            System.out.println("Seeded admin: " + admin.getEmail());
        }

        // Seed a default user for login testing
        if (!userRepo.findByEmail("praveenhandagi98@gmail.com").isPresent()) {
            User user = new User();
            user.setName("Praveen Handagi");
            user.setEmail("praveenhandagi98@gmail.com");
            user.setMobile("7702288526");
            user.setPassword("Praveen@123");
            user.setRole("USER");
            userRepo.save(user);
            System.out.println("Seeded user: " + user.getEmail());
        }

        if (repo.count() > 0) {
            // Delete dependent entities first to avoid foreign key constraints
            bookingRepo.deleteAll();
            ratingRepo.deleteAll();
            repo.deleteAll(); // Remove all existing providers
        }

    }
}
