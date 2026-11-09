package com.localservice.repository;

import com.localservice.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByCustomerPhone(String phone);
    List<Booking> findByProviderId(Long providerId);
}
