package com.localservice.repository;

import com.localservice.model.ServiceProvider;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ServiceProviderRepository extends JpaRepository<ServiceProvider, Long> {
    List<ServiceProvider> findByCategoryIgnoreCaseAndCityIgnoreCase(String category, String city);
    List<ServiceProvider> findByCategoryIgnoreCase(String category);
    List<ServiceProvider> findByCityIgnoreCase(String city);
    Optional<ServiceProvider> findByPhoneAndPassword(String phone, String password);
    Optional<ServiceProvider> findByPhone(String phone);
}
