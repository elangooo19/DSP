package com.sadms.backend.repository;

import com.sadms.backend.model.Customer;
import com.sadms.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CustomerRepository extends JpaRepository<Customer, Long> {
    Optional<Customer> findByUser(User user);
    Optional<Customer> findByRfidCard(String rfidCard);
    Optional<Customer> findByAadhaarId(String aadhaarId);
    boolean existsByAadhaarId(String aadhaarId);
    boolean existsByRfidCard(String rfidCard);
}
