package com.sadms.backend.repository;

import com.sadms.backend.model.Shop;
import com.sadms.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ShopRepository extends JpaRepository<Shop, Long> {
    Optional<Shop> findByUser(User user);
}
